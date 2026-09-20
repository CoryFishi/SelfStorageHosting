import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Only application surface is blocked here. A page that must stay out
        // of the index is handled by its noindex tag instead
        // (ROUTES[path].indexable === false, applied through pageMeta), NOT by
        // a Disallow: the two are alternatives, not layers. Disallow stops the
        // fetch, so a crawler never reads the noindex, and the URL can still
        // be indexed from an external link with no way to learn it was
        // excluded. /case-studies was listed here and was therefore noindex in
        // a way Google could not see; it is crawlable now, so the noindex does
        // its job. tests/routing.test.ts enforces this.
        disallow: ["/user/", "/api/"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
