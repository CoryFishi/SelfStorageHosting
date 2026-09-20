// The /resources articles (spec §11). Each one is a static page at
// app/(marketing)/resources/<slug>/page.tsx. This list is what the rest of
// the site knows about them: ROUTES (and so the sitemap and link checks), the
// /resources hub, and each page's h1, dates and Article JSON-LD all read it.
//
// `title` and `description` are also written out literally in each page's
// pageMeta call, because tests/sitemap-coverage.test.ts reads them from the
// source to check they are unique and short enough. tests/articles.test.ts
// fails if the two copies drift.
//
// No imports: lib/site.ts imports this file, and everything imports lib/site.
export type Article = {
  slug: string;
  /** The h1 and the Article headline. */
  headline: string;
  /** The <title> before the " | Self Storage Hosting" suffix. */
  title: string;
  /** Meta description and hub summary, at most 155 characters. */
  description: string;
  /** YYYY-MM-DD, the day the page first went live. */
  datePublished: string;
  /** YYYY-MM-DD. Set it only when the facts on the page change. */
  dateModified?: string;
};

export const ARTICLES: readonly Article[] = [];

export const articlePath = (slug: string): string => `/resources/${slug}`;

export function article(slug: string): Article {
  const found = ARTICLES.find((a) => a.slug === slug);
  if (!found) throw new Error(`No article with slug "${slug}" in lib/articles.ts`);
  return found;
}
