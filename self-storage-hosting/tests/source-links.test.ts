import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NAV, FOOTER, NON_ROUTE_PATHS, isLive } from "@/lib/site";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
import { pageFiles } from "./helpers/pages";
import { allowedLink } from "./helpers/links";

// Every literal internal href in app/ and components/, in the three shapes
// this codebase writes them: `href="/x"`, `href={"/x"}` and `href: "/x"` (in
// data arrays and CtaBand props). The capture stops before a query or a
// fragment. This must be a regex literal, not a string: `\s` inside a string
// collapses to a bare "s" (see MEMORY.md -> shell-escaping-collapses-here).
const HREF = /\bhref\s*(?:=\s*\{?\s*|:\s*)["'](\/[^"'?#]*)/g;

const sources = walkFrom("app", /\.tsx?$/)
  .concat(walkFrom("components", /\.tsx?$/))
  .map((f) => ({
    file: path.relative(PKG_ROOT, f).split(path.sep).join("/"),
    text: readFileSync(f, "utf8"),
  }));

function literalHrefs(): { file: string; href: string }[] {
  return sources.flatMap(({ file, text }) =>
    [...text.matchAll(HREF)].map((m) => ({ file, href: m[1] }))
  );
}

describe("source links", () => {
  it("finds the links it is meant to check", () => {
    const hrefs = literalHrefs().map((h) => h.href);
    expect(hrefs.length).toBeGreaterThanOrEqual(10);
    expect(hrefs).toContain("/contact");
  });

  it("every literal internal href points somewhere real", () => {
    const bad = literalHrefs()
      .filter((h) => !allowedLink(h.href))
      .map((h) => `${h.file} -> ${h.href}`);
    expect(bad, `dead or forbidden links: ${bad.join(", ")}`).toEqual([]);
  });

  it("links out over https only", () => {
    const bad = sources
      .filter((s) => /\bhref\s*(?:=\s*\{?\s*|:\s*)["']http:\/\//.test(s.text))
      .map((s) => s.file);
    expect(bad, `plain http:// links in: ${bad.join(", ")}`).toEqual([]);
  });
});

// A literal internal href that carries a #fragment, in the same three shapes
// as HREF. Captures the path and the fragment together.
const FRAGMENT_HREF = /\bhref\s*(?:=\s*\{?\s*|:\s*)["'](\/[^"'?#]*#[^"']+)["']/g;

describe("fragment links", () => {
  it("every #fragment link to a built page has a matching id", () => {
    const pages = pageFiles();
    const literal = sources.flatMap(({ text }) => [...text.matchAll(FRAGMENT_HREF)].map((m) => m[1]));
    const hrefs = [
      ...NAV.utility,
      ...NAV.main,
      ...NAV.main.flatMap((i) => i.children ?? []),
      ...FOOTER.flatMap((c) => c.links),
    ]
      .map((l) => l.href)
      .filter((h) => h.includes("#"))
      .concat(literal);
    const checked: string[] = [];
    const missing: string[] = [];
    for (const href of hrefs) {
      const [route, frag] = href.split("#");
      // An unbuilt route is not rendered (liveNav/liveFooter drop it), so
      // there is no anchor to check yet.
      if (NON_ROUTE_PATHS.includes(route) || !isLive(route)) continue;
      const file = pages.get(route);
      if (!file) {
        missing.push(`${href} (no page.tsx)`);
        continue;
      }
      checked.push(href);
      if (!readFileSync(file, "utf8").includes(`id="${frag}"`)) missing.push(href);
    }
    // /about-us#story, #careers and #news exist from Plan 1.
    expect(checked.length).toBeGreaterThanOrEqual(3);
    expect(missing, `fragment links with no matching id: ${missing.join(", ")}`).toEqual([]);
  });
});
