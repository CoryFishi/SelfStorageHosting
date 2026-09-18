import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ROUTES, indexableRoutes } from "@/lib/site";

const APP_DIR = path.resolve(__dirname, "../app");

// Maps each routable URL to the page.tsx that serves it. Step 6c needs the file
// path and Step 6b needs the URL, so the walk returns both rather than existing
// twice in two shapes.
function pageFiles(): Map<string, string> {
  const pages = new Map<string, string>();
  const walk = (dir: string, url: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        // Route groups like (marketing) do not appear in the URL.
        walk(path.join(dir, e.name), e.name.startsWith("(") ? url : url + "/" + e.name);
      } else if (e.name === "page.tsx") {
        pages.set(url === "" ? "/" : url, path.join(dir, e.name));
      }
    }
  };
  walk(APP_DIR, "");
  return pages;
}

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

  it("is actually checking something", () => {
    expect(indexableRoutes()).toEqual(["/", "/about-us", "/contact"]);
  });
});

describe("canonical declarations", () => {
  function layoutFiles(): string[] {
    const found: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name === "layout.tsx") found.push(full);
      }
    };
    walk(APP_DIR);
    return found;
  }

  it("declares no default canonical in any layout", () => {
    const offenders = layoutFiles()
      .filter((f) => /alternates\s*:/.test(readFileSync(f, "utf8")))
      .map((f) => path.relative(APP_DIR, f));
    expect(offenders).toEqual([]);
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
