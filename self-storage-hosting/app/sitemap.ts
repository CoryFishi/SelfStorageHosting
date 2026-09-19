import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // No lastModified: these are static marketing pages, and stamping every URL
  // with the build/request time on every crawl is false freshness that trains
  // crawlers to ignore the signal. A per-route date belongs in the route
  // manifest (lib/site.ts) where a human sets it, if this is wanted later.
  return indexableRoutes().map((path) => ({
    url: canonicalFor(path),
  }));
}
