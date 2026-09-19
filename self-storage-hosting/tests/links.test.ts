import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  ROUTES,
  NAV,
  FOOTER,
  indexableRoutes,
  SITE,
  NON_ROUTE_PATHS,
  isLive,
  assertLive,
  liveNav,
  liveFooter,
} from "@/lib/site";
import { PKG_ROOT, walkFrom } from "./helpers/walk";

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

  // `??` only catches null/undefined, so NEXT_PUBLIC_SITE_URL="" (set but
  // empty) would previously defeat the fallback and build every canonical,
  // the sitemap and metadataBase from "". SITE.url is computed once at
  // module load, so proving the fix needs a fresh module load under the
  // empty-string env var, not just an assertion against the already-loaded
  // SITE from the top of this file.
  it("falls back to the default url when NEXT_PUBLIC_SITE_URL is set but empty", async () => {
    vi.resetModules();
    const prev = process.env.NEXT_PUBLIC_SITE_URL;
    try {
      process.env.NEXT_PUBLIC_SITE_URL = "";
      const { SITE: reloaded } = await import("@/lib/site");
      expect(reloaded.url).toBe("https://selfstoragehosting.com");
    } finally {
      if (prev === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = prev;
      vi.resetModules();
    }
  });
});

// ROUTES is a mutable Record. These cases flip `built` on a few entries so
// liveNav/liveFooter are tested in every state the site passes through while
// Plan 2 lands. The originals are restored even when an assertion throws.
function withBuilt(overrides: Record<string, boolean>, run: () => void) {
  const prev = Object.fromEntries(Object.keys(overrides).map((k) => [k, ROUTES[k].built]));
  try {
    for (const [k, v] of Object.entries(overrides)) ROUTES[k].built = v;
    run();
  } finally {
    for (const [k, v] of Object.entries(prev)) ROUTES[k].built = v;
  }
}

describe("live links", () => {
  it("isLive ignores the fragment and accepts non-route files", () => {
    expect(isLive("/about-us#story")).toBe(true);
    expect(isLive("/sitemap.xml")).toBe(true);
    expect(isLive("/no-such-page")).toBe(false);
  });

  it("assertLive names the context and the dead href", () => {
    expect(() => assertLive("/no-such-page", "Test link")).toThrow(
      "Test link links to /no-such-page, which is not a built route"
    );
    expect(() => assertLive("/contact", "Test link")).not.toThrow();
  });

  it("drops a main item whose own page is not built, even if a child is", () => {
    withBuilt({ "/solutions": false, "/solutions/web-hosting": true }, () => {
      expect(liveNav().main.map((i) => i.href)).not.toContain("/solutions");
    });
  });

  it("keeps only built children, and drops the children key when none remain", () => {
    withBuilt(
      {
        "/solutions": true,
        "/solutions/access-control-hosting": true,
        "/solutions/web-hosting": false,
      },
      () => {
        const item = liveNav().main.find((i) => i.href === "/solutions");
        expect(item?.children?.map((c) => c.href)).toEqual(["/solutions/access-control-hosting"]);
      }
    );
    withBuilt(
      {
        "/solutions": true,
        "/solutions/access-control-hosting": false,
        "/solutions/web-hosting": false,
      },
      () => {
        const item = liveNav().main.find((i) => i.href === "/solutions");
        expect(item).toBeDefined();
        // No key at all, not an empty array. MainNav renders a dropdown for
        // any truthy `children`, and an empty dropdown is a dead control.
        expect(item && "children" in item).toBe(false);
      }
    );
  });

  it("drops a footer column once every link in it is dead", () => {
    withBuilt(
      { "/solutions/access-control-hosting": false, "/solutions/web-hosting": false },
      () => {
        expect(liveFooter().map((c) => c.heading)).not.toContain("Solutions");
      }
    );
  });

  it("renders nothing that is not live", () => {
    const { utility, main } = liveNav();
    const hrefs = [
      ...utility,
      ...main,
      ...main.flatMap((i) => i.children ?? []),
      ...liveFooter().flatMap((c) => c.links),
    ].map((l) => l.href);
    // Non-vacuous: /about-us is built, so the list is never empty.
    expect(hrefs).toContain("/about-us");
    expect(hrefs.filter((h) => !isLive(h))).toEqual([]);
  });

  it("no page or component reads NAV or FOOTER directly", () => {
    // The chrome must render liveNav()/liveFooter(). Reading the raw tables
    // is exactly how fourteen dead links reached the live site. The file list
    // comes from the source tree rather than naming the three chrome files,
    // so a new component that reaches for NAV is caught too.
    const files = walkFrom("app", /\.tsx?$/).concat(walkFrom("components", /\.tsx?$/));
    const rel = (f: string) => path.relative(PKG_ROOT, f).split(path.sep).join("/");
    const raw = files.filter((f) => /\bNAV\b|\bFOOTER\b/.test(readFileSync(f, "utf8"))).map(rel);
    expect(raw, `read the raw nav tables instead of liveNav()/liveFooter(): ${raw.join(", ")}`).toEqual([]);
    const live = files.filter((f) => /\blive(?:Nav|Footer)\(\)/.test(readFileSync(f, "utf8")));
    expect(live.length, "TopBar, MainNav and Footer should all call a live helper").toBeGreaterThanOrEqual(3);
  });
});
