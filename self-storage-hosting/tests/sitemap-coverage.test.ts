import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES, indexableRoutes } from "@/lib/site";
import { walkFrom } from "./helpers/walk";

const APP_DIR = path.resolve(__dirname, "../app");

// Maps each routable URL to the page.tsx that serves it. Step 6c needs the file
// path and Step 6b needs the URL, so the walk returns both rather than existing
// twice in two shapes. The file listing itself comes from the shared walker;
// only the URL-from-path shape is specific to this test.
function pageFiles(): Map<string, string> {
  const pages = new Map<string, string>();
  for (const file of walkFrom("app", /^page\.tsx$/)) {
    const rel = path.relative(APP_DIR, path.dirname(file));
    // Route groups like (marketing) do not appear in the URL.
    const segments = rel === "" ? [] : rel.split(path.sep).filter((s) => !s.startsWith("("));
    pages.set(segments.length === 0 ? "/" : "/" + segments.join("/"), file);
  }
  return pages;
}

// URLs that exist on disk as a page.tsx but are deliberately not in ROUTES.
// Empty today -- every page this repo builds is manifest-tracked. A future
// entry here must carry its own reason; it is never a silent catch-all.
const UNMANAGED_PAGES: string[] = [];

describe("sitemap coverage", () => {
  it("every route the sitemap emits has a page on disk", () => {
    const pages = pageFiles();
    expect(indexableRoutes().filter((r) => !pages.has(r))).toEqual([]);
  });

  // The inverse: a page that exists but is flagged `built: false` is silently
  // missing from the sitemap, which is the quieter and more likely mistake.
  it("every page on disk that is in ROUTES is flagged built", () => {
    const unflagged = [...pageFiles().keys()].filter((u) => ROUTES[u] && !ROUTES[u].built);
    expect(unflagged).toEqual([]);
  });

  // The third case: a page.tsx that isn't in ROUTES at all. It ships
  // crawlable, is absent from sitemap.xml, and is invisible to every other
  // guard in this file, since they all key off ROUTES or indexableRoutes().
  it("every page on disk has a ROUTES entry", () => {
    const unmapped = [...pageFiles().keys()].filter(
      (u) => !(u in ROUTES) && !UNMANAGED_PAGES.includes(u)
    );
    expect(unmapped, `page(s) on disk with no ROUTES entry: ${unmapped.join(", ")}`).toEqual([]);
  });

  it("is actually checking something", () => {
    expect(indexableRoutes()).toEqual(["/", "/about-us", "/contact"]);
  });
});

describe("canonical declarations", () => {
  it("declares no default canonical in any layout, by either route", () => {
    // A layout fails this two ways: a literal `alternates:` object, or
    // `export const metadata = pageMeta({...})` -- pageMeta() always returns
    // an object containing `alternates`, so that idiom (the one four page.tsx
    // files in this repo use) sets the same default canonical for every
    // descendant with no literal "alternates:" anywhere in the layout's own
    // source. Matching only the first shape left this guard green while every
    // marketing page under a `pageMeta()`-calling layout claimed to be the
    // same URL; two commits on this branch exist for exactly that bug.
    // pageMeta() belongs in page.tsx only -- never in a layout.
    const offenders = walkFrom("app", /^layout\.tsx$/)
      .filter((f) => /alternates\s*:|pageMeta\s*\(/.test(readFileSync(f, "utf8")))
      .map((f) => path.relative(APP_DIR, f));
    expect(
      offenders,
      `layouts must not set a canonical by either route -- a literal "alternates:" or a ` +
        `pageMeta() call, which belongs in page.tsx only: ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("gives every built, indexable route its own canonical via pageMeta", () => {
    const pages = pageFiles();
    for (const route of indexableRoutes()) {
      const file = pages.get(route);
      expect(file, `${route} has no page.tsx on disk`).toBeDefined();
      const src = readFileSync(file!, "utf8");
      expect(src, `${route} must call pageMeta`).toMatch(/pageMeta\(\{/);
      // Built from a plain string with the backslash doubled, so the regex
      // engine receives `\s` (whitespace) rather than a literal "s". Inside a
      // template literal `\s` collapses the same way, and inside a
      // single-quoted string a *single* backslash also collapses to a bare
      // "s" (neither form recognises `\s` as a string escape) -- only the
      // doubled backslash below survives into the RegExp as intended.
      // Routes contain only "/", letters and hyphens, so none of them carry
      // a regex metacharacter.
      expect(src, `${route} must declare its own path`).toMatch(
        new RegExp('path:\\s*["\']' + route + '["\']')
      );
    }
  });
});
