import { describe, it, expect } from "vitest";
import { pageMeta, canonicalFor } from "@/lib/seo";
import { SITE } from "@/lib/site";

describe("pageMeta", () => {
  it("never includes the brand in the title, since the template appends it", () => {
    const m = pageMeta({ title: "Contact", description: "d", path: "/contact" });
    expect(m.title).toBe("Contact");
    expect(String(m.title)).not.toContain(SITE.name);
  });

  it("builds an absolute canonical with no trailing slash", () => {
    const m = pageMeta({ title: "Contact", description: "d", path: "/contact" });
    expect(m.alternates?.canonical).toBe(`${SITE.url}/contact`);
  });

  it("maps the site root to the bare origin", () => {
    const m = pageMeta({ title: "Home", description: "d", path: "/" });
    expect(m.alternates?.canonical).toBe(SITE.url);
  });

  // `Metadata["openGraph"]` is a 13-member union and its OpenGraphMetadata
  // member has no `type` property, so `.openGraph?.type` is TS2339 under
  // next@16.3.5. Vitest would pass it anyway (it strips types); `next build`
  // type-checks tests/ and would fail. toMatchObject compiles and asserts the
  // same thing.
  it("defaults og:type to website but allows article", () => {
    expect(
      pageMeta({ title: "a", description: "d", path: "/a" }).openGraph
    ).toMatchObject({ type: "website" });
    expect(
      pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: "2026-09-19" })
        .openGraph
    ).toMatchObject({ type: "article" });
  });

  it("gives an article its published and modified times", () => {
    const og = pageMeta({
      title: "a",
      description: "d",
      path: "/a",
      ogType: "article",
      publishedTime: "2026-09-19",
      modifiedTime: "2026-10-02",
    }).openGraph;
    expect(og).toMatchObject({ publishedTime: "2026-09-19", modifiedTime: "2026-10-02" });
  });

  it("states no modified time for an article that was never updated", () => {
    const og = pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: "2026-09-19" })
      .openGraph;
    expect(og).not.toHaveProperty("modifiedTime");
  });

  it("refuses an article with no published time", () => {
    expect(() => pageMeta({ title: "a", description: "d", path: "/a", ogType: "article" })).toThrow(
      /needs a publishedTime/
    );
  });

  it("refuses article times on a page that is not an article", () => {
    expect(() => pageMeta({ title: "a", description: "d", path: "/a", publishedTime: "2026-09-19" })).toThrow(
      /sets article times/
    );
    expect(() => pageMeta({ title: "a", description: "d", path: "/a", modifiedTime: "2026-09-19" })).toThrow(
      /sets article times/
    );
  });

  it("refuses an article date that is not a real YYYY-MM-DD day", () => {
    for (const bad of ["2026-02-30", "09/19/2026", "2026-9-19"]) {
      expect(() =>
        pageMeta({ title: "a", description: "d", path: "/a", ogType: "article", publishedTime: bad })
      ).toThrow(/not a YYYY-MM-DD calendar date/);
    }
    expect(() =>
      pageMeta({
        title: "a",
        description: "d",
        path: "/a",
        ogType: "article",
        publishedTime: "2026-09-19",
        modifiedTime: "2026-13-01",
      })
    ).toThrow(/not a YYYY-MM-DD calendar date/);
  });

  it("refuses a modified time before the published time", () => {
    expect(() =>
      pageMeta({
        title: "a",
        description: "d",
        path: "/a",
        ogType: "article",
        publishedTime: "2026-09-19",
        modifiedTime: "2026-09-18",
      })
    ).toThrow(/is before published/);
  });

  it("emits noindex, nofollow when asked", () => {
    const m = pageMeta({ title: "Log In", description: "d", path: "/user/login", noindex: true });
    expect(m.robots).toMatchObject({ index: false, follow: false });
  });

  // Spec §7.1 names three noindex routes. ROUTES already flags them; without
  // this default, Plan 2 can ship /user/login indexable and every Plan 1 test
  // still passes. Plan 1 owns both modules, so Plan 1 owns the enforcement.
  it("defaults noindex from the route manifest", () => {
    for (const path of ["/case-studies", "/user/login", "/user/register"]) {
      const m = pageMeta({ title: "t", description: "d", path });
      expect(m.robots).toMatchObject({ index: false, follow: false });
    }
    expect(
      pageMeta({ title: "t", description: "d", path: "/about-us" }).robots
    ).toMatchObject({ index: true, follow: true });
  });

  it("is indexable by default", () => {
    const m = pageMeta({ title: "Contact", description: "d", path: "/contact" });
    expect(m.robots).toMatchObject({ index: true, follow: true });
  });

  it("rejects a path that does not start with a slash", () => {
    expect(() => pageMeta({ title: "a", description: "d", path: "contact" })).toThrow();
  });

  it("rejects a canonical path carrying a query or fragment", () => {
    expect(() => canonicalFor("/contact?ref=x")).toThrow();
    expect(() => canonicalFor("/contact#top")).toThrow();
  });
});
