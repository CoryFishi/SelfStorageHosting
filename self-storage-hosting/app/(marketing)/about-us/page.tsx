import type { Metadata } from "next";
import Link from "next/link";
import {
  BiCloudUpload,
  BiNetworkChart,
  BiShieldAlt2,
  BiServer,
  BiGitBranch,
  BiSupport,
  BiPulse,
  BiRightArrowAlt,
} from "react-icons/bi";
import { pageMeta } from "@/lib/seo";
import { OUTAGE_BEHAVIOR, HARDWARE_INTEGRATIONS, FMS_BRIDGES } from "@/lib/claims";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Faq, { type FaqItem } from "@/components/Faq";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "About Us",
  description:
    "Why we built cloud access control for independent self-storage operators, and how our FMS-to-gate bridges work.",
  path: "/about-us",
});

const values = [
  {
    icon: BiCloudUpload,
    title: "Cloud-Hosted, Purpose-Built",
    desc: "We host and manage your access control stack in the cloud, purpose-built for self-storage. No on-site servers to babysit.",
  },
  {
    icon: BiNetworkChart,
    title: "Unified Integrations",
    desc: "Bridge gates, smart locks, keypads, and door alarms into a single API and dashboard. Multi-site by default.",
  },
  {
    // Spec §14 B: TLS is the one security fact that is observable from the
    // browser. Everything else waits for the owner to confirm it; see the
    // FAQ security answer below for the same policy applied in full.
    icon: BiShieldAlt2,
    title: "Security First",
    desc: "Served over TLS. Ask us for our current security posture.",
  },
  {
    icon: BiServer,
    title: "Operator-Grade Reliability",
    desc: "Rolling updates and health checks so your doors work when customers do.",
  },
];

const pillars = [
  {
    icon: BiGitBranch,
    title: "Open APIs",
    desc: "Clean REST + Webhooks for FMS and installer tools. Bring your own workflows.",
  },
  {
    icon: BiPulse,
    title: "Device Telemetry",
    desc: "Status for locks, gates, sensors and battery health, with actionable alerts rather than noise.",
  },
  {
    icon: BiSupport,
    title: "Installer Friendly",
    desc: "Zero-touch provisioning, site templates, and remote diagnostics to cut truck rolls.",
  },
];

