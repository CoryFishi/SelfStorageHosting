import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return indexableRoutes().map((path) => ({
    url: canonicalFor(path),
    lastModified,
  }));
}
