import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Faq, { type FaqItem } from "@/components/Faq";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Self-Storage Facility Websites",
  description:
    "Websites for self-storage facilities on your own domain, with SSL, a CDN, lead capture forms and optional online move-ins. Request a quote.",
  path: "/solutions/web-hosting",
});

const audience = [
  "You run one facility or a handful, without an IT department.",
  "Your current site looks dated, or nobody on the team can update it.",
  "The hours, prices or unit sizes on your site no longer match the office.",
  "You have no website yet.",
];

// Only what the home page and /solutions already offer, plus unit
// availability (spec 6.2). Where a feature depends on the facility's FMS,
// the copy says so.
const included = [
  {
    name: "Your own domain",
    desc: "The site runs on your domain name, so the name tenants search for leads straight to you.",
  },
  {
    name: "SSL certificate",
    desc: "Every page is served over HTTPS, so browsers do not flag the site as “Not secure”.",
  },
  {
    name: "Content delivery network",
    desc: "Pages are served through a CDN, which delivers them from locations close to each visitor.",
  },
  {
    name: "Forms and lead capture",
    desc: "Inquiry forms that send each lead to your team while the tenant is still deciding.",
  },
  {
    name: "Unit availability",
    desc: "Where your facility management software supports it, the site can show which unit sizes are available.",
  },
  {
    name: "Optional online move-ins",
    desc: "Where your facility management software supports it, tenants can rent a unit online without calling the office.",
  },
];

// Why the included basics help a facility get found. Each point follows from
// a feature above. None is a promise about rankings or speed.
const basics = [
  {
    lead: "Your domain keeps the credit.",
    text: "Every link to your site builds up under your own name, not under a directory or a platform you do not control.",
  },
  {
    lead: "HTTPS is expected.",
    text: "Browsers mark pages without it as “Not secure”. That is the wrong first impression for a business that sells secure storage.",
  },
  {
    lead: "Distance costs time.",
    text: "A CDN serves each page from a location near the visitor, so it has less distance to travel.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "Can we keep our domain name?",
    a: "Yes. The site runs on your own domain.",
  },
  {
    q: "Can tenants rent a unit online?",
    a: "Where your facility management software supports online move-ins, yes. Tell us which FMS you run and we will confirm what it supports.",
  },
  {
    q: "We already have a website. Can you replace it?",
    a: "Yes. Tell us what is on your current site and what you would like to change, and we will scope the new one.",
  },
  {
    q: "Do we need your access control hosting as well?",
    a: "No. Facility websites work on their own. You can add access control hosting later, or not at all.",
  },
  {
    q: "Is the site secure?",
    a: "Every page is served over TLS, with an SSL certificate on your domain. Ask us for our current security posture.",
  },
  {
    q: "What does it cost?",
    a: "Pricing depends on how many facilities you run and what each site needs. Request a quote and we will price it for your portfolio.",
  },
];

export default function WebHostingPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Facility Websites", path: "/solutions/web-hosting" },
        ]}
      />

      {/* 1. Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-12 sm:px-6">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
          Websites for self-storage facilities
        </h1>
        <p className="mt-5 text-lg text-text-800">
          A website for each facility on your own domain, with an SSL certificate, a CDN, forms
          that capture leads, and optional online move-ins where your facility management software
          supports them.
        </p>
        <Link
          href="/contact"
          className={`mt-8 inline-flex rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 hover:bg-accent-400 ${FOCUS_RING_LIGHT}`}
        >
          Request a quote
        </Link>
      </section>

      {/* 2. Who it's for */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Who it is for</h2>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-text-800">
          {audience.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>

      {/* 3. What's included */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">What is included</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.map((f) => (
            <li
              key={f.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <p className="mt-2 text-text-700">{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 4. Why the basics matter for search */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Why the basics matter for search</h2>
        <ul className="mt-6 space-y-4 text-text-800">
          {basics.map((b) => (
            <li key={b.lead}>
              <strong className="font-semibold text-text-900">{b.lead}</strong> {b.text}
            </li>
          ))}
        </ul>
      </section>

      {/* 5. How it connects to the FMS */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          How it connects to your facility management software
        </h2>
        <p className="mt-4 text-text-800">
          Unit availability and online move-ins come from your facility management software. Which
          of them your site can offer depends on the FMS you run and what it allows.{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Tell us which FMS you run
          </Link>{" "}
          and we will confirm what your site can do with it.
        </p>
        <p className="mt-4 text-text-800">
          Running your gate from an office PC as well?{" "}
          <Link
            href="/solutions/access-control-hosting"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            See access control hosting
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          Checking which gate systems your software lists as integrations? See{" "}
          <Link
            href="/resources/self-storage-gate-compatibility"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            our gate compatibility matrix
          </Link>
          , or browse all our{" "}
          <Link href="/resources" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            guides for operators
          </Link>
          .
        </p>
      </section>

      {/* 6. FAQ: accordion semantics only. Never FAQPage JSON-LD (spec 7.2). */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq items={faqs} />
        </div>
      </section>

      {/* 7. CTA */}
      <CtaBand
        heading="Get a quote for your facility website"
        text="Tell us how many facilities you run and what your current site does, and we will send a quote."
        primary={{ href: "/contact", label: "Request a quote" }}
        secondary={{ href: "/solutions/access-control-hosting", label: "Explore access control hosting" }}
      />
    </>
  );
}
