import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { SOURCES } from "@/lib/sources";
import { VENDORS } from "@/lib/vendors";
import Breadcrumbs from "@/components/Breadcrumbs";
import CtaBand from "@/components/CtaBand";
import SourceLink from "@/components/SourceLink";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

// Spec D8: no vendor, product or company name in the title, the description
// or the h1. tests/vendors.test.ts enforces it.
export const metadata: Metadata = pageMeta({
  title: "Support & Diagnostics",
  description:
    "Diagnose gate and access-control sync problems, identify which system you're running, and find each vendor's support desk.",
  path: "/support",
});

const findTheName = [
  "The facility management software (FMS): the name on the program or website your office logs into every day for tenants and billing.",
  "The gate software: the name on the login screen or title bar of the program that manages gate codes. In some setups it runs on a PC in the office.",
  "The keypads and controller: the maker's name is usually printed on the keypad faceplate or on a label inside the controller cabinet.",
];

// Generic causes, true of most FMS-to-gate setups. The one vendor-specific
// fact carries its citation.
const diagnostics = [
  {
    symptom: "New gate codes are not reaching the keypad",
    causes: [
      "The computer that runs the gate sync is switched off, asleep, or restarting after an update.",
      "The sync program or service on that computer has stopped.",
      "The site's internet connection is down, so changes from a cloud-hosted FMS cannot reach it.",
      "The change was never saved in the FMS, so there was nothing new to send.",
    ],
    check:
      "Start with the computer. Is it on, awake and logged in, and is the gate software open? Then check that the sync program is running.",
    cite: true,
  },
  {
    symptom: "Lockouts are not being applied at the gate",
    causes: [
      "The same sync problem as above. If new codes are not arriving, lockouts are not arriving either.",
      "If your FMS applies lockouts automatically after a set number of days past due, that day may not have come yet.",
    ],
    check:
      "Confirm that new codes are arriving first. If they are and lockouts are not, check how your FMS is set to apply lockouts.",
    cite: false,
  },
  {
    symptom: "A tenant's code is not opening the gate",
    causes: [
      "The code was changed in the FMS and the change has not synced yet.",
      "The tenant is outside the access hours set for their account or for the gate.",
      "The tenant is locked out, on purpose or by mistake.",
      "The keypad has lost power or its connection to the controller.",
    ],
    check:
      "Look the tenant up in the FMS and in the gate software. If the two disagree, it is a sync problem, so go back to the first symptom.",
    cite: false,
  },
];

// The link text for each support desk. Four rows belong to Storable, so the
// company name would give four identical links to four places (WCAG 2.4.4).
const host = (url: string) => new URL(url).host.replace(/^www\./, "");

export default function SupportPage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ]}
      />

      <section className="mx-auto max-w-4xl px-4 pt-12 pb-10 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Support and diagnostics for self-storage gates</h1>
        <p className="mt-4 text-lg text-text-800">
          Start by working out which systems you run, then match your symptom below. If the fix
          belongs to your vendor, their support desk is listed at the end of the page.
        </p>
        <p className="mt-4 text-text-800">
          Already one of our customers?{" "}
          <Link href="/contact" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            Contact us
          </Link>{" "}
          and we will look into it directly.
        </p>
      </section>

      {/* 1. Identification. No vendor names in this heading (spec D8). */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Which system am I running?</h2>
        <p className="mt-4 text-text-800">
          You are looking for two names: the software the office uses for tenants and billing, and
          the access control that runs the gate and keypads. Each has a name you can find in a
          minute.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          {findTheName.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <p className="mt-4 text-text-800">Then find the maker in the vendor directory below.</p>
        <p className="mt-4 text-text-800">
          PTI Security Systems lists DigiGate, FalconXT, the StorLogix Cloud Adaptor and StorLogix
          Desktop among its legacy products, which it no longer sells or supports.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> If one of those is on site, read about{" "}
          <Link
            href="/solutions/access-control-hosting#end-of-life"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            moving off end-of-life gate systems
          </Link>
          , or go straight to our guides:{" "}
          <Link href="/resources/falconxt-end-of-life" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            FalconXT end of life: your options
          </Link>{" "}
          and{" "}
          <Link href="/resources/digigate-replacement" className={`font-semibold underline ${FOCUS_RING_LIGHT}`}>
            DigiGate replacement options
          </Link>
          .
        </p>
      </section>

      {/* 2. Diagnostics */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Symptoms and likely causes</h2>
        {diagnostics.map((d) => (
          <div key={d.symptom} className="mt-8">
            <h3 className="text-xl font-semibold">{d.symptom}</h3>
            <p className="mt-3 font-medium text-text-900">Likely causes</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-text-800">
              {d.causes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="mt-3 text-text-800">
              <span className="font-medium text-text-900">Check first: </span>
              {d.check}
            </p>
            {d.cite && (
              <p className="mt-3 text-text-800">
                If you run Storable Easy, Storable&apos;s troubleshooting guide says the computer must
                stay on around the clock for the gate to sync, and names the Windows service to look
                for. <SourceLink source={SOURCES.storableEasyGateSync} />
              </p>
            )}
          </div>
        ))}
        <p className="mt-10 text-text-800">
          For step-by-step checks drawn from each vendor&apos;s own troubleshooting documents, read{" "}
          <Link
            href="/resources/gate-not-syncing"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            why your gate isn&apos;t syncing with your storage software
          </Link>
          .
        </p>
        <p className="mt-4 text-text-800">
          If the sync computer keeps turning out to be the problem, it can be taken out of the
          chain.{" "}
          <Link
            href="/solutions/access-control-hosting"
            className={`font-semibold underline ${FOCUS_RING_LIGHT}`}
          >
            See how cloud-hosted access control works
          </Link>
          .
        </p>
      </section>

      {/* 3. Vendor directory: Appendix A.2 links only, no phone numbers. */}
      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Vendor support directory</h2>
        <p className="mt-4 text-text-800">The links below go to each vendor&apos;s own support pages.</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Support desks for self-storage software and gate systems</caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Product
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Made by
                </th>
                <th scope="col" className="py-3 font-semibold">
                  Support
                </th>
              </tr>
            </thead>
            <tbody>
              {VENDORS.map((v) => (
                <tr key={v.url} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {v.products}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{v.company}</td>
                  <td className="py-3">
                    <a
                      href={v.url}
                      className={`font-medium text-primary-700 underline ${FOCUS_RING_LIGHT}`}
                    >
                      {host(v.url)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-text-700">
          We are not affiliated with any company listed here and cannot act on their behalf. Product
          names are the property of their owners.
        </p>
      </section>

      <CtaBand
        heading="Take the office PC out of the gate sync"
        text="Cloud-hosted access control runs the sync from the cloud instead of from a computer at the site."
        primary={{ href: "/solutions/access-control-hosting", label: "See access control hosting" }}
        secondary={{ href: "/contact", label: "Talk to us" }}
      />
    </>
  );
}
