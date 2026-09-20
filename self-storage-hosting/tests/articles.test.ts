import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { Metadata } from "next";
import { ARTICLES, article, articlePath } from "@/lib/articles";
import { ROUTES } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { isIsoDate } from "@/lib/dates";
import { pageFiles } from "./helpers/pages";

// A /resources/<slug> route, as opposed to the /resources hub itself.
const ARTICLE_ROUTE = /^\/resources\/[^/]+$/;

// The `sources={[ ... ]}` argument of a page's <SourceList>, brackets
// balanced, or null if the page renders none. Same idea as crumbsArg in
// tests/breadcrumbs.test.ts: SOURCES keys are plain identifiers with no
// brackets, so counting brackets is enough.
function sourceListArg(src: string): string | null {
  const tag = src.indexOf("<SourceList");
  if (tag === -1) return null;
  const attr = src.indexOf("sources=", tag);
  if (attr === -1) return null;
  const open = src.indexOf("[", attr);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
}

const keysIn = (s: string) => new Set([...s.matchAll(/\bSOURCES\.(\w+)\b/g)].map((m) => m[1]));

describe("article registry", () => {
  it("has five articles with unique kebab-case slugs", () => {
    const slugs = ARTICLES.map((a) => a.slug);
    expect(slugs.length).toBe(5);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  it("lists the same articles as ROUTES and as the pages on disk", () => {
    const registry = ARTICLES.map((a) => articlePath(a.slug)).sort();
    const routes = Object.keys(ROUTES)
      .filter((r) => ARTICLE_ROUTE.test(r))
      .sort();
    const pages = [...pageFiles().keys()].filter((r) => ARTICLE_ROUTE.test(r)).sort();
    expect(routes).toEqual(registry);
    expect(pages).toEqual(registry);
  });

  it("gives each article unique, short-enough text", () => {
    for (const key of ["headline", "title", "description"] as const) {
      const values = ARTICLES.map((a) => a[key]);
      expect(new Set(values).size, `duplicate ${key}`).toBe(values.length);
    }
    for (const a of ARTICLES) {
      // The layout appends " | Self Storage Hosting" (23 characters). 40 + 23
      // keeps the full <title> near the width search results show.
      expect(a.title.length, `${a.slug} title`).toBeLessThanOrEqual(40);
      expect(a.description.length, `${a.slug} description`).toBeLessThanOrEqual(155);
    }
  });

  it("dates each article with real days, none in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const a of ARTICLES) {
      expect(isIsoDate(a.datePublished), `${a.slug} datePublished`).toBe(true);
      expect(a.datePublished <= today, `${a.slug} is published in the future`).toBe(true);
      if (a.dateModified !== undefined) {
        expect(isIsoDate(a.dateModified), `${a.slug} dateModified`).toBe(true);
        expect(a.dateModified > a.datePublished, `${a.slug} dateModified must be after datePublished`).toBe(
          true
        );
        expect(a.dateModified <= today, `${a.slug} is modified in the future`).toBe(true);
      }
    }
  });

  it("throws on an unknown slug", () => {
    expect(() => article("no-such-article")).toThrow('No article with slug "no-such-article" in lib/articles.ts');
  });
});

describe.each(ARTICLES.map((a) => [a.slug, a] as const))("article page %s", (slug, a) => {
  const route = articlePath(slug);
  const file = pageFiles().get(route);
  const src = file ? readFileSync(file, "utf8") : "";

  it("exists", () => {
    expect(file, `${route} has no page.tsx`).toBeDefined();
  });

  it("exports the registry's title, description, canonical and dates", async () => {
    const mod = (await import(pathToFileURL(file!).href)) as { metadata: Metadata };
    const m = mod.metadata;
    expect(m.title).toBe(a.title);
    expect(m.description).toBe(a.description);
    expect(m.alternates?.canonical).toBe(canonicalFor(route));
    expect(m.openGraph).toMatchObject({ type: "article", publishedTime: a.datePublished });
    if (a.dateModified === undefined) expect(m.openGraph).not.toHaveProperty("modifiedTime");
    else expect(m.openGraph).toMatchObject({ modifiedTime: a.dateModified });
  });

  it("renders its own registry entry as the h1, byline and Article", () => {
    expect(src).toContain(`article("${slug}")`);
    expect(src).toMatch(/<h1\b[^>]*>\s*\{A\.headline\}\s*<\/h1>/);
    expect(src).toMatch(/<ArticleDates article=\{A\}\s*\/>/);
    expect(src).toMatch(/<JsonLd data=\{articleSchema\(\{\s*\.\.\.A,\s*path:\s*articlePath\(A\.slug\)\s*\}\)\}\s*\/>/);
  });

  it("says it is not affiliated with the companies it names", () => {
    expect(src).toContain("not affiliated with");
  });

  it("lists exactly the sources it cites", () => {
    const list = sourceListArg(src);
    expect(list, `${route} renders no <SourceList sources={[...]} />`).not.toBeNull();
    const listed = keysIn(list!);
    const cited = keysIn(src.replace(list!, ""));
    expect(listed.size, `${route} lists no sources`).toBeGreaterThan(0);
    expect([...cited].filter((k) => !listed.has(k)), `${route} cites these but does not list them`).toEqual([]);
    expect([...listed].filter((k) => !cited.has(k)), `${route} lists these but never cites them`).toEqual([]);
  });
});
