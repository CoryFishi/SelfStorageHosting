import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { ARTICLES, articlePath } from "@/lib/articles";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// Spec §5 fixes this title and description (the description lengthened
// 2026-09-23 to clear the 120-character floor tests/sitemap-coverage.test.ts sets). The hub is a plain list: no
// ItemList or CollectionPage JSON-LD, which earn no rich result here.
export const metadata: Metadata = pageMeta({
  title: "Resources",
  description:
    "Practical guides on self-storage access control, gate-to-software syncing and migrating off end-of-life hardware, each cited to the vendors' own documents.",
  path: "/resources",
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

export default function ResourcesPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Self-storage access control guides</h1>
        <p className="mt-4 text-lg text-text-800">
          Plain answers for facility owners and managers: what to do about gate hardware your vendor
          no longer supports, why gate codes stop matching your software, and which systems work
          together. Every vendor fact links to the vendor&apos;s own document.
        </p>
      </section>

      <section aria-label="Guides" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <ul className="divide-y divide-background-200 border-y border-background-200">
          {ARTICLES.map((a) => (
            <li key={a.slug} className="py-6">
              <h2 className="text-xl font-semibold sm:text-2xl">
                <Link href={articlePath(a.slug)} className={`underline ${FOCUS_RING_LIGHT}`}>
                  {a.headline}
                </Link>
              </h2>
              <p className="mt-2 text-text-800">{a.description}</p>
              <p className="mt-2 text-sm text-text-700">
                Published <time dateTime={a.datePublished}>{formatDate(a.datePublished)}</time>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Looking for something else?</h2>
        <p className="mt-4 text-text-800">
          If a gate is down right now, start with{" "}
          <Link href="/support" className={link}>
            support and diagnostics
          </Link>
          . To see what we run for operators, read about{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud access control hosting
          </Link>{" "}
          and{" "}
          <Link href="/solutions/web-hosting" className={link}>
            facility websites
          </Link>
          .
        </p>
      </section>

      <CtaBand
        heading="Have a question these guides do not answer?"
        text="Tell us which software and gate system you run, and we will answer it."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
