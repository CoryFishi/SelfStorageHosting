import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES, SITE } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { assertNoForbiddenTypes } from "@/lib/schema";
import { formatDateRange } from "@/lib/dates";
import { OUTAGE_BEHAVIOR } from "@/lib/claims";
import { PKG_ROOT, walk } from "./helpers/walk";
import { allowedLink } from "./helpers/links";

// Checks the HTML that `next build` wrote, not the source that produced it.
// It needs a fresh build, so a plain `npm test` skips it. Run it with:
//   npm run build && RENDERED=1 npx vitest run tests/rendered.test.ts
const RUN = process.env.RENDERED === "1";
const OUT = path.join(PKG_ROOT, ".next", "server", "app");
const built = Object.keys(ROUTES).filter((r) => ROUTES[r].built);

const htmlFile = (route: string) =>
  path.join(OUT, route === "/" ? "index.html" : `${route.slice(1)}.html`);
const read = (route: string) => readFileSync(htmlFile(route), "utf8");

// Drop every <script> except JSON-LD. The React Server Components payload
// repeats each string on the page, so counting without this doubles.
function visible(html: string): string {
  return html.replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, "");
}

function jsonLd(html: string): unknown[] {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]) as unknown
  );
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&");
}

// The plain text a reader sees for one row: its own ld+json script removed
// (so a check can't pass by matching the still-embedded JSON rather than the
// visible DOM), tags and HTML comments stripped (React inserts "<!-- -->"
// between adjacent text nodes, e.g. "Organizer: <!-- -->SSAM"), entities
// decoded, and whitespace collapsed.
function rowText(rowHtml: string): string {
  const noScripts = rowHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, " ");
  const noComments = noScripts.replace(/<!--[\s\S]*?-->/g, "");
  const noTags = noComments.replace(/<[^>]+>/g, " ");
  return decodeEntities(noTags).replace(/\s+/g, " ").trim();
}

type EventBlock = {
  name: string;
  url: string;
  startDate: string;
  endDate: string;
  organizer: { name: string };
  location: { name: string; address: Record<string, string> };
};

const isEventBlock = (b: unknown): b is EventBlock => (b as { "@type"?: unknown })["@type"] === "Event";

