import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { SITE, ROUTES } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";

describe("robots", () => {
  const r = robots();

  it("points at the absolute sitemap url", () => {
    expect(r.sitemap).toBe(`${SITE.url}/sitemap.xml`);
  });

  const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
  const disallow = (rule.disallow ?? []) as string[];

  // Application surface, blocked from crawling on purpose: not marketing
  // pages, nothing links to them, and keeping crawlers out costs no indexing
  // we want. Everything else stays crawlable.
  const CRAWL_BLOCKED = ["/user/", "/api/"];

  it("disallows private application areas", () => {
    for (const p of CRAWL_BLOCKED) expect(disallow).toContain(p);
  });

  // The rule this file previously had backwards: it required /case-studies to
  // be disallowed while the page also carries noindex. Those are alternatives,
  // not layers. A Disallow stops the fetch, so the crawler never reads the
  // noindex, and the URL can still be indexed from an external link with
  // nothing to tell it the page was meant to be excluded. To keep a page out
  // of the index you have to let it be fetched.
  it("never disallows a noindex page, so its noindex can actually be read", () => {
    const noindex = Object.entries(ROUTES)
      .filter(([, v]) => !v.indexable && v.built)
      .map(([path]) => path)
      .filter((path) => !CRAWL_BLOCKED.some((b) => path.startsWith(b)));

    // Anti-vacuity: if ROUTES ever stops carrying such a page this test would
    // pass while checking nothing, and the regression could return unnoticed.
    expect(noindex.length, "no crawlable noindex route left to check").toBeGreaterThan(0);

    for (const path of noindex) {
      const blocking = disallow.filter((d) => path === d || path.startsWith(d));
      expect(
        blocking,
        `${path} is noindex, but robots.txt blocks it via ${blocking.join(", ")} — ` +
          `the crawler cannot fetch the page, so it never sees the noindex`
      ).toEqual([]);
    }
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
