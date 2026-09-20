import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { SOURCES } from "@/lib/sources";
import { OUTAGE_BEHAVIOR, HARDWARE_INTEGRATIONS, FMS_BRIDGES } from "@/lib/claims";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import Faq, { type FaqItem } from "@/components/Faq";
import SourceLink from "@/components/SourceLink";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

export const metadata: Metadata = pageMeta({
  title: "Cloud Self-Storage Access Control",
  description:
    "Run gate controllers, keypads and smart locks from the cloud instead of an office PC. Built for independent self-storage operators. Request a quote.",
  path: "/solutions/access-control-hosting",
});

// Generic risks of any single desktop computer. None is a claim about a
// specific vendor's product, which is why none carries a citation.
const pcRisks = [
  "The PC or its disk fails, and the gate stops receiving changes until the machine is replaced and set up again.",
  "A Windows update restarts it overnight, at a time nobody chose.",
  "Someone switches it off, or closes the program, at the end of the day.",
  "Reaching it from home means a VPN or port forwarding, on an internet connection whose IP address can change.",
  "Fixing it means a trip to the site, often after hours.",
  "Backups and restores are nobody's job until the day they are needed.",
  "Its operating system reaches the end of its support life, and whatever runs on it has to be moved or upgraded.",
];

const flow = [
  {
    name: "Your facility management software",
    desc: "Where tenants, units and gate codes already live.",
  },
  {
    name: "Our cloud service",
    desc: "Receives changes from your FMS and holds each facility's access rules.",
  },
  {
    name: "A small bridge at the site",
    desc: "Keeps a connection to the cloud and passes changes to your controllers.",
  },
  {
    name: "Your gate, keypads and locks",
    desc: "Enforce the rules at the gate and at the unit door.",
  },
];

// Outage behaviour is answered once, under "How it works", not repeated here.
const faqs: FaqItem[] = [
  {
    q: "Do we still need a PC in the office for the gate?",
    a: "Not for access control. The gate software runs in the cloud, and a small bridge at the site talks to your controllers. If your facility management software is a desktop program, it still needs a computer to run on, but the gate no longer depends on that computer staying on.",
  },
  {
    q: "What hardware do you work with?",
    a: "Gate controllers, keypads and readers, smart locks, and door alarms and sensors. Tell us which models you run and we will confirm what connecting them involves.",
  },
  {
    q: "Which facility management software can you connect?",
    a: "We can bridge Storable Edge and Storable Easy to INSOMNIAC CIA and to DigiGate. Running something else? Tell us your setup and we will say plainly whether we can bridge it.",
  },
  {
    q: "Our gate hardware is no longer supported by its manufacturer. Can you help?",
    a: "Tell us what is on site. We will tell you plainly whether we can work with it as it is, and what replacing it would involve if not.",
  },
  {
    q: "How is our data protected?",
    a: "Served over TLS. Ask us for our current security posture.",
  },
  {
    q: "What does it cost?",
    a: "Pricing depends on how many facilities you run and what hardware is on site. Request a quote and we will price it for your portfolio.",
  },
];

