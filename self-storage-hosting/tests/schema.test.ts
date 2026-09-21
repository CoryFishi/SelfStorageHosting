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
    const s = organizationSchema() as Record<string, unknown>;
    expect(s["@type"]).toBe("Organization");
    expect(s.url).toBe(SITE.url);
    expect(String(s.logo)).toMatch(/^https:\/\//);
  });

  it("omits sameAs while the owner's profile URLs are outstanding", () => {
    const s = organizationSchema() as Record<string, unknown>;
    // SITE.social is still empty, and an empty sameAs array is invalid
    // structured data. This asserts the omission, not the emptiness: supply
    // real profile URLs and this test is what tells you to update it.
    expect("sameAs" in s).toBe(false);
  });

  it("emits contactPoint from the address the site actually publishes", () => {
    // The owner supplied SITE.contactEmail on 2026-09-21. Asserting the value
    // rather than mere presence is the point: the legal pages print this same
    // address, so a contactPoint naming a different one would send a reader
    // somewhere the site never mentions.
    const s = organizationSchema() as Record<string, unknown>;
    expect(SITE.contactEmail, "this test is vacuous once the address is empty").toBeTruthy();
    const cp = s.contactPoint as Record<string, unknown>;
    expect(cp, "contactPoint is missing although SITE.contactEmail is set").toBeDefined();
    expect(cp.email).toBe(SITE.contactEmail);
  });

  it("emits WebSite with name and url only, never a SearchAction", () => {
    const s = webSiteSchema() as Record<string, unknown>;
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction).toBeUndefined();
  });

  it("numbers breadcrumb positions from 1 and uses absolute item urls", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Solutions", path: "/solutions" },
    ]) as { itemListElement: { position: number; item: string }[] };
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[1].item).toBe(`${SITE.url}/solutions`);
  });

  it("defaults dateModified to datePublished", () => {
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    }) as { dateModified: string };
    expect(s.dateModified).toBe("2026-09-18");
  });

  it("credits an article to the company, not an invented person", () => {
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    }) as { author: unknown };
    expect(s.author).toEqual({ "@type": "Organization", name: SITE.name, url: SITE.url });
  });

  it("refuses an article path outside /resources/<slug>", () => {
    for (const path of ["/resources", "/resources/", "/about-us", "/resources/A_B", "/resources/x/y", "/resources/-x"]) {
      expect(() => articleSchema({ headline: "h", description: "d", path, datePublished: "2026-09-18" })).toThrow(
        /is not a \/resources\/<slug> path/
      );
    }
  });

  it("refuses article dates that are not real days or run backwards", () => {
    expect(() =>
      articleSchema({ headline: "h", description: "d", path: "/resources/x", datePublished: "2026-02-30" })
    ).toThrow(/not a YYYY-MM-DD calendar date/);
    expect(() =>
      articleSchema({
        headline: "h",
        description: "d",
        path: "/resources/x",
        datePublished: "2026-09-18",
        dateModified: "2026-09-17",
      })
    ).toThrow(/is before published/);
  });

  it("emits Event with a postal address, an organizer and a status", () => {
    const s = eventSchema({
      name: "Sample Conference",
      startDate: "2026-11-10",
      endDate: "2026-11-12",
      locationName: "Sample Convention Center",
      address: { addressLocality: "Springfield", addressRegion: "IL", addressCountry: "US" },
      organizer: "Sample Association",
      url: "https://example.org/conference",
    });
    expect(s["@type"]).toBe("Event");
    expect(s.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(s.location["@type"]).toBe("Place");
    expect(s.location.address).toMatchObject({ "@type": "PostalAddress", addressLocality: "Springfield" });
    expect(s.organizer).toEqual({ "@type": "Organization", name: "Sample Association" });
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
          address: { addressLocality: "c", addressRegion: "r", addressCountry: "US" },
          organizer: "o",
          url: "https://example.org/",
        })
      )
    ).not.toThrow();
  });
});
