import type { MetadataRoute } from "next";
import { SITE, ROUTES } from "@/lib/site";

// Application surface nobody should crawl.
const CRAWL_BLOCKED = ["/user/", "/api/"];

// Built pages that carry noindex but sit under a blocked prefix. /user/login
// is linked from the top bar of every page, so crawlers find it whether or not
// robots.txt lets them fetch it -- and a URL they may not fetch can still be
// indexed from those links, with no way to read the noindex that would have
// kept it out. An Allow for the exact page wins over the shorter Disallow
// (crawlers apply the longest matching rule), so the rest of /user/ stays
// blocked while these pages' noindex is read.
function noindexPagesUnderBlock(): string[] {
  return Object.entries(ROUTES)
    .filter(([path, m]) => m.built && !m.indexable && CRAWL_BLOCKED.some((b) => path.startsWith(b)))
    .map(([path]) => path);
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", ...noindexPagesUnderBlock()],
        // Only application surface is blocked here. A page that must stay out
        // of the index is handled by its noindex tag instead
        // (ROUTES[path].indexable === false, applied through pageMeta), NOT by
        // a Disallow: the two are alternatives, not layers. Disallow stops the
        // fetch, so a crawler never reads the noindex, and the URL can still
        // be indexed from an external link with no way to learn it was
        // excluded. /case-studies was listed here and was therefore noindex in
        // a way Google could not see; it is crawlable now, so the noindex does
        // its job. tests/routing.test.ts enforces this.
        disallow: CRAWL_BLOCKED,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
