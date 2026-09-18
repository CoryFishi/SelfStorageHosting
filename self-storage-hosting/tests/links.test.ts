import { describe, it, expect } from "vitest";
import { ROUTES, NAV, FOOTER, indexableRoutes, SITE, NON_ROUTE_PATHS } from "@/lib/site";

function internalHrefs(): string[] {
  const out: string[] = [];
  for (const l of NAV.utility) out.push(l.href);
  for (const item of NAV.main) {
    out.push(item.href);
    for (const c of item.children ?? []) out.push(c.href);
  }
  for (const col of FOOTER) for (const l of col.links) out.push(l.href);
  return out;
}

describe("link integrity", () => {
  it("every internal nav and footer link resolves to a real route", () => {
    const bad = internalHrefs()
      .filter((h) => h.startsWith("/"))
      .map((h) => h.split("#")[0])
      .filter((h) => !NON_ROUTE_PATHS.includes(h))
      .filter((h) => !(h in ROUTES));
    expect(bad).toEqual([]);
  });

  it("has no placeholder '#' links", () => {
    expect(internalHrefs().filter((h) => h === "#" || h.startsWith("#"))).toEqual([]);
  });

  // Every other case here is filter-then-expect-[], which also passes when
  // NAV and FOOTER are empty. This is the case that fails on a truncated
  // lib/site.ts.
  it("actually has links to check", () => {
    expect(internalHrefs().length).toBeGreaterThanOrEqual(18);
    expect(FOOTER.map((c) => c.heading)).toEqual([
      "Solutions",
      "Resources",
      "Company",
      "Legal",
    ]);
  });

  it("exposes /contact, which four live links point at", () => {
    expect(ROUTES).toHaveProperty("/contact");
  });

  it("excludes noindex routes from indexableRoutes", () => {
    for (const r of ["/case-studies", "/user/login", "/user/register"]) {
      expect(indexableRoutes()).not.toContain(r);
    }
  });

  it("uses an absolute site url with no trailing slash", () => {
    expect(SITE.url).toMatch(/^https:\/\//);
    expect(SITE.url.endsWith("/")).toBe(false);
  });
});
