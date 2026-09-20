import type { Metadata } from "next";
import { SITE, ROUTES } from "./site";
import { isIsoDate } from "./dates";

export type PageMetaOpts = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  image?: string;
  /** YYYY-MM-DD. Required when ogType is "article", refused otherwise. */
  publishedTime?: string;
  /** YYYY-MM-DD, no earlier than publishedTime. Articles only. */
  modifiedTime?: string;
};

export function canonicalFor(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`canonicalFor: path must start with "/", received "${path}"`);
  }
  // A canonical URL identifies the page, so a fragment never belongs in one and
  // a query string almost never does. Throwing surfaces the author error at
  // build time instead of shipping a canonical that splits the page's signals.
  if (/[?#]/.test(path)) {
    throw new Error(
      `canonicalFor: path must not carry a query or fragment, received "${path}"`
    );
  }
  if (path === "/") return SITE.url;
  return `${SITE.url}${path.replace(/\/$/, "")}`;
}

/**
 * Throws unless both dates are real YYYY-MM-DD days and the update does not
 * come before the publication. pageMeta and articleSchema both call this, so
 * the og:article times and the Article JSON-LD cannot disagree on what a
 * valid date is.
 */
export function assertArticleDates(context: string, published: string, modified?: string): void {
  for (const d of [published, modified]) {
    if (d !== undefined && !isIsoDate(d)) {
      throw new Error(`${context}: "${d}" is not a YYYY-MM-DD calendar date`);
    }
  }
  if (modified !== undefined && modified < published) {
    throw new Error(`${context}: modified ${modified} is before published ${published}`);
  }
}

function articleTimes(opts: PageMetaOpts): { publishedTime?: string; modifiedTime?: string } {
  const { path, ogType = "website", publishedTime, modifiedTime } = opts;
  if (ogType !== "article") {
    if (publishedTime !== undefined || modifiedTime !== undefined) {
      throw new Error(`pageMeta: ${path} sets article times but its ogType is "${ogType}"`);
    }
    return {};
  }
  if (publishedTime === undefined) {
    throw new Error(`pageMeta: article ${path} needs a publishedTime`);
  }
  assertArticleDates(`pageMeta ${path}`, publishedTime, modifiedTime);
  // An article that has never been updated has no modified time to state.
  return modifiedTime === undefined ? { publishedTime } : { publishedTime, modifiedTime };
}

export function pageMeta(opts: PageMetaOpts): Metadata {
  const { title, description, path, ogType = "website", image } = opts;
  // Default from the route manifest so a page cannot ship indexable when
  // ROUTES says otherwise; an explicit `noindex` still wins.
  const noindex = opts.noindex ?? ROUTES[path]?.indexable === false;
  const url = canonicalFor(path);
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: !noindex, follow: !noindex },
    openGraph: {
      type: ogType,
      url,
      siteName: SITE.name,
      title,
      description,
      locale: SITE.locale,
      images,
      ...articleTimes(opts),
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
