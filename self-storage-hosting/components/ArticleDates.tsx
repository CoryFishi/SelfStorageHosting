import type { Article } from "@/lib/articles";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/dates";

/**
 * The byline under an article's h1: who wrote it, when it went live and,
 * once its facts have changed, when it was updated. The <time> elements carry
 * the same YYYY-MM-DD values as the Article JSON-LD and og:article tags.
 */
export default function ArticleDates({ article }: { article: Article }) {
  const { datePublished, dateModified } = article;
  return (
    <p className="mt-4 text-sm text-text-700">
      By {SITE.name}. Published <time dateTime={datePublished}>{formatDate(datePublished)}</time>
      {dateModified !== undefined && dateModified !== datePublished && (
        <>
          . Updated <time dateTime={dateModified}>{formatDate(dateModified)}</time>
        </>
      )}
      .
    </p>
  );
}
