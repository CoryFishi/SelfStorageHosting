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

  it("omits sameAs and contactPoint while the owner facts are outstanding", () => {
    const s = organizationSchema() as Record<string, unknown>;
    // These appear only once SITE.social / SITE.contactEmail are populated.
    // An empty sameAs array or a contactPoint with no address is invalid.
    expect("sameAs" in s).toBe(false);
    expect("contactPoint" in s).toBe(false);
  });

  it("emits WebSite with name, url, publisher and creator, never a SearchAction", () => {
    const s = webSiteSchema() as Record<string, unknown>;
    expect(s["@type"]).toBe("WebSite");
    expect(s.potentialAction).toBeUndefined();
    expect(Object.keys(s).sort()).toEqual(["@context", "@id", "@type", "creator", "name", "publisher", "url"]);
    expect(s["@id"]).toBe(`${SITE.url}/#website`);
  });

  // Before this, the page carried up to three unconnected "Self Storage
  // Hosting" organizations: the Organization, and an Article's author and
  // publisher. They are one entity and now say so.
  it("joins the site's own Organization by @id wherever it is named", () => {
    const orgId = `${SITE.url}/#organization`;
    expect(organizationSchema()["@id"]).toBe(orgId);
    expect(webSiteSchema().publisher).toEqual({ "@id": orgId });
    const a = articleSchema({ headline: "h", description: "d", path: "/resources/x", datePublished: "2026-09-18" });
    expect(a.author["@id"]).toBe(orgId);
    expect(a.publisher["@id"]).toBe(orgId);
    // Kingpost is a different organization with its own @id.
    expect(organizationSchema().parentOrganization["@id"]).not.toBe(orgId);
  });

  it("names Kingpost Software as the WebSite's creator, joined to Kingpost's own @id", () => {
    const { creator } = webSiteSchema() as { creator: Record<string, unknown> };
    expect(creator).toEqual({
      "@type": "Organization",
      // The @id kingpostsoftware.com gives its own Organization node.
      "@id": "https://www.kingpostsoftware.com/#organization",
      name: "Kingpost Software LLC",
      url: "https://www.kingpostsoftware.com/",
    });
    // No sameAs: Kingpost publishes no social profiles to point at.
    expect("sameAs" in creator).toBe(false);
  });

  it("names Kingpost Software as the Organization's parent, the same node as the creator", () => {
    // The owner confirmed on 2026-09-23 that Kingpost owns Self Storage Hosting.
    const { parentOrganization } = organizationSchema() as {
      parentOrganization: Record<string, unknown>;
    };
    const { creator } = webSiteSchema() as { creator: Record<string, unknown> };
    expect(parentOrganization).toEqual({
      "@type": "Organization",
      "@id": "https://www.kingpostsoftware.com/#organization",
      name: "Kingpost Software LLC",
      url: "https://www.kingpostsoftware.com/",
    });
    expect(parentOrganization).toEqual(creator);
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

  it("gives an article the site's share image, as an absolute URL", () => {
    // Google lists image as recommended for Article.
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    });
    expect(s.image).toEqual([`${SITE.url}/og.png`]);
  });

  it("credits an article to the company, not an invented person", () => {
    const s = articleSchema({
      headline: "h",
      description: "d",
      path: "/resources/x",
      datePublished: "2026-09-18",
    }) as { author: unknown };
    expect(s.author).toEqual({
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
    });
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
