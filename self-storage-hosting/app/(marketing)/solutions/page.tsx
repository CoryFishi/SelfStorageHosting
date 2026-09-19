import type { Metadata } from "next";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Solutions",
  description:
    "Cloud access control hosting and facility websites built for independent self-storage operators. Compare both solutions.",
  path: "/solutions",
});

const solutions = [
  {
    href: "/solutions/access-control-hosting",
    name: "Access control hosting",
    summary:
      "Your gate controllers, keypads and smart locks, run from the cloud instead of from a PC in the office. Gate codes, move-ins and lockouts flow from your facility management software to the gate without a sync program to babysit.",
    bestFor:
      "Operators whose gate software lives on an office PC, or who run gate hardware its manufacturer no longer sells or supports.",
  },
  {
    href: "/solutions/web-hosting",
    name: "Facility websites",
    summary:
      "A website for each facility on your own domain, with an SSL certificate, a CDN, forms that capture leads, and optional online move-ins where your facility management software supports them.",
    bestFor:
      "Operators with a dated site, no site at all, or a site nobody on the team can update.",
  },
];

// A real comparison, one problem per row. The spec forbids a link list here.
const needs = [
  {
    situation: "Your gate software runs on a PC in the office that has to stay switched on",
    fit: "Access control hosting",
  },
  {
    situation: "New gate codes or lockouts are slow to reach the keypad, or sometimes never arrive",
    fit: "Access control hosting",
  },
  {
    situation: "Your website looks dated, or nobody on the team can update it",
    fit: "Facility websites",
  },
  {
    situation:
      "You want tenants to check availability or move in online, where your FMS supports it",
    fit: "Facility websites",
  },
  {
    situation: "You are replacing end-of-life gate hardware and want a new website at the same time",
    fit: "Both",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Solutions for independent self-storage operators
        </h1>
        <p className="mt-4 text-lg text-text-800">
          We do two things. We run self-storage access control from the cloud, and we build and host
          facility websites. Each works on its own, and you can start with either. Both are built for
          operators who run a handful of facilities without an IT department.
        </p>
      </section>

      <section
        aria-label="Our solutions"
        className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 md:grid-cols-2"
      >
        {solutions.map((s) => (
          <article
            key={s.href}
            className="flex flex-col rounded-2xl border border-background-200 bg-background-50 p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold">{s.name}</h2>
            <p className="mt-3 text-text-800">{s.summary}</p>
            <p className="mt-4 text-text-700">
              <span className="font-semibold text-text-900">Best for: </span>
              {s.bestFor}
            </p>
            <Link
              href={s.href}
              className={`mt-6 inline-flex items-center gap-1 self-start font-semibold text-primary-700 underline ${FOCUS_RING_LIGHT}`}
            >
              Explore {s.name.toLowerCase()}
              <BiRightArrowAlt aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold">Which do I need?</h2>
        <p className="mt-3 text-text-800">
          Start from the problem in front of you today. The other can wait.
        </p>
        <table className="mt-6 w-full border-collapse text-left">
          <caption className="sr-only">Which solution fits each situation</caption>
          <thead>
            <tr className="border-b border-background-300">
              <th scope="col" className="py-3 pr-4 font-semibold">
                If this sounds like you
              </th>
              <th scope="col" className="py-3 font-semibold">
                Start with
              </th>
            </tr>
          </thead>
          <tbody>
            {needs.map((n) => (
              <tr key={n.situation} className="border-b border-background-200 align-top">
                <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                  {n.situation}
                </th>
                <td className="py-3 font-medium text-text-900">{n.fit}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-text-800">
          You do not have to move both at once. Start with whichever problem costs you more today,
          and add the other when it suits you.
        </p>
      </section>

      <CtaBand
        heading="Not sure which fits?"
        text="Tell us about your facilities and we will point you to the right starting place."
        primary={{ href: "/contact", label: "Talk to us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