const faqs: FaqItem[] = [
  {
    q: "How does onboarding work?",
    a: "We provision your cloud tenant, connect your hardware, sync your property data, and go live with staged rollouts by facility.",
  },
  {
    q: "What if site internet goes down?",
    a: OUTAGE_BEHAVIOR,
  },
  {
    q: "Do you integrate with my FMS?",
    a: "We're steadily adding bridges for well-known facility management software. Tell us what you run and we'll scope it.",
  },
  {
    // Spec §14 B: same policy as the "Security First" card above — TLS is
    // observable and stays; everything else is an invitation, not a claim.
    q: "How do you handle security?",
    a: "Served over TLS. Ask us for our current security posture.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About Us", path: "/about-us" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-50 via-secondary-50 to-background-50" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              Run your access control from the cloud, built for self-storage
            </h1>
            <p className="mt-4 text-lg text-text-700">
              We unify gates, smart locks, keypads, and sensors from one
              platform to the next via the cloud, to reduce your operational
              costs and risks.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/contact"
                className={`rounded-full bg-primary-700 px-6 py-3 text-text-50 shadow-lg transition hover:scale-[1.02] hover:bg-primary-800 ${FOCUS_RING_LIGHT}`}
              >
                Talk to us
              </Link>
              <Link
                href="/solutions"
                className={`rounded-full border border-text-700 bg-background-50 px-6 py-3 text-text-900 transition hover:bg-background-100 ${FOCUS_RING_LIGHT}`}
              >
                Explore solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Our story */}
      <section id="story" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">Why we exist</h2>
          <p className="mt-3 text-text-700">
            Access control shouldn’t require on-site servers, duct-taped
            scripts, or late-night truck rolls. We bring a clean cloud layer to
            self-storage so you can deploy faster, operate reliably, and
            integrate with the tools you already use.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-background-200 bg-background-50 p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
                <Icon aria-hidden="true" className="h-5 w-5 text-primary-700" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-text-700">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mx-auto max-w-3xl rounded-3xl border border-background-200 bg-background-50 p-8 text-center shadow-sm">
          <h2 className="text-3xl font-semibold">Careers</h2>
          <p className="mt-3 text-text-700">
            We’re not hiring right now, but we’re always glad to hear from
            people who care about self-storage operations.{" "}
            <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
              Say hello
            </Link>{" "}
            and we’ll keep you in mind as the team grows.
          </p>
        </div>
      </section>

      {/* News */}
      <section id="news" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-background-200 bg-background-50 p-8 text-center shadow-sm">
          <h2 className="text-3xl font-semibold">News</h2>
          <p className="mt-3 text-text-700">
            We don’t have any announcements yet. When we do, they’ll show up
            here first.
          </p>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-3xl bg-background-50 p-8 shadow-sm ring-1 ring-background-200">
          <h2 className="text-3xl font-semibold">Built for operators</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="mt-1 rounded-lg bg-secondary-50 p-2">
                  <Icon aria-hidden="true" className="h-6 w-6 text-secondary-700" />
                </div>
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-text-700">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security + Reliability */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-background-200 p-6">
              <div className="flex items-center gap-2">
                <BiShieldAlt2 aria-hidden="true" className="h-5 w-5 text-primary-700" />
                <h4 className="font-semibold">Security</h4>
              </div>
              {/* Spec §14 B: see the "Security First" card above for the policy. */}
              <p className="mt-3 text-sm text-text-700">
                Served over TLS. Ask us for our current security posture.
              </p>
            </div>
            <div className="rounded-2xl border border-background-200 p-6">
              <div className="flex items-center gap-2">
                <BiServer aria-hidden="true" className="h-5 w-5 text-accent-700" />
                <h4 className="font-semibold">Reliability & Operations</h4>
              </div>
              {/* Spec §14 D3 leaves a related outage-time behavior as an open
                  owner question, so this list sticks to ordinary operational
                  practice rather than answering it. What happens during an
                  outage is stated once, from OUTAGE_BEHAVIOR, in this page's
                  FAQ. */}
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-text-700">
                <li>Rolling updates</li>
                <li>Health checks</li>
                <li>Proactive monitoring and alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hardware Integrations */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">What we integrate</h2>
          <p className="mt-3 text-text-700">
            Bring your existing hardware. We provide the glue—connectors, APIs,
            and a control plane—to orchestrate everything together.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {HARDWARE_INTEGRATIONS.map((i) => (
            <div
              key={i.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{i.name}</h3>
              <p className="mt-2 text-sm text-text-700">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FMS -> Access Control Bridges */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">
            We bridge facility management software to your access control
          </h2>
          <p className="mt-3 text-text-700">
            We can bridge Storable Edge and Storable Easy to OpenTech
            Alliance’s INSOMNIAC® CIA and to DigiGate. Tell us your setup. A
            bridge carries tenants, units, access levels and lockouts from
            your FMS to your access control.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FMS_BRIDGES.map(({ from, to }) => (
            <div
              key={`${from}-${to}`}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-secondary-50 p-2">
                  <BiRightArrowAlt aria-hidden="true" className="h-6 w-6 text-secondary-700" />
                </div>
                <div>
                  <div className="text-sm text-text-700">{from}</div>
                  <div className="mt-1 text-sm text-text-700">to</div>
                  <div className="text-lg font-semibold">{to}</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-text-700">
                We can bridge {from} to {to}. Tell us your setup.
              </p>
            </div>
          ))}

          <div className="rounded-2xl border border-dashed border-background-300 bg-background-50 p-5 shadow-sm">
            <h3 className="text-lg font-semibold">Running something else?</h3>
            <p className="mt-2 text-sm text-text-700">
              Tell us which FMS you run—we’ll scope a bridge for it.
            </p>
            <Link
              href="/contact"
              className={`mt-4 inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-text-950 transition hover:bg-accent-400 ${FOCUS_RING_LIGHT}`}
            >
              Tell us which FMS you run
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold">FAQs</h2>
          <p className="mt-3 text-text-700">
            Quick answers to common questions from operators and installers.
          </p>
        </div>
        <div className="mt-8">
          <Faq items={faqs} />
        </div>
      </section>

      <CtaBand
        heading="Ready to modernize your sites?"
        text="Get a tailored plan for your facilities and integrations."
        primary={{ href: "/demo", label: "Book a demo" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
