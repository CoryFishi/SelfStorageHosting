import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE, ROUTES } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";
import { PKG_ROOT } from "./helpers/walk";

describe("robots", () => {
  const r = robots();

  it("points at the absolute sitemap url", () => {
    expect(r.sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });

  const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
  const disallow = ([] as string[]).concat(rule.disallow ?? []);
  const allow = ([] as string[]).concat(rule.allow ?? []);

  // How Google and Bing resolve robots.txt: the longest matching rule wins,
  // and Allow wins a tie. A path matches a rule when it starts with it.
  function crawlable(path: string): boolean {
    const longest = (rules: string[]) =>
      Math.max(-1, ...rules.filter((p) => path.startsWith(p)).map((p) => p.length));
    return longest(allow) >= longest(disallow);
  }

  it("resolves rules the way crawlers do", () => {
    // Pins crawlable() itself, so a broken matcher cannot wave the next two
    // tests through.
    expect(crawlable("/user/dashboard")).toBe(false);
    expect(crawlable("/api/contact")).toBe(false);
    expect(crawlable("/")).toBe(true);
    expect(crawlable("/resources")).toBe(true);
  });

  // Application surface, blocked from crawling on purpose.
  it("disallows private application areas", () => {
    for (const p of ["/user/", "/api/"]) expect(disallow).toContain(p);
  });

  // Google fetches the favicon and share image like any other URL; a blocked
  // one is shown as a generic globe or not at all.
  it("leaves the icons, the manifest and the share image crawlable", () => {
    for (const p of ["/favicon.ico", "/icon.png", "/apple-icon.png", "/manifest.webmanifest", SITE.ogImage]) {
      expect(crawlable(p), p).toBe(true);
    }
  });

  // The rule this file previously had backwards twice. First it required
  // /case-studies to be disallowed while the page also carried noindex; then
  // it exempted everything under /user/ on the grounds that nothing links
  // there, while the top bar links /user/login from every page. Disallow and
  // noindex are alternatives, not layers: a Disallow stops the fetch, so the
  // crawler never reads the noindex, and a linked URL can still be indexed
  // with nothing to tell it the page was meant to be excluded. Every noindex
  // page, wherever it lives, has to be fetchable.
  it("never blocks a noindex page, so its noindex can actually be read", () => {
    const noindex = Object.entries(ROUTES)
      .filter(([, v]) => !v.indexable && v.built)
      .map(([path]) => path);

    // Anti-vacuity, and proof the /user/ pages are in scope.
    expect(noindex).toContain("/case-studies");
    expect(noindex).toContain("/user/login");

    const blocked = noindex.filter((p) => !crawlable(p));
    expect(
      blocked,
      `noindex, but robots.txt blocks the fetch, so the noindex is never seen: ${blocked.join(", ")}`
    ).toEqual([]);
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);

  it("contains every indexable route as an absolute url", () => {
    expect(urls).toContain(SITE.url);
    expect(urls).toContain(`${SITE.url}/contact`);
  });

  it("excludes every noindex route", () => {
    for (const p of ["/case-studies", "/user/login", "/user/register"]) {
      expect(urls).not.toContain(`${SITE.url}${p}`);
    }
  });

  it("has no trailing slashes and no duplicates", () => {
    for (const u of urls) expect(u.endsWith("/")).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("omits changeFrequency and priority, which Google ignores", () => {
    for (const e of entries) {
      expect(e).not.toHaveProperty("changeFrequency");
      expect(e).not.toHaveProperty("priority");
    }
  });

  it("dates each article from lib/articles.ts and no other page", () => {
    const expected = new Map(
      ARTICLES.map((a) => [canonicalFor(articlePath(a.slug)), a.dateModified ?? a.datePublished])
    );
    for (const e of entries) {
      expect(e.lastModified, e.url).toBe(expected.get(e.url));
    }
    // Every article is in the sitemap, so every expected date was checked.
    for (const u of expected.keys()) expect(urls).toContain(u);
  });

  it("covers exactly the indexable routes in the manifest", () => {
    const expected = Object.entries(ROUTES).filter(([, m]) => m.indexable && m.built).length;
    expect(urls.length).toBe(expected);
  });
});

// Every [[redirects]] table in netlify.toml, as key -> value with quotes
// stripped. Enough TOML for the flat tables Netlify redirects are; a table
// ends at the next [header].
function netlifyRedirects(): Record<string, string>[] {
  const toml = readFileSync(path.join(PKG_ROOT, "netlify.toml"), "utf8");
  const blocks: Record<string, string>[] = [];
  let current: Record<string, string> | null = null;
  for (const raw of toml.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (line.startsWith("[")) {
      current = line === "[[redirects]]" ? {} : null;
      if (current) blocks.push(current);
      continue;
    }
    const kv = current && line.match(/^([A-Za-z_]+)\s*=\s*(.+)$/);
    if (current && kv) current[kv[1]] = kv[2].replace(/^"(.*)"$/, "$1");
  }
  return blocks;
}

describe("netlify.toml", () => {
  // selfstoragehosting.netlify.app served the whole site as indexable 200s,
  // a duplicate of production on a second host.
  it("301s the default Netlify subdomain to the canonical host", () => {
    const rule = netlifyRedirects().find((r) => r.from === "https://selfstoragehosting.netlify.app/*");
    expect(rule, "no redirect from selfstoragehosting.netlify.app").toBeDefined();
    expect(rule).toMatchObject({ to: `${SITE.url}/:splat`, status: "301", force: "true" });
  });

  it("never redirects the canonical host, which would loop", () => {
    const host = new URL(SITE.url).host;
    const bad = netlifyRedirects().filter((r) => r.from?.includes(host));
    expect(bad).toEqual([]);
  });
});

// Spec 15.8: the old SPA fallback (`/* /index.html 200`) answered every URL
// with a 200, so a typo'd link was a soft 404 and Google read the catch-all
// instead of robots.txt and the sitemap. Unknown paths now get Next's 404,
// with a real 404 status and a noindex. Guard both places Netlify reads
// rewrites from; the status itself can only be checked after a deploy
// (docs/deploy-checklist.md).
describe("no catch-all rewrite (spec 15.8)", () => {
  // A _redirects line sending every path somewhere with a 200 (a rewrite).
  const CATCH_ALL_LINE = /^\s*\/\*\s+\S+\s+200!?(?:\s|$)/;

  it("recognises a catch-all line when it sees one", () => {
    // Pins the matcher, so a broken pattern cannot wave the next test through.
    expect(CATCH_ALL_LINE.test("/*    /index.html   200")).toBe(true);
    expect(CATCH_ALL_LINE.test("/* /index.html 200!")).toBe(true);
    expect(CATCH_ALL_LINE.test("/old/* /new/:splat 301")).toBe(false);
  });

  it("has no public/_redirects rule rewriting everything with a 200", () => {
    const file = path.join(PKG_ROOT, "public", "_redirects");
    if (!existsSync(file)) return;
    const catchAll = readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((l) => CATCH_ALL_LINE.test(l));
    expect(catchAll).toEqual([]);
  });

  it("has no netlify.toml redirect rewriting everything with a 200", () => {
    // Anti-vacuity: the parser does find the one redirect the file has.
    expect(netlifyRedirects().length).toBeGreaterThan(0);
    const catchAll = netlifyRedirects().filter((r) => r.from?.endsWith("/*") && r.status === "200");
    expect(catchAll).toEqual([]);
  });
});