export default function AccessControlHostingPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Access Control Hosting", path: "/solutions/access-control-hosting" },
        ]}
      />

      {/* 1. Hero: leads with the office PC. Offline operation is never the lead (spec 3.2). */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-12 sm:px-6">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
          Cloud-hosted access control for self-storage
        </h1>
        <p className="mt-5 text-lg text-text-800">
          Run your gate controllers, keypads and smart locks from the cloud instead of from a Windows
          PC in the office. Tenants, access levels and lockouts flow from your facility management
          software to the gate, with no office computer in the middle.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className={`rounded-full bg-accent-500 px-6 py-3 font-semibold text-text-950 hover:bg-accent-400 ${FOCUS_RING_LIGHT}`}
          >
            Request a quote
          </Link>
          <Link
            href="/demo"
            className={`rounded-full border border-text-700 px-6 py-3 font-semibold text-text-900 hover:bg-background-100 ${FOCUS_RING_LIGHT}`}
          >
            Request a demo
          </Link>
        </div>
      </section>

      {/* 2. The problem: Appendix A.4 only, paraphrased and cited. The spec
          3.2(2) wording about the office PC failed verification and must not
          be used; tests/content-policy.test.ts lists the banned phrases. */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">The problem: gate software on an office PC</h2>
        <p className="mt-4 text-text-800">
          In some gate setups, the link between the facility management software and the gate runs
          through a desktop computer. The vendors&apos; own documentation shows how much depends on
          that one machine.
        </p>
        <ul className="mt-6 space-y-4 text-text-800">
          <li>
            Storable Easy&apos;s DigiGate integration uses a gate sync program on the computer, set
            to run a program called digisend.exe after each download. Storable&apos;s guide says
            DigiGate should stay open for communication to work properly.{" "}
            <SourceLink source={SOURCES.storableEasyDigiGate} />
          </li>
          <li>
            Storable Easy&apos;s gate sync troubleshooting guide says the computer must stay turned
            on around the clock for the gate to sync correctly, with a Windows service checking for
            changes every five minutes. <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            The DigiGate installation manual has the owner supply the office PC, which runs the
            DigiGate software and programs the gate&apos;s system controller over a serial cable. It
            advises turning off the PC&apos;s standby and hibernation. Once programmed, the controller
            can run the gate without the PC switched on, but the PC is still how changes are
            programmed into it. <SourceLink source={SOURCES.digiGateManual} />
          </li>
        </ul>
        <p className="mt-8 text-text-800">
          That is a lot to hang on one desktop computer, and the ways it goes wrong are familiar:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          {pcRisks.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      {/* 3. How it works, ending with outage behaviour. It is a subsection so
          that no section opens with it, and it renders only OUTAGE_BEHAVIOR. */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <p className="mt-4 max-w-3xl text-text-800">
          The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to
          your controllers.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {flow.map((s, i) => (
            <li
              key={s.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <span className="text-sm font-semibold text-primary-700">Step {i + 1}</span>
              <h3 className="mt-1 text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-text-700">{s.desc}</p>
            </li>
          ))}
        </ol>
        <h3 className="mt-10 text-xl font-semibold">If a site loses its connection</h3>
        <p className="mt-3 max-w-3xl text-text-800">{OUTAGE_BEHAVIOR}</p>
      </section>

      {/* 4. Hardware */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Hardware we work with</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HARDWARE_INTEGRATIONS.map((h) => (
            <li
              key={h.name}
              className="rounded-2xl border border-background-200 bg-background-50 p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold">{h.name}</h3>
              <p className="mt-2 text-text-700">{h.desc}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-text-800">
          Tell us which models you run and we will confirm what connecting them involves.
        </p>
      </section>

      {/* 5. FMS bridges */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          From your facility management software to the gate
        </h2>
        <p className="mt-4 text-text-800">
          A bridge carries tenants, units, access levels and lockouts from your FMS to your access
          control. We can bridge Storable Edge and Storable Easy to OpenTech Alliance&apos;s
          INSOMNIAC® CIA and to DigiGate. Tell us your setup.{" "}
          <Link href="/about-us" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            More about our FMS bridges
          </Link>
          .
        </p>
        <ul className="mt-6 space-y-2 text-text-800">
          {FMS_BRIDGES.map(({ from, to }) => (
            <li key={`${from}-${to}`}>
              We can bridge {from} to {to}. Tell us your setup.
            </li>
          ))}
        </ul>
        <p className="mt-6 text-text-800">
          Running different software?{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Tell us which FMS you run
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          Which gate systems each Storable product lists as an integration, compared with the gate
          makers&apos; own lists:{" "}
          <Link
            href="/resources/self-storage-gate-compatibility"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            our gate compatibility matrix
          </Link>
          .
        </p>
      </section>

      {/* 6. Security: TLS only until spec 14 B is answered. */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Security</h2>
        <p className="mt-4 text-text-800">
          Served over TLS.{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Ask us for our current security posture
          </Link>
          .
        </p>
      </section>

      {/* 7. End-of-life hardware: Appendix A.3 only. No dates, because PTI
          publishes none. /support links here by its id. */}
      <section id="end-of-life" className="mx-auto max-w-4xl scroll-mt-24 px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Moving off end-of-life gate hardware</h2>
        <p className="mt-4 text-text-800">
          PTI Security Systems lists DigiGate, FalconXT, the StorLogix Cloud Adaptor and StorLogix
          Desktop among its legacy products, which it no longer sells or supports.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          CloudController is PTI&apos;s go-forward controller.{" "}
          <SourceLink source={SOURCES.ptiCloudManual} /> PTI provides training and a migration
          manual for moving FalconXT sites to it. <SourceLink source={SOURCES.ptiContinuousLearning} />{" "}
          <SourceLink source={SOURCES.ptiMigrationManual} />
        </p>
        <p className="mt-4 text-text-800">
          For FalconXT and DigiGate we have written up the options, each cited to its vendor:{" "}
          <Link
            href="/resources/falconxt-end-of-life"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            FalconXT end of life: your options
          </Link>{" "}
          and{" "}
          <Link
            href="/resources/digigate-replacement"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            DigiGate replacement options
          </Link>
          . More guides are in{" "}
          <Link href="/resources" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Resources
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          If you are weighing that move, tell us what is on site. We will say plainly what we can
          bridge, what we cannot, and what each path would involve for your facilities.
        </p>
        <p className="mt-4 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, OpenTech Alliance or Storable. Product
          names are the property of their owners.
        </p>
      </section>

      {/* 8. FAQ: accordion semantics only. Never FAQPage JSON-LD (spec 7.2). */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Frequently asked questions</h2>
        <div className="mt-8">
          <Faq items={faqs} />
        </div>
      </section>

      {/* 9. CTA */}
      <CtaBand
        heading="Get the gate software off the office PC"
        text="Tell us how many facilities you run and what is on site, and we will send a quote."
        primary={{ href: "/contact", label: "Request a quote" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
