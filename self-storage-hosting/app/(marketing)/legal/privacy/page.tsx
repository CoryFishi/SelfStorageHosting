import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { LEGAL_UPDATED } from "@/lib/legal";
import { formatDate } from "@/lib/dates";
import Breadcrumbs from "@/components/Breadcrumbs";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// DRAFT FOR OWNER OR COUNSEL REVIEW. Not legal advice.
//
// This page describes what the website's code does with personal
// information, checked against the code on the date in lib/legal.ts. The
// owner or counsel must still decide, at least:
//   - the legal entity that operates the site (spec 14 C);
//   - how long messages and account details are kept;
//   - whether privacy requests need a route other than the contact form;
//   - whether any law-specific sections are needed, for example for US
//     state privacy laws;
//   - whether Cloudflare's bot protection sets a cookie of its own on this
//     zone. If it does, disclose it under "Cookies".
// This page states none of those. tests/legal.test.ts keeps it that way, and
// keeps the data-flow facts below in step with the code.

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description:
    "What this website collects when you send a message or create an account, where it goes, who handles it, the one cookie it uses, and your choices.",
  path: "/legal/privacy",
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/legal/privacy" },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Privacy policy</h1>
        <p className="mt-2 text-sm text-text-700">Last updated {formatDate(LEGAL_UPDATED.privacy)}</p>
        <p className="mt-6 text-text-800">
          This policy explains what this website collects, why, and where it goes. It covers this
          website only. If you become a customer, the written agreement for our services covers the
          information those services handle.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">When you send us a message</h2>
        <p className="mt-4 text-text-800">
          The contact form and the demo request form both ask for your name, your email address and
          a message (optional on the demo form). You can also tell us your company, phone number,
          number of facilities, facility management software and gate or access system, and, on the
          demo form, your timeline.
        </p>
        <p className="mt-4 text-text-800">
          We use what you send to reply to you and to prepare for the conversation you asked for.
          Our server checks the form, then sends it as an email through Resend, an email delivery
          service, to our business inbox. The reply-to address on that email is the one you gave
          us, so our answer comes straight back to you. The website itself keeps no copy.
        </p>
        <p className="mt-4 text-text-800">
          To stop the forms being flooded, our server also reads your IP address and counts the
          messages sent from it each minute. That count is held in the server&apos;s memory only. It
          is not written to a database or a log, it is not sent anywhere, and it is lost when the
          server restarts.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">When you create an account</h2>
        <p className="mt-4 text-text-800">
          Our account server stores your email address, your name if you give one, a one-way hash
          of your password (never the password itself), the account&apos;s role, and the dates the
          account was created and last changed. We use them to sign you in.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Cookies</h2>
        <p className="mt-4 text-text-800">
          Signing in or creating an account sets one cookie, named <code>token</code>, from our
          account server. It keeps you signed in, and it expires seven days after you sign in or
          when you log out.
        </p>
        <p className="mt-4 text-text-800">
          Our own code sets no other cookie. This site uses no analytics, advertising or tracking
          cookies.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What this site does not use</h2>
        <p className="mt-4 text-text-800">
          This site uses no analytics or advertising, and it loads no scripts from other companies.
          Fonts and images are served from this website itself.
        </p>
        <p className="mt-4 text-text-800">
          Some pages link to other websites, such as vendor support pages and event organizers&apos;
          pages. Those websites have their own privacy policies.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Who handles your information</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-text-800">
          <li>
            Netlify hosts this website, and Cloudflare sits in front of it. Like any web host, they
            process your IP address and browser details to deliver each page, and they may keep
            request logs under their own policies.
          </li>
          <li>Resend delivers form messages to our inbox.</li>
          <li>The provider that hosts our business email stores the messages we receive.</li>
          <li>Our account server and its database store account details.</li>
        </ul>
        <p className="mt-4 text-text-800">
          We do not sell personal information or share it for advertising.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your choices</h2>
        <p className="mt-4 text-text-800">
          You can ask us what we hold about you, and ask us to correct or delete it. Send the request
          through the{" "}
          <Link href="/contact" className={link}>
            contact form
          </Link>
          .
        </p>

        <section id="security" className="scroll-mt-24">
          <h2 className="mt-10 text-2xl font-semibold">Security</h2>
          <p className="mt-4 text-text-800">
            Served over TLS.{" "}
            <Link href="/contact" className={link}>
              Ask us for our current security posture
            </Link>
            .
          </p>
        </section>

        <h2 className="mt-10 text-2xl font-semibold">Changes to this policy</h2>
        <p className="mt-4 text-text-800">
          When this policy changes, the date at the top of this page changes with it.
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
