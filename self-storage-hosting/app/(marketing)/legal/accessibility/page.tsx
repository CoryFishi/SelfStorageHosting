import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER REVIEW.
//
// Every claim in "What we check" is backed by code or a test in this
// repository (see the table in the plan's Task 11). It claims no conformance
// level, because there has been no outside audit. Keep it that way until
// there is one. When spec 14 A supplies a business email or phone number, add
// it under "Tell us about a barrier": a visitor who cannot use the contact
// form has no other way to reach us today.

export const metadata: Metadata = pageMeta({
  title: "Accessibility Statement",
  description:
    "How this website is built and checked for accessibility, its known limitations, and how to tell us about a barrier.",
  path: "/legal/accessibility",
});

const checks = [
  "Text is checked against its background for a contrast ratio of at least 4.5 to 1, and keyboard focus outlines for at least 3 to 1, by automated tests that are part of this site's code.",
  "Each page has a single main heading, and a “Skip to content” link is the first thing you reach with the keyboard.",
  "Links, buttons and form fields show a visible outline when you reach them with the keyboard.",
  "Form fields have visible labels. A field with a problem is marked as invalid and linked to a message that explains it, and the result of sending a form is announced to screen readers.",
  "Animations and transitions switch off when your device asks for reduced motion.",
  "Images that carry information have a text description. Decorative images are hidden from screen readers.",
  "Each page declares its language, so screen readers pronounce it correctly.",
];

export default function AccessibilityPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Accessibility Statement", path: "/legal/accessibility" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Accessibility statement</h1>
        <p className="mt-2 text-sm text-text-700">
          Last updated {formatDate(LEGAL_UPDATED.accessibility)}
        </p>
        <p className="mt-6 text-text-800">
          We want everyone who runs or works at a self-storage facility to be able to use this
          website, including people who use a keyboard, a screen reader, magnification or voice
          control.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Our target</h2>
        <p className="mt-4 text-text-800">
          We build this site to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level
          AA. This statement is based on our own checks, not an outside audit.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What we do</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-text-800">
          {checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Known limitations</h2>
        <p className="mt-4 text-text-800">
          Some pages link to other companies&apos; websites, such as vendor support pages and event
          organizers&apos; pages. We do not control how accessible those websites are.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Tell us about a barrier</h2>
        <p className="mt-4 text-text-800">
          If any part of this site does not work for you, tell us through the{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            contact form
          </Link>
          . Say which page it was, what you were trying to do, and which browser or assistive
          technology you use.
        </p>
      </article>
    </>
  );
}
