import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER OR COUNSEL REVIEW BEFORE PR #1 MERGES. Not legal advice.
//
// Plain rules for using this website, and nothing more. The owner or counsel
// must still decide, at least:
//   - the legal entity that offers these terms (spec 14 C);
//   - which law applies and how disputes are settled;
//   - any warranty disclaimer and any limit on liability.
// This page states none of those, and tests/legal.test.ts keeps it that way.
// Terms for the services themselves belong in each customer's written
// agreement, not here.

export const metadata: Metadata = pageMeta({
  title: "Terms of Service",
  description:
    "The rules for using this website: what its information is for, how to use its forms and accounts, and how these terms change.",
  path: "/legal/terms",
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Terms of Service", path: "/legal/terms" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Terms of service</h1>
        <p className="mt-2 text-sm text-text-700">Last updated {formatDate(LEGAL_UPDATED.terms)}</p>
        <p className="mt-6 text-text-800">
          These terms apply when you use this website. The services we provide to self-storage
          operators are covered by a separate written agreement, and that agreement governs those
          services.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What the information here is for</h2>
        <p className="mt-4 text-text-800">
          This website describes our services and the self-storage systems they work with. It is
          general information, not a promise about your facilities. What we will provide to you is
          set out in a written agreement.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Other companies&apos; products and pages</h2>
        <p className="mt-4 text-text-800">
          We name other companies&apos; products to describe what our services work with, and we link
          to those companies&apos; own pages for support and events. We check those facts against the
          companies&apos; own pages, but they can change. We do not control those
          websites.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Using the forms</h2>
        <p className="mt-4 text-text-800">
          Send only information that is accurate and that you are entitled to share. Do not use the
          forms to send advertising or anything harmful. We may block messages that look automated.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Accounts</h2>
        <p className="mt-4 text-text-800">
          If you create an account, keep your password to yourself, and tell us if you think someone
          else has used it.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Using the site fairly</h2>
        <p className="mt-4 text-text-800">
          Do not try to break or overload this website, get around its protections, or reach parts
          of it that are not meant for you.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Changes to these terms</h2>
        <p className="mt-4 text-text-800">
          When these terms change, the date at the top of this page changes with them.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions</h2>
        <p className="mt-4 text-text-800">
          Ask us through the{" "}
          <Link href="/contact" className={link}>
            contact form
          </Link>
          .
        </p>
      </article>
    </>
  );
}
