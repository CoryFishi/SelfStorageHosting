import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import { THIRD_PARTY_MARKS } from "@/lib/trademarks";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
//
// Lists the third-party names the site uses (lib/trademarks.ts) and says why
// we use them. It claims no registration status for any mark, and it names
// owners as plain company names because their legal entities were not
// verified. Spec 15: never imply a partnership or endorsement.

export const metadata: Metadata = pageMeta({
  title: "Trademarks",
  description:
    "The third-party company and product names this site mentions, who owns them, and why we name them. No affiliation is implied.",
  path: "/legal/trademarks",
});

export default function TrademarksPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Trademarks", path: "/legal/trademarks" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Trademarks</h1>
        <p className="mt-2 text-sm text-text-700">Last updated {formatDate(LEGAL_UPDATED.trademarks)}</p>
        <p className="mt-6 text-text-800">
          This site names other companies and their products so we can say plainly which systems
          our services work with, and where to find each vendor&apos;s own support. Those names
          belong to their owners. We use them only to identify those companies and their products.
        </p>
        <p className="mt-4 text-text-800">
          Naming a company here does not mean it sponsors or endorses us. We are not affiliated with
          any of them.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Names we use, by owner</h2>
        <dl className="mt-4 divide-y divide-background-200 border-y border-background-200">
          {THIRD_PARTY_MARKS.map((m) => (
            <div key={m.owner} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
              <dt className="font-semibold text-text-900">{m.owner}</dt>
              <dd className="text-text-800 sm:col-span-2">{m.marks.join(", ")}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-text-800">
          Event and association names on our events page belong to their organizers.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">If you own one of these names</h2>
        <p className="mt-4 text-text-800">
          If you want us to change how we use your name, tell us through the{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            contact form
          </Link>
          .
        </p>
      </article>
    </>
  );
}
