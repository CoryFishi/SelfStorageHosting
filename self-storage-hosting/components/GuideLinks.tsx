import Link from "next/link";
import { ARTICLES, articlePath } from "@/lib/articles";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

/**
 * Every /resources guide, linked by its own title. The home and /solutions
 * pages render this so the guides are one click from the site's strongest
 * pages, with anchors that say what each guide is about. It reads
 * lib/articles.ts, so a new guide appears here without editing either page.
 * tests/rendered.test.ts checks both pages link every guide by its title.
 */
export default function GuideLinks({ heading, intro }: { heading: string; intro: string }) {
  return (
    <section aria-labelledby="guide-links" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <h2 id="guide-links" className="text-2xl font-semibold sm:text-3xl">
        {heading}
      </h2>
      <p className="mt-3 text-text-800">{intro}</p>
      <ul className="mt-6 space-y-5">
        {ARTICLES.map((a) => (
          <li key={a.slug}>
            <Link
              href={articlePath(a.slug)}
              className={`font-semibold text-primary-700 underline ${FOCUS_RING_LIGHT}`}
            >
              {a.title}
            </Link>
            <p className="mt-1 text-text-800">{a.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
