import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { ROUTES } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { pageFiles } from "./helpers/pages";

// The source text of the `crumbs={[ ... ]}` attribute, brackets balanced, or
// null if the file renders no <Breadcrumbs>. It is scoped to this slice for
// the same reason pageMetaArg is: `path:` also appears in pageMeta, so a
// whole-file search would let a page pass on its canonical alone. Crumb names
// are plain strings with no brackets in them, so bracket counting is enough.
function crumbsArg(src: string): string | null {
  const tag = src.indexOf("<Breadcrumbs");
  if (tag === -1) return null;
  const attr = src.indexOf("crumbs=", tag);
  if (attr === -1) return null;
  const open = src.indexOf("[", attr);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === "[") depth++;
    else if (src[i] === "]" && --depth === 0) return src.slice(open, i + 1);
  }
  return null;
}

describe("Breadcrumbs", () => {
  // Server components are plain functions. Calling one runs its body,
  // including assertLive, without a DOM, which is all this needs.
  it("throws at render on a crumb that points at an unbuilt route", () => {
    expect(() =>
      Breadcrumbs({
        crumbs: [
          { name: "Home", path: "/" },
          { name: "Nowhere", path: "/nowhere" },
        ],
      })
    ).toThrow('Breadcrumb "Nowhere" links to /nowhere, which is not a built route');
  });

  it("renders for built crumbs", () => {
    expect(() =>
      Breadcrumbs({
        crumbs: [
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ],
      })
    ).not.toThrow();
  });
});

describe("CtaBand", () => {
  it("throws at render when either button points at an unbuilt route", () => {
    expect(() =>
      CtaBand({ heading: "h", text: "t", primary: { href: "/nowhere", label: "Go" } })
    ).toThrow(/\/nowhere, which is not a built route/);
    expect(() =>
      CtaBand({
        heading: "h",
        text: "t",
        primary: { href: "/contact", label: "Go" },
        secondary: { href: "/nowhere", label: "Also" },
      })
    ).toThrow(/\/nowhere, which is not a built route/);
  });
});

describe("breadcrumb coverage", () => {
  it("every built page below the top level renders Breadcrumbs from Home to itself", () => {
    const pages = pageFiles();
    const routes = Object.entries(ROUTES)
      .filter(([r, m]) => m.built && r !== "/")
      .map(([r]) => r);
    expect(routes.length).toBeGreaterThanOrEqual(2);
    for (const route of routes) {
      const file = pages.get(route);
      expect(file, `${route} is flagged built but has no page.tsx`).toBeDefined();
      const src = readFileSync(file!, "utf8");
      const arg = crumbsArg(src);
      expect(arg, `${route} must render <Breadcrumbs crumbs={[...]} />`).not.toBeNull();
      const paths = [...arg!.matchAll(/path:\s*["']([^"']+)["']/g)].map((m) => m[1]);
      expect(paths[0], `${route}: the first crumb must be Home ("/")`).toBe("/");
      expect(paths[paths.length - 1], `${route}: the last crumb must be the page itself`).toBe(route);
      // Breadcrumbs emits the BreadcrumbList itself. A page that also builds
      // one by hand ships two, and they drift.
      expect(src, `${route} builds a BreadcrumbList by hand`).not.toMatch(/breadcrumbSchema\s*\(/);
    }
  });
});
