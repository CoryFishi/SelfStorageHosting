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

export const ARTICLES: readonly Article[] = [
  {
    slug: "falconxt-end-of-life",
    headline: "PTI FalconXT and StorLogix Cloud Adaptor End of Life: Every Option You Actually Have",
    title: "FalconXT End of Life: Your Options",
    description:
      "PTI lists FalconXT and the StorLogix Cloud Adaptor as legacy products it no longer sells or supports. Every path forward, each one cited to its vendor.",
    datePublished: "2026-09-20",
  },
  {
    slug: "gate-not-syncing",
    headline: "Why Your Gate Isn't Syncing With Your Storage Software: A Diagnostic Guide",
    title: "Gate Not Syncing to Storage Software",
    description:
      "Find out why gate codes stop matching your storage software, step by step, using the vendors' own troubleshooting documents.",
    datePublished: "2026-09-20",
  },
  {
    slug: "digigate-replacement",
    headline: "Still Running DigiGate? What to Do Now That Support Has Ended",
    title: "DigiGate Replacement Options",
    description:
      "PTI no longer sells or supports DigiGate. Which products PTI's end-of-life notice names, what keeps running without the PC, and the ways to replace it.",
    datePublished: "2026-09-20",
  },
  {
    slug: "self-storage-gate-compatibility",
    headline: "Self-Storage Software and Gate Access Control: An Independent Compatibility Matrix",
    title: "Storage Gate Compatibility Matrix",
    description:
      "Which gate systems Storable Edge, Storable Easy and Sitelink by Storable list as integrations, next to the gate makers' own lists. Dated and sourced.",
    datePublished: "2026-09-20",
  },
  {
    slug: "self-storage-gate-server",
    headline: "Do You Still Need a Windows PC in the Office to Run Your Gate?",
    title: "Do You Still Need a Gate Server?",
    description:
      "Some gate setups still depend on a Windows PC that stays on. Which ones do, which do not, and what Windows 10 end of support means for yours.",
    datePublished: "2026-09-20",
  },
];

export const articlePath = (slug: string): string => `/resources/${slug}`;

export function article(slug: string): Article {
  const found = ARTICLES.find((a) => a.slug === slug);
  if (!found) throw new Error(`No article with slug "${slug}" in lib/articles.ts`);
  return found;
}
