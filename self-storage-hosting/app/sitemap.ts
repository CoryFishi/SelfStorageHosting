import type { MetadataRoute } from "next";
import { indexableRoutes } from "@/lib/site";
import { canonicalFor } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";

export const dynamic = "force-static";

// An article's lastModified is the date a person set in lib/articles.ts when
// its facts changed, so it is a real signal. The other pages have no such
// date. Stamping them with the build time on every deploy is false freshness
// that teaches crawlers to ignore the field, so they carry none.
const ARTICLE_DATES = new Map(
  ARTICLES.map((a) => [articlePath(a.slug), a.dateModified ?? a.datePublished])
);

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes().map((path) => {
    const lastModified = ARTICLE_DATES.get(path);
    return lastModified === undefined
      ? { url: canonicalFor(path) }
      : { url: canonicalFor(path), lastModified };
  });
}
