import type { Metadata } from "next";
import { SITE, ROUTES } from "./site";

export type PageMetaOpts = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  image?: string;
};

export function canonicalFor(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`canonicalFor: path must start with "/", received "${path}"`);
  }
  if (path === "/") return SITE.url;
  return `${SITE.url}${path.replace(/\/$/, "")}`;
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
    },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
