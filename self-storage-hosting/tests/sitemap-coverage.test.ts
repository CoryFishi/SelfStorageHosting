import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES, indexableRoutes } from "@/lib/site";
import { walkFrom } from "./helpers/walk";
import { pageFiles, pageMetaArg } from "./helpers/pages";

const APP_DIR = path.resolve(__dirname, "../app");

// URLs that exist on disk as a page.tsx but are deliberately not in ROUTES.
// Empty today -- every page this repo builds is manifest-tracked. A future
// entry here must carry its own reason; it is never a silent catch-all.
const UNMANAGED_PAGES: string[] = [];

const builtRoutes = () =>
  Object.entries(ROUTES)
    .filter(([, m]) => m.built)
    .map(([r]) => r);

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
    expect(indexableRoutes()).toEqual([
      "/",
      "/about-us",
      "/contact",
      "/solutions",
      "/solutions/access-control-hosting",
      "/solutions/web-hosting",
      "/resources",
      "/resources/falconxt-end-of-life",
      "/resources/gate-not-syncing",
      "/resources/digigate-replacement",
      "/events",
      "/support",
      "/demo",
      "/legal/privacy",
      "/legal/terms",
      "/legal/trademarks",
      "/legal/accessibility",
    ]);
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

  it("gives every built route its own canonical via pageMeta", () => {
    const pages = pageFiles();
    for (const route of builtRoutes()) {
      const file = pages.get(route);
      expect(file, `${route} is flagged built but has no page.tsx on disk`).toBeDefined();
      const arg = pageMetaArg(readFileSync(file!, "utf8"));
      expect(arg, `${route} must call pageMeta with an object literal`).not.toBeNull();
      // Built from a plain string with the backslash doubled, so the regex
      // engine receives `\s` (whitespace) rather than a literal "s". A single
      // backslash, in either a template literal or a quoted string, collapses
      // to a bare "s". Routes contain only "/", letters and hyphens, so none
      // of them carry a regex metacharacter.
      expect(
        arg!,
        `${route} must declare its own path inside the pageMeta call, not only in a breadcrumb`
      ).toMatch(new RegExp('path:\\s*["\']' + route + '["\']'));
    }
  });

  it("never overrides the route manifest's index decision", () => {
    // pageMeta() already defaults noindex from ROUTES. An explicit override in
    // the wrong direction is the only way a page can contradict the manifest,
    // the sitemap and robots.txt all at once.
    const pages = pageFiles();
    for (const route of builtRoutes()) {
      const arg = pageMetaArg(readFileSync(pages.get(route)!, "utf8"))!;
      const wrong = ROUTES[route].indexable ? /noindex:\s*true/ : /noindex:\s*false/;
      expect(arg, `${route} overrides ROUTES["${route}"].indexable in its pageMeta call`).not.toMatch(
        wrong
      );
    }
  });

  it("gives every built page exactly one h1", () => {
    // Spec 7.6(4). A page's h1 lives in its page.tsx. No shared component in
    // this repo renders one, so the page file is the whole measurement.
    const pages = pageFiles();
    for (const route of builtRoutes()) {
      const count = (readFileSync(pages.get(route)!, "utf8").match(/<h1\b/g) ?? []).length;
      expect(count, `${route} has ${count} <h1> elements`).toBe(1);
    }
  });

  it("gives every built page a unique title and a unique description of at most 155 characters", () => {
    const pages = pageFiles();
    const seen = { title: new Map<string, string>(), description: new Map<string, string>() };
    for (const route of builtRoutes()) {
      const arg = pageMetaArg(readFileSync(pages.get(route)!, "utf8"))!;
      for (const key of ["title", "description"] as const) {
        const m = arg.match(key === "title" ? /title:\s*"([^"]+)"/ : /description:\s*"([^"]+)"/);
        expect(m, `${route}: pageMeta ${key} must be a double-quoted string literal`).not.toBeNull();
        const value = m![1];
        const clash = seen[key].get(value);
        expect(clash, `${route} reuses the ${key} of ${clash}: "${value}"`).toBeUndefined();
        seen[key].set(value, route);
        if (key === "description") {
          expect(value.length, `${route} description is ${value.length} characters`).toBeLessThanOrEqual(155);
        }
      }
    }
    expect(seen.title.size).toBe(builtRoutes().length);
  });
});
