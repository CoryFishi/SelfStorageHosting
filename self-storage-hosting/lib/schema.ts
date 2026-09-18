import { SITE } from "./site";
import { canonicalFor } from "./seo";

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
          if ((FORBIDDEN_SCHEMA_TYPES as readonly string[]).includes(String(t))) {
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

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/Logo.png`,
    description: SITE.description,
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
    name: SITE.name,
    url: SITE.url,
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
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: canonicalFor(a.path),
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: `${SITE.url}/Logo.png` },
    },
  };
}

export function eventSchema(e: {
  name: string;
  startDate: string;
  endDate?: string;
  locationName: string;
  locationAddress: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.name,
    startDate: e.startDate,
    endDate: e.endDate ?? e.startDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.locationName,
      address: e.locationAddress,
    },
    url: e.url,
  };
}
