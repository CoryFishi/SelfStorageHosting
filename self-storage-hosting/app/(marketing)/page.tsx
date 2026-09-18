import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BiRightArrowAlt } from "react-icons/bi";
import { pageMeta } from "@/lib/seo";
import Faq, { type FaqItem } from "@/components/Faq";

export const metadata: Metadata = pageMeta({
  title: "Cloud Access Control for Self-Storage",
  description:
    "Cloud-hosted access control and facility websites for independent self-storage operators. No on-site server to maintain.",
  path: "/",
});

const faqs: FaqItem[] = [
  {
    q: "Do we need an on-site server for access control?",
    a: "No—it's cloud-hosted. A small on-site bridge talks to your gate and locks and syncs with the cloud.",
  },
  {
    q: "Which access control hardware do you support?",
    a: "Most modern gate operators, keypads, and smart locks via APIs or adapters; connectors exist for common vendors.",
  },
  {
    q: "What happens if the site loses internet?",
    a: "The on-site controller keeps enforcing the access rules it already has, so tenants can still get in and out while the connection is down.",
  },
  {
    // The original wording named two access-management capabilities that spec
    // 14 B lists as unsubstantiated -- the same ones the security answer below
    // deliberately withholds. Stating them in plain English instead of jargon
    // does not make them substantiated, so they are gone.
    q: "Is multi-site management supported?",
    a: "Yes—a single dashboard with per-facility controls.",
  },
  {
    q: "Do you host small marketing websites too?",
    a: "Yes—fast sites on your domain with SSL, CDN, forms and lead capture, and optional online move-ins.",
  },
  {
    q: "How do integrations work?",
    a: "REST/JSON API and webhooks, or pre-built connectors for common self-storage facility management software (FMS).",
  },
  // Spec §14 B lists several security capabilities the owner has not yet
  // substantiated, and says anything unsubstantiated comes out. TLS is
  // observable from the browser, so it stays; everything else is replaced with
  // an invitation rather than a claim. Restore the specifics only once the
  // owner confirms them -- they are deliberately not named here, because
  // tests/content-policy.test.ts greps this file's source text and a comment
  // quoting them would fail the guard it is describing.
  {
    q: "How is data secured?",
    a: "Every connection is served over TLS. For our current security posture in detail — storage, staff access, isolation and audit — ask us and we will walk you through it.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:py-24">
        <div className="lg:flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Self Storage Hosting
            <span className="mt-2 block h-[3px] w-12 rounded bg-accent-500" />
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Improve operational efficiency and stay serverless
          </h1>
          <p className="mt-4 text-lg text-text-800">
            Our self-storage facility solutions are designed to be easy to find and easy to
            use—helping you maintain a cleaner solution for your customers.
          </p>
          <Link
            href="/demo"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3 font-semibold text-text-950 transition hover:bg-accent-400"
          >
            Get started
            <BiRightArrowAlt aria-hidden="true" />
          </Link>
        </div>
        <Image
          src="/HeroImage.png"
          alt="Cloud-connected self-storage facility gate and access control keypad"
          width={384}
          height={384}
          fetchPriority="high"
          loading="eager"
          className="h-auto w-full max-w-sm"
        />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
          Maximizing your facility efficiency
          <span className="mt-2 block h-[3px] w-12 rounded bg-accent-500" />
        </p>
        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          Powerful solutions to grow your impact
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Link
            href="/solutions/web-hosting"
            className="rounded-xl border border-background-200 bg-white/70 p-6 transition-colors hover:border-accent-700"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">Personalized web hosting services</h3>
              <BiRightArrowAlt aria-hidden="true" className="shrink-0 text-2xl text-accent-700" />
            </div>
            <p className="mt-2">Increase your rentals by allowing tenants to rent and pay online.</p>
          </Link>
          <Link
            href="/solutions/access-control-hosting"
            className="rounded-xl border border-background-200 bg-white/70 p-6 transition-colors hover:border-accent-700"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold">Cloud managed access control integrations</h3>
              <BiRightArrowAlt aria-hidden="true" className="shrink-0 text-2xl text-accent-700" />
            </div>
            <p className="mt-2">
              Let your gate and access control systems run from the cloud for easier operation and
              less downtime.
            </p>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">FAQs</h2>
        <div className="mt-10">
          <Faq items={faqs} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary-700 p-8 text-text-50 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Ready to make the move to the cloud?</h2>
            <p className="mt-1 text-accent-200">
              Talk to our team to see a tailored demo for your portfolio.
            </p>
          </div>
          <Link
            href="/demo"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-50 px-5 py-3 font-semibold text-text-950 transition hover:bg-accent-200"
          >
            Request a demo
            <BiRightArrowAlt aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
