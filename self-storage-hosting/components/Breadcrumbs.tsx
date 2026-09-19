import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { assertLive } from "@/lib/site";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export type Crumb = { name: string; path: string };

/**
 * The visible trail and its BreadcrumbList JSON-LD, built from one list so
 * the two can never disagree. Every crumb must be a built route. assertLive
 * throws during prerender, which fails `next build` rather than shipping a
 * trail that leads to a 404.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  for (const c of crumbs) assertLive(c.path, `Breadcrumb "${c.name}"`);
  const last = crumbs.length - 1;
  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 text-sm sm:px-6">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-text-700">
          {crumbs.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === last ? (
                <span aria-current="page" className="font-medium text-text-900">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className={`underline hover:text-text-900 ${FOCUS_RING_LIGHT}`}>
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