describe.skipIf(!RUN)("rendered HTML", () => {
  it("has a prerendered file for every built route", () => {
    expect(built.length).toBeGreaterThanOrEqual(3);
    const missing = built.filter((r) => !existsSync(htmlFile(r)));
    expect(missing, `no prerendered HTML for: ${missing.join(", ")}`).toEqual([]);
  });

  it.each(built)("%s renders exactly one h1", (r) => {
    const n = (visible(read(r)).match(/<h1\b/g) ?? []).length;
    expect(n, `${r} renders ${n} h1 elements`).toBe(1);
  });

  it("gives every built route its own title and description", () => {
    const seen = new Map<string, string>();
    const clashes: string[] = [];
    for (const r of built) {
      const html = read(r);
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
      expect(title, `${r} has no <title>`).toBeTruthy();
      expect(desc, `${r} has no meta description`).toBeTruthy();
      for (const [kind, value] of [["title", title], ["description", desc]] as const) {
        const key = `${kind}:${value}`;
        const other = seen.get(key);
        if (other) clashes.push(`${r} reuses the ${kind} of ${other}`);
        else seen.set(key, r);
      }
    }
    expect(clashes).toEqual([]);
  });

  it.each(built)("%s renders its canonical and the right robots rule", (r) => {
    const html = read(r);
    expect(html).toContain(`<link rel="canonical" href="${canonicalFor(r)}"/>`);
    const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? "";
    expect(robots.includes("noindex"), `${r} robots is "${robots}"`).toBe(!ROUTES[r].indexable);
  });

  it("renders only links the link rule allows", () => {
    let checked = 0;
    const bad: string[] = [];
    for (const r of built) {
      for (const m of visible(read(r)).matchAll(/<a\b[^>]*\shref="(\/[^"?#]*)/g)) {
        checked++;
        if (!allowedLink(m[1])) bad.push(`${r} -> ${m[1]}`);
      }
    }
    // Every page carries at least the logo, a nav link and a footer link.
    expect(checked).toBeGreaterThanOrEqual(built.length * 3);
    expect(bad, `rendered links that must not exist: ${bad.join(", ")}`).toEqual([]);
  });

  it.each(built)("%s emits only allowed JSON-LD, with breadcrumbs off the home page", (r) => {
    const blocks = jsonLd(read(r));
    expect(blocks.length, `${r} emits no JSON-LD`).toBeGreaterThan(0);
    for (const b of blocks) assertNoForbiddenTypes(b);
    const crumbs = blocks.some((b) => JSON.stringify(b).includes('"@type":"BreadcrumbList"'));
    expect(crumbs, `${r} BreadcrumbList present`).toBe(r !== "/");
  });

  it("shows a visible row for every Event it marks up on /events", () => {
    const html = read("/events");
    const events = jsonLd(html).filter(isEventBlock);
    // When this fails, every listed event has passed. It is not a code bug:
    // lib/events.ts is due its quarterly review (spec 14 E1).
    expect(events.length, "/events rendered no upcoming events; review lib/events.ts").toBeGreaterThan(0);

    // Breadcrumbs renders its own <ol> earlier in the page; find the
    // upcoming-events list by its accessible label, not a class string
    // that says nothing about what the element is. Fail loudly if it is
    // missing while events exist, rather than silently matching nothing.
    const olMatch = /<ol\b[^>]*\baria-labelledby="upcoming-events"[^>]*>[\s\S]*?<\/ol>/.exec(html);
    expect(olMatch, '/events has no <ol aria-labelledby="upcoming-events"> of upcoming events').not.toBeNull();
    const olHtml = olMatch![0];
    const rows = [...olHtml.matchAll(/<li\b[^>]*>[\s\S]*?<\/li>/g)].map((m) => m[0]);

    // Every Event block on the whole page must correspond to a visible row,
    // not just every Event block inside the <ol>: a stray block rendered
    // outside the list would otherwise go unnoticed by an in-list-only count.
    expect(
      rows.length,
      `/events marks up ${events.length} Events but shows ${rows.length} rows`
    ).toBe(events.length);

    const blocksInOl = jsonLd(olHtml).filter(isEventBlock);
    expect(
      rows.length,
      `/events has ${rows.length} rows but ${blocksInOl.length} Event blocks inside the list`
    ).toBe(blocksInOl.length);

    for (const row of rows) {
      const block = jsonLd(row).find(isEventBlock);
      expect(block, "a row in the events list has no Event block of its own").toBeDefined();
      const e = block!;
      const text = rowText(row);
      const wanted: [string, string][] = [
        ["name", e.name],
        ["dates", formatDateRange(e.startDate, e.endDate)],
        ["venue", e.location.name],
        ...Object.entries(e.location.address)
          .filter(([k]) => k !== "@type" && k !== "addressCountry")
          .map(([k, v]) => [k, v] as [string, string]),
        ["organizer", e.organizer.name],
      ];
      for (const [field, value] of wanted) {
        expect(text, `${e.name}: ${field} "${value}" is missing from the visible row`).toContain(value);
      }
      expect(row, `${e.name}: no visible link to ${e.url}`).toContain(`href="${e.url}"`);
    }
  });

  it("loads nothing from another origin, as /legal/privacy says", () => {
    const siteOrigin = new URL(SITE.url).origin;

    // Every URL a tag's src/href points to, plus every URL named in a
    // srcset (comma-separated "url descriptor" entries -- only the URL part
    // of each entry matters here).
    function tagUrls(tag: string): string[] {
      const urls = [...tag.matchAll(/\b(?:src|href)="([^"]*)"/g)].map((m) => m[1]);
      for (const m of tag.matchAll(/\bsrcset="([^"]*)"/g)) {
        for (const entry of m[1].split(",")) {
          const url = entry.trim().split(/\s+/)[0];
          if (url) urls.push(url);
        }
      }
      return urls;
    }

    // Resolves against SITE.url so a bare "//host/path" (protocol-relative)
    // and a relative "/path" both resolve the way a browser would, then
    // compares origins rather than prefixes: a prefix check (u.startsWith)
    // would wrongly clear "https://selfstoragehosting.com.evil.example/x".
    // data:/mailto:/tel: URLs are inline or non-fetching, not off-site.
    function isOffSite(url: string): boolean {
      if (/^(?:data|mailto|tel|javascript):/i.test(url)) return false;
      try {
        return new URL(url, SITE.url).origin !== siteOrigin;
      } catch {
        return false;
      }
    }

    const offsite: string[] = [];

    for (const r of built) {
      const html = read(r);
      // Tags whose URL the browser fetches while it renders the page. Links a
      // visitor clicks (<a>) and the canonical and alternate <link>s are not
      // fetched, so they are not counted. Read the raw HTML: visible() drops
      // <script src> tags, and those are exactly what this test is for.
      const tags = [...html.matchAll(/<(?:script|img|iframe|link|source|video|audio)\b[^>]*>/g)]
        .map((m) => m[0])
        .filter((tag) => !/\brel="(?:canonical|alternate)"/.test(tag));

      // Proves the tag scan matches the markup Next actually writes, for
      // THIS route -- checking it once for the whole site would still pass
      // if only one of seventeen routes carried the proof tag.
      expect(
        tags.some((tag) => /\bsrc="\/_next\/static\//.test(tag)),
        `${r} has no <script src="/_next/static/…"> tag; the tag scan may not be matching real markup`
      ).toBe(true);

      for (const tag of tags) {
        for (const url of tagUrls(tag)) {
          if (isOffSite(url)) offsite.push(`${r} -> ${url}`);
        }
      }
    }

    // The policy also promises the site's fonts and images come from this
    // site -- which its built CSS could break on its own (a @font-face src
    // or a background-image url()) even when every HTML tag above is clean.
    const cssFiles = walk(path.join(PKG_ROOT, ".next", "static"), /\.css$/);
    expect(cssFiles.length, "no built CSS files found under .next/static").toBeGreaterThan(0);
    for (const file of cssFiles) {
      const css = readFileSync(file, "utf8");
      const rel = path.relative(PKG_ROOT, file);
      for (const m of css.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)) {
        if (isOffSite(m[2])) offsite.push(`${rel} -> ${m[2]}`);
      }
      for (const m of css.matchAll(/@import\s+(?:url\(\s*)?(['"])([^'")]+)\1/g)) {
        if (isOffSite(m[2])) offsite.push(`${rel} -> ${m[2]}`);
      }
    }

    expect(offsite, `off-site resources: ${offsite.join(", ")}`).toEqual([]);
  });

  it("marks INSOMNIAC with ® at its first use on each page, and only there (spec 13)", () => {
    const checked: string[] = [];
    const bad: string[] = [];
    for (const r of built) {
      const html = read(r);
      // The body without any script. The RSC payload and JSON-LD repeat text
      // that is not a separate use on the page. Attributes stay in, because a
      // placeholder is visible text.
      const body = html.slice(html.indexOf("<body")).replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      const uses = [...body.matchAll(/INSOMNIAC(®|&reg;|&#174;)?/g)].map((m) => m[1] !== undefined);
      if (uses.length === 0) continue;
      checked.push(r);
      if (!uses[0]) bad.push(`${r}: the first INSOMNIAC has no ®`);
      if (uses.slice(1).some(Boolean)) bad.push(`${r}: ® repeated after the first use`);
    }
    // /about-us, /contact, /demo, access control hosting, /support, /legal/trademarks.
    expect(checked.length).toBeGreaterThanOrEqual(5);
    expect(bad, bad.join("; ")).toEqual([]);
  });

  it("shows the exact outage wording where it is promised (spec 14 D3)", () => {
    for (const r of ["/", "/about-us", "/solutions/access-control-hosting"]) {
      expect(
        visible(read(r)),
        `${r} does not render the exact OUTAGE_BEHAVIOR text`
      ).toContain(OUTAGE_BEHAVIOR);
    }
  });
});
