import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Request a Demo",
  description:
    "See how cloud access control would work with your gate system and facility software. Book a tailored walkthrough and learn what happens next.",
  path: "/demo",
});

// What a visitor can expect from the call. Nothing here promises a result,
// a timeframe or a price. It describes what we walk through.
const covers = [
  "How your gate controllers, keypads and smart locks would connect to the cloud, and what stays on site.",
  "How gate codes, move-ins and lockouts would flow from your facility management software to the gate.",
  "What happens at your site when the internet connection drops, and when it comes back.",
  "What moving off an office PC, or off hardware that is no longer supported, would involve for your facilities.",
  "Facility websites, if you want to see those as well.",
];

export default function DemoPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Request a Demo", path: "/demo" },
        ]}
      />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Request a demo</h1>
          <p className="mt-4 text-lg text-text-800">
            A walkthrough built around your facilities: the gate hardware on site, the facility
            management software you run, and how many locations you manage. The more you tell us
            below, the more of the demo is about your setup rather than a generic one.
          </p>

          <h2 className="mt-10 text-xl font-semibold">What the demo covers</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
            {covers.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <h2 className="mt-10 text-xl font-semibold">What happens next</h2>
          <p className="mt-3 text-text-800">
            We reply within one business day to arrange a time. If part of your setup needs checking
            before we can show it, such as an older controller or a less common FMS, we will tell you
            before the call rather than during it.
          </p>
          <p className="mt-3 text-text-800">
            Only have a question?{" "}
            <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
              Send us a message
            </Link>{" "}
            instead.
          </p>
        </div>

        <div>
          <ContactForm variant="demo" />
        </div>
      </section>
    </>
  );
}
