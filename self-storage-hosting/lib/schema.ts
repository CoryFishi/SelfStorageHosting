import { SITE } from "./site";
import { canonicalFor, assertArticleDates } from "./seo";

export const FORBIDDEN_SCHEMA_TYPES = [
  "FAQPage",
  "SoftwareApplication",
  "Product",
  "AggregateRating",
  "Review",
  "SearchAction",
  "LocalBusiness",
] as const;

const FORBIDDEN_PROPS = ["aggregateRating", "review", "reviews"];

const FORBIDDEN_LOWER = new Set(
  FORBIDDEN_SCHEMA_TYPES.map((t) => t.toLowerCase())
);

export function assertNoForbiddenTypes(node: unknown): void {
  const walk = (n: unknown, path: string): void => {
    if (Array.isArray(n)) {
      n.forEach((v, i) => walk(v, `${path}[${i}]`));
      return;
    }
    if (n === null || typeof n !== "object") return;

    for (const [key, value] of Object.entries(n as Record<string, unknown>)) {
      if (key === "@type") {
        const types = Array.isArray(value) ? value : [value];
        for (const t of types) {
          // Case-insensitive on purpose. Every @type this file emits is a
          // hardcoded literal, but articleSchema and eventSchema pass data from
          // lib/articles.ts and lib/events.ts through here, and "faqpage" must
          // not slip past the one guard.
          if (FORBIDDEN_LOWER.has(String(t).toLowerCase())) {
            throw new Error(
              `Forbidden JSON-LD type "${t}" at ${path}. See spec section 7.2 — this type no longer earns a rich result, or requires data we do not have.`
            );
          }
        }
      }
      if (FORBIDDEN_PROPS.includes(key)) {
        throw new Error(`Forbidden JSON-LD property "${key}" at ${path}. See spec section 7.2.`);
      }
      walk(value, `${path}.${key}`);
    }
  };
  walk(node, "$");
}

// Self Storage Hosting's own nodes. Every page emits the Organization and the
// WebSite from the root layout. The @ids let the WebSite's publisher and each
// Article's author and publisher point at that one Organization, instead of
// declaring three unconnected organizations that happen to share a name.
const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

// A reference to the Organization that organizationSchema() describes in full.
function siteOrganization() {
  return { "@type": "Organization", "@id": ORG_ID, name: SITE.name, url: SITE.url };
}

// Kingpost Software, referenced by the @id its own site uses. See SITE.builtBy.
function kingpostOrganization() {
  return {
    "@type": "Organization",
    "@id": SITE.builtBy.id,
    name: SITE.builtBy.legalName,
    url: SITE.builtBy.url,
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/Logo.png`,
    description: SITE.description,
    parentOrganization: kingpostOrganization(),
    // Spec 7.2 calls for sameAs and contactPoint. Both are omitted rather than
    // stubbed while the owner facts are outstanding: an empty sameAs array and
    // a contactPoint with no reachable address are invalid structured data.
    ...(SITE.social.length > 0 ? { sameAs: SITE.social } : {}),
    ...(SITE.contactEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: SITE.contactEmail,
            availableLanguage: "English",
          },
        }
      : {}),
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE.name,
    url: SITE.url,
    publisher: { "@id": ORG_ID },
    // The same company the footer's "Built by" link names.
    creator: kingpostOrganization(),
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonicalFor(c.path),
    })),
  };
}

export function articleSchema(a: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  // Only a /resources/<slug> page is an article on this site. A typo'd path
  // would still build a valid-looking Article pointing at a page that is not
  // one, so refuse it here.
  if (!/^\/resources\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.path)) {
    throw new Error(`articleSchema: "${a.path}" is not a /resources/<slug> path`);
  }
  assertArticleDates(`articleSchema ${a.path}`, a.datePublished, a.dateModified);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: canonicalFor(a.path),
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    // Google recommends an image for Article. The guides have no figures of
    // their own, so this is the same share image their og:image names.
    image: [`${SITE.url}${SITE.ogImage}`],
    // The articles are written by the company, not a named person, so the
    // author is the Organization. Inventing a byline would be a fabrication.
    author: siteOrganization(),
    publisher: {
      ...siteOrganization(),
      logo: { "@type": "ImageObject", url: `${SITE.url}/Logo.png` },
    },
  };
}

export type PostalAddressInput = {
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
};

export function eventSchema(e: {
  name: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  address: PostalAddressInput;
  organizer: string;
  url: string;
  /** What the event's visible row says; see eventDescription() in lib/events.ts. */
  description: string;
}) {
  // No organizer url yet: an event's source is often the event's own site
  // rather than its organizer's, so deriving one from it would be wrong. It
  // needs its own verified field first.
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    // Every listed event was confirmed on its organizer's own page.
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.locationName,
      address: { "@type": "PostalAddress", ...e.address },
    },
    organizer: { "@type": "Organization", name: e.organizer },
    url: e.url,
  };
}
