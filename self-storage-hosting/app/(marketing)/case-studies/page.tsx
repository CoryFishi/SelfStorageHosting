import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";

// noindex comes from ROUTES["/case-studies"].indexable === false, through
// pageMeta. Add no numbers, quotes or logos here until a real operator has
// agreed to publish real results. tests/case-studies.test.ts enforces it.
export const metadata: Metadata = pageMeta({
  title: "Case Studies",
  description:
    "What we measure when an operator moves gate access control off the office PC, and how to become one of our first references.",
  path: "/case-studies",
});

const measures = [
  {
    name: "Truck rolls avoided",
    desc: "Trips to a facility to restart, update or repair the computer that runs the gate. We count them per facility, before the move and after it.",
  },
  {
    name: "Sync failure rate",
    desc: "How often a change made in the facility management software fails to reach the gate the first time. We measure it from the event history.",
  },
  {
    name: "Time to provision a new site",
    desc: "The time from a signed agreement to the first tenant code working at the gate.",
  },
];

export default function CaseStudiesPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Case studies</h1>
        <p className="mt-4 text-lg text-text-800">
          We have not published a case study yet. When we do, it will report measurements from the
          operator&apos;s own facilities, and it will name the operator only with their permission.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">What we will measure</h2>
        <ul className="mt-6 space-y-4">
          {measures.map((m) => (
            <li
              key={m.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="mt-2 text-text-700">{m.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Be one of our first references</h2>
        <p className="mt-4 text-text-800">
          If your gate still depends on an office PC, we would like to measure the move with you.
          You see the numbers first, and nothing is published without your permission.
        </p>
      </section>

      <CtaBand
        heading="Become a first reference"
        text="Tell us about your facilities and what runs your gate today."
        primary={{ href: "/contact", label: "Talk to us" }}
        secondary={{ href: "/solutions/access-control-hosting", label: "See access control hosting" }}
      />
    </>
  );
}
