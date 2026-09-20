import type { Source } from "@/lib/sources";
import { formatDate } from "@/lib/dates";
import SourceLink from "@/components/SourceLink";

/**
 * The "Sources" section at the foot of an article: every document the page
 * cites, each with the date we last checked it. tests/articles.test.ts fails
 * if a page cites a SOURCES entry in its text that is missing from this list,
 * or lists one it never cites.
 */
export default function SourceList({ sources }: { sources: Source[] }) {
  return (
    <section aria-labelledby="sources" className="mt-12 border-t border-background-200 pt-8">
      <h2 id="sources" className="text-2xl font-semibold">
        Sources
      </h2>
      <p className="mt-2 text-sm text-text-700">
        Vendors move and revise their documents. Each one below was checked on the date shown.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
        {sources.map((s) => (
          <li key={s.url}>
            <SourceLink source={s} />, checked {formatDate(s.verifiedOn)}
          </li>
        ))}
      </ul>
    </section>
  );
}
