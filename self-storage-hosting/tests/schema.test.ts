import { describe, it, expect } from "vitest";
import {
  organizationSchema,
  webSiteSchema,
  breadcrumbSchema,
  articleSchema,
  eventSchema,
  assertNoForbiddenTypes,
  FORBIDDEN_SCHEMA_TYPES,
} from "@/lib/schema";
import { SITE } from "@/lib/site";

describe("schema builders", () => {
  it("emits Organization with absolute url and logo", () => {
    const s = organizationSchema() as any;
    expect(s["@type"]).toBe("Organization");
    expect(s.url).toBe(SITE.url);
    expect(String(s.logo)).toMatch(/^https:\/\//);
  });

  it("omits sameAs and contactPoint while the owner facts are outstanding", () => {
    const s = organizationSchema() as any;
    // These appear only once SITE.social / SITE.contactEmail are populated.
    // An empty sameAs array or a contactPoint with no address is invalid.
    expect("sameAs" in s).toBe(false);
    expect("contactPoint" in s).toBe(false);
  });

  it("emits WebSite with name and url only, never a SearchAction", () => {
    const s = webSiteSchema() as any;
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction).toBeUndefined();
  });

  it("numbers breadcrumb positions from 1 and uses absolute item urls", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions" },
    ]) as any;
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].item).toBe(`${SITE.url}/solutions`);
  });

  it("defaults dateModified to datePublished", () => {
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    }) as any;
    expect(s.dateModified).toBe("2026-09-18");
  });

  it("emits Event with a place location", () => {
    const s = eventSchema({
      name: "SSAA Convention",
      startDate: "2026-11-10",
      endDate: "2026-11-12",
      locationName: "The Star Grand Gold Coast",
      locationAddress: "Broadbeach, QLD, Australia",
      url: "https://www.selfstorage.org.au/",
    }) as any;
    expect(s["@type"]).toBe("Event");
    expect(s.location["@type"]).toBe("Place");
  });
});

describe("forbidden schema guard", () => {
  it("lists every retired or unearned type", () => {
    expect(FORBIDDEN_SCHEMA_TYPES).toEqual(
      expect.arrayContaining([
        "FAQPage",
        "SoftwareApplication",
        "Product",
        "AggregateRating",
        "Review",
        "SearchAction",
        "LocalBusiness",
      ])
    );
  });

  it("throws on a forbidden type nested anywhere", () => {
    expect(() => assertNoForbiddenTypes({ a: { b: [{ "@type": "FAQPage" }] } })).toThrow(/FAQPage/);
  });

  it("throws on an aggregateRating property even without an @type", () => {
    expect(() =>
      assertNoForbiddenTypes({ "@type": "Organization", aggregateRating: { ratingValue: 5 } })
    ).toThrow(/aggregateRating/);
  });

  it("matches a forbidden type case-insensitively", () => {
    expect(() => assertNoForbiddenTypes({ "@type": "faqpage" })).toThrow(/faqpage/);
  });

  it("passes every schema this site actually emits", () => {
    expect(() => assertNoForbiddenTypes(organizationSchema())).not.toThrow();
    expect(() => assertNoForbiddenTypes(webSiteSchema())).not.toThrow();
    expect(() => assertNoForbiddenTypes(breadcrumbSchema([{ name: "Home", path: "/" }]))).not.toThrow();
    expect(() =>
      assertNoForbiddenTypes(
        articleSchema({ headline: "h", description: "d", path: "/resources/x", datePublished: "2026-09-18" })
      )
    ).not.toThrow();
    expect(() =>
      assertNoForbiddenTypes(
        eventSchema({
          name: "n",
          startDate: "2026-11-10",
          locationName: "l",
          locationAddress: "a",
          url: "https://example.org/",
        })
      )
    ).not.toThrow();
  });
});
