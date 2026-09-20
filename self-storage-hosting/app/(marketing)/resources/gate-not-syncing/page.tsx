import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { article, articlePath } from "@/lib/articles";
import { SOURCES } from "@/lib/sources";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import ArticleDates from "@/components/ArticleDates";
import SourceLink from "@/components/SourceLink";
import SourceList from "@/components/SourceList";
import CtaBand from "@/components/CtaBand";
import { FOCUS_RING_LIGHT } from "@/components/ui/focus";

const A = article("gate-not-syncing");

export const metadata: Metadata = pageMeta({
  title: "Gate Not Syncing With Storage Software",
  description:
    "Find out why gate codes stop matching your storage software, step by step, using the vendors' own troubleshooting documents.",
  path: "/resources/gate-not-syncing",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

type SymptomRow = {
  symptom: string;
  link: string;
  check: string;
  /** Whose document gives the check. The body cites each one. */
  owner: string;
};

// The "most likely link" is our reading of the vendors' documents, not their
// words. Every check here is cited where the body states it.
const SYMPTOMS: SymptomRow[] = [
  {
    symptom: "No new codes reach the gate, but old codes work",
    link: "The sync program, or its computer",
    check: "Computer on and awake, sync program running, and its log",
    owner: "Storable (Storable Easy and Storable Edge help)",
  },
  {
    symptom: "New codes reach the gate software but fail at the keypad",
    link: "Gate software to controller, or controller to keypad",
    check: "Gate software result files and any keypad message",
    owner: "Storable (Storable Easy's DoorKing guide); PTI",
  },
  {
    symptom: "One new tenant's code fails while others work",
    link: "That tenant's record",
    check: "Unit set up in the gate software; unit numbers and names match",
    owner: "Storable (Storable Edge help)",
  },
  {
    symptom: "Tenants who are behind on rent still get in",
    link: "The lockout rule in the FMS, or the sync",
    check: "The lockout stage or event, any never-lock or exempt flag, then a gate refresh",
    owner: "Storable (Sitelink and Storable Edge help)",
  },
  {
    symptom: "A PTI keypad on a FalconXT shows ACCESS SUSPENDED for a tenant who has paid",
    link: "The FMS and StorLogix disagree",
    check: "Unsuspend the tenant in both systems, and confirm the paid status reaches the FalconXT",
    owner: "PTI",
  },
  {
    symptom: "A PTI keypad on a FalconXT shows Please Wait, then the date and time",
    link: "Keypad to controller",
    check: "Baud rate, keypad address and wiring",
    owner: "PTI",
  },
  {
    symptom: "Code changes stopped when the internet went down",
    link: "The site's internet connection",
    check: "The router's internet access, then the gateway or node status",
    owner: "OpenTech Alliance; Storable",
  },
  {
    symptom: "A code works at some hours but not others",
    link: "Time zone or access level settings",
    check: "Time zone number in the FMS and the gate system",
    owner: "PTI",
  },
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Gate Not Syncing With Storage Software", path: "/resources/gate-not-syncing" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          Gate codes stop matching your storage software when one link in a chain breaks. Each
          change travels from your facility management software (FMS), through a sync program or
          bridge, into the gate system, and out to the keypad. Find the broken link and you have
          found the fault.
        </p>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>The FMS,</strong> such as Storable Edge, Storable Easy or Sitelink by Storable,
            where you create tenants, codes and lockout rules.
          </li>
          <li>
            <strong>The sync program or bridge.</strong> It may be a program on a computer, such as
            Storable Easy&apos;s gate sync program, or a direct cloud-to-cloud connection. PTI
            Security Systems&apos; StorLogix Cloud manual names two ways to connect an FMS: a
            cloud-to-cloud API integration or the BridgeApp. <SourceLink source={SOURCES.ptiCloudManual} />
          </li>
          <li>
            <strong>The gate system</strong> that holds the codes, such as StorLogix Cloud,
            DoorKing&apos;s software, OpenTech Alliance&apos;s INSOMNIAC® CIA or Janus
            International&apos;s Nokē Smart Entry.
          </li>
          <li>
            <strong>The keypad,</strong> and its wiring back to the controller.
          </li>
        </ol>

        <p className="mt-4 text-text-800">
          The vendors&apos; own documents name these causes. Storable Easy says its gate sync program
          may have stopped running, often after a Windows update or because a firewall blocks it,
          and that the computer must stay on and must not sleep.{" "}
          <SourceLink source={SOURCES.storableEasyGateSync} /> Storable Edge&apos;s gate program runs
          on a Windows computer; its help adds antivirus software blocking the program, and unit
          numbers or tenant names that differ between Storable Edge and the gate software.{" "}
          <SourceLink source={SOURCES.storableEdgeGateIntegration} />{" "}
          Sometimes nothing is broken: a setting, such as Sitelink&apos;s option to withhold codes
          from online move-ins, is doing its job. <SourceLink source={SOURCES.sitelinkWithholdCodes} />
        </p>
        <p className="mt-4 text-text-800">
          If you already know which vendor owns the fault, our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>{" "}
          lists each vendor&apos;s support desk.
        </p>
        <p className="mt-4 text-text-800">
          Our guide to{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            whether you still need a Windows PC in the office
          </Link>{" "}
          looks at which setups depend on one. If that computer keeps failing, one option is our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud-hosted access control
          </Link>
          . The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to
          your controllers.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Which link is broken? Five quick questions</h2>
        <p className="mt-4 text-text-800">
          This is general reasoning, not a vendor procedure.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>One tenant or everyone?</strong> If one new code fails while others added that
            day work, the chain is running: check that tenant&apos;s record. If nothing has arrived
            since a certain day, a link has stopped.
          </li>
          <li>
            <strong>Does a brand-new code work?</strong> Make a test change, wait for the interval
            your vendor gives, and try it at the keypad.
          </li>
          <li>
            <strong>Do old codes still work?</strong> If old codes work and new ones do not, look
            upstream at the sync. If nothing works, look at the controller, keypad, power and wiring.
          </li>
          <li>
            <strong>Did the change reach the gate software?</strong> If not, suspect the FMS or the
            sync link. If it did but the keypad refuses it, suspect the gate software, controller or
            keypad.
          </li>
          <li>
            <strong>What changed recently?</strong> A Windows update, new computer, new antivirus,
            power cut or new router each points at a different link.
          </li>
        </ul>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Matching a symptom to a link is our reading, not the vendors&apos; words. Each check is
              cited below.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Symptom
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Most likely broken link
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Check first
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Whose document
                </th>
              </tr>
            </thead>
            <tbody>
              {SYMPTOMS.map((r) => (
                <tr key={r.symptom} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.symptom}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{r.link}</td>
                  <td className="py-3 pr-4 text-text-800">{r.check}</td>
                  <td className="py-3 pr-4 text-text-800">{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">Checks by facility software</h2>
        <p className="mt-4 text-text-800">
          Each step comes from that vendor&apos;s own help pages. The order is ours.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Easy</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Read the log.</strong> Under the Setup tab, select Gate. A red X, or a
            &quot;Checked for change&quot; line that does not appear every 5 minutes, means the sync
            has stopped. <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            <strong>Restart the service.</strong> In the Windows Services list, find the gate sync
            program&apos;s service, right-click it and choose Restart, or Start if it is stopped. The
            guide also shows how to set it to restart after a failure.{" "}
            <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            <strong>Keep the computer on 24/7.</strong> A screensaver is fine. Sleep and hibernate
            are not. <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
        </ol>
        <p className="mt-4 text-text-800">Then check what your gate system needs:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>DoorKing.</strong> Keep the DoorKing program closed after setup, or the run.bat
            file will not run. An IMPPASS file means Storable Easy&apos;s side is working. After an
            IMPFAIL, search DoorKing&apos;s events.log for &quot;invalid&quot;. A SNDFAIL file points
            to a problem between the computer running DoorKing&apos;s software and the gate
            controller. Changing the DoorKing account name after setup stops new codes working.{" "}
            <SourceLink source={SOURCES.storableEasyDoorKing} /> Storable Easy&apos;s DigiGate
            guide, by contrast, says DigiGate should stay open.{" "}
            <SourceLink source={SOURCES.storableEasyDigiGate} />
          </li>
          <li>
            <strong>PTI StorLogix.</strong> An ERR7.log file in the PTI folder can mean a unit number
            contains a space, which StorLogix does not allow (G 15 must be G15). After an update, the
            PTI.dat file should have become a RESULT.dat file.{" "}
            <SourceLink source={SOURCES.storableEasyStorLogix} />
          </li>
          <li>
            <strong>Nokē Smart Entry.</strong> If units are added or edited after the initial
            integration, Storable Easy asks you to contact its support and request that an updated
            unit file be sent to Nokē. <SourceLink source={SOURCES.storableEasyNoke} />
          </li>
          <li>
            <strong>A cloud node.</strong> If you see &quot;There was a problem communicating with
            your cloud node&quot; when changing a gate code or in the gate log, Storable Easy&apos;s help
            says the node has lost its internet connection, usually because of a problem with its
            router connection or because the internet is offline.{" "}
            <SourceLink source={SOURCES.storableEasyCloudNode} />
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">Storable Edge</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Keep both programs running.</strong> With DigiGate, DoorKing, PTI and five other
            gate programs Storable lists, Storable Edge&apos;s gate program must be installed on the
            same computer as the gate software. Storable says to keep both running at all times;
            Storable Edge sends gate code changes to the gate software every 5 minutes.{" "}
            <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            <strong>Restart, then force a full update.</strong> Log in to the gate software&apos;s
            computer as an administrator. Go to File,
            click Stop Service, then Start Service. Open the Storable Edge gate program from your
            desktop, go to Gate Codes and click Force Full Update.{" "}
            <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            <strong>Check what blocks or rejects changes.</strong> Make sure antivirus is not
            blocking the gate program, and that every unit exists in the gate software, since
            Storable Edge updates units but does not create them. Then find the gate provider file
            path listed in your Gate Integration setup, follow it on your computer and look for an
            error file. Storable says the common errors are mismatched unit numbers or tenant
            names.{" "}
            <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            <strong>Check the lockout rules.</strong> The Gate Lockout action in the delinquency
            stages disables gate codes automatically and requires a gate integration.{" "}
            <SourceLink source={SOURCES.storableEdgeDelinquency} /> The Gate Access report shows
            whether a tenant&apos;s code is disabled now (Locked Out) and whether the tenant is
            excluded from the general lockout rule (Locked Out Exempt).{" "}
            <SourceLink source={SOURCES.storableEdgeGateReport} />
          </li>
        </ol>

        <h3 className="mt-8 text-xl font-semibold">Sitelink</h3>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Refresh the gate.</strong> With a third-party gate, not Storable Access,
            Sitelink&apos;s help says that if tenants who should be locked out get in, or new tenants
            cannot, the gate most likely needs refreshing. Go to Setup, then Gate Setup, and under
            Update Gate click All Tenants.{" "}
            <SourceLink source={SOURCES.sitelinkGateNotUpdating} />
          </li>
          <li>
            <strong>Check the lockout timing.</strong> Gate lockout is tied to a past-due event. If
            you set a prerequisite event, such as an overlock, the tenant is not locked out until the
            set number of days has passed after that event is processed.{" "}
            <SourceLink source={SOURCES.sitelinkLockoutPrereq} />
          </li>
          <li>
            <strong>Check the report.</strong> The Gate Access report puts an X in its Never Lock
            column for any tenant who should never be locked out.{" "}
            <SourceLink source={SOURCES.sitelinkGateReport} />
          </li>
          <li>
            <strong>Check online move-ins.</strong> If gate codes are withheld for online move-ins,
            those tenants must contact the office for their code.{" "}
            <SourceLink source={SOURCES.sitelinkWithholdCodes} />
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold">Checks by gate system</h2>

        <h3 className="mt-8 text-xl font-semibold">PTI StorLogix Cloud</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>The BridgeApp computer.</strong> PTI says the BridgeApp should be installed on
            the PC or server that also holds your FMS client, which does not have to be at the site,
            though it usually is. Its service continues to run in the background after you exit the
            app. <SourceLink source={SOURCES.ptiCloudManual} />
          </li>
          <li>
            <strong>A full gate update, then a test.</strong> Once all users and units are in the
            FMS, PTI says to run a full Gate Update to StorLogix Cloud. In Single Site mode, the
            Access Tester lets a site manager test a new tenant&apos;s code remotely at a chosen entry
            or exit device. <SourceLink source={SOURCES.ptiCloudManual} />
          </li>
          <li>
            <strong>The Interface Time Zone.</strong> This number, set in the FMS for a set of hours,
            carries over to StorLogix Cloud as the user&apos;s Access Level.{" "}
            <SourceLink source={SOURCES.ptiCloudManual} /> If a code works at some hours and not
            others, compare it in both systems.
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">PTI keypad messages</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page lists FalconXT and the StorLogix Cloud Adaptor as legacy products it
          no longer sells or supports. <SourceLink source={SOURCES.ptiFacts} /> If you run a
          FalconXT, see our{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end-of-life guide
          </Link>
          . PTI&apos;s keypad-message guide, written around the FalconXT, explains:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>ACCESS SUSPENDED</strong> generally means the user was locked out for unpaid
            rent. Unsuspend them in both your FMS and StorLogix. If your software shows the account
            paid, ask that software&apos;s technical support to confirm the information is reaching
            the FalconXT. <SourceLink source={SOURCES.ptiKeypadMessages} />
          </li>
          <li>
            <strong>ACCESS DENIED:</strong> compare the incorrect code, which the FalconXT prints in
            its event log, with the unit&apos;s code in StorLogix. For AREA CLOSED, check
            the user&apos;s permitted time zones in StorLogix.{" "}
            <SourceLink source={SOURCES.ptiKeypadMessages} />
          </li>
          <li>
            <strong>Please Wait, then the date and time:</strong> the keypad is not communicating
            with the FalconXT. Check the baud rate, that the keypad&apos;s address is correct and not
            duplicated, the wiring and RS485 line, and the terminal blocks.{" "}
            <SourceLink source={SOURCES.ptiKeypadMessages} />
          </li>
        </ul>

        <h3 className="mt-8 text-xl font-semibold">StorLogix Cloud Adaptor</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s installation guide for this legacy unit says the LEDs are the most useful
          troubleshooting aid: three solid LEDs about 55 seconds after power-up means all is well.
          If LED2, the cloud connection, is out, check that the Ethernet cable goes to a router
          with internet access, try a different router, and check that the office network can reach
          PTI&apos;s cloud servers. <SourceLink source={SOURCES.ptiCloudAdapterGuide} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">OpenTech Alliance&apos;s INSOMNIAC CIA</h3>
        <p className="mt-4 text-text-800">
          OpenTech&apos;s G-600 Gateway guide lists installation checks that include the router
          having internet access and the Gateway reporting Online in the Control Center. It also
          says that if the site loses its internet connection, access codes and configuration
          cannot be updated until the connection is back, though the Gateway continues to operate
          using cached data. <SourceLink source={SOURCES.opentechG600Guide} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">DoorKing</h3>
        <p className="mt-4 text-text-800">
          DoorKing&apos;s self-storage page describes its Remote Account Manager as a Windows
          application that runs on a host PC.{" "}
          <SourceLink source={SOURCES.doorkingSelfStorage} /> Its manual for version 6.2 (later
          versions may differ) says import errors are detailed in the summary or events.log file,
          and that account names must match the account names in the import file, capital letters
          included. <SourceLink source={SOURCES.doorkingRamManual} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">Janus International&apos;s Nokē Smart Entry</h3>
        <p className="mt-4 text-text-800">
          If the rental has not been processed in the FMS, Janus says the tenant&apos;s details will
          not sync to the Nokē Web Portal and the activation text will not be sent. Once it is
          processed, the update can take 1 to 5 minutes to appear; you can click Update Customer
          Data or the Refresh icon. <SourceLink source={SOURCES.janusAppTroubleshooting} /> If delinquent or moved-out
          tenants still get in, Janus&apos;s training manual describes a Use Blacklist setting that
          blocks their access, and recommends it at facilities that use fobs.{" "}
          <SourceLink source={SOURCES.janusNokeTraining} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">When to take it to your vendor</h2>
        <p className="mt-4 text-text-800">
          Go to your vendor once you know which link failed and have tried its steps.
          Storable Easy says problems with its software and its gate sync program are within its
          support line&apos;s scope, while problems with the gate software and the gate itself will
          probably need your gate software company.{" "}
          <SourceLink source={SOURCES.storableEasyCommonProblems} /> Before you get in
          touch, note when the last change went through, which test code you tried, and any error
          files or keypad messages. Our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>{" "}
          lists each vendor&apos;s support desk.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">If the sync computer keeps being the cause</h2>
        <p className="mt-4 text-text-800">
          If a computer that must stay on keeps failing, you have four broad options, each with its
          own requirements.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Stay put and look after the computer.</strong> Keep it awake, set its service to
            restart after a failure where your vendor documents how, and keep antivirus from
            blocking the gate program.
          </li>
          <li>
            <strong>Use a direct cloud connection where your systems offer one.</strong> PTI&apos;s
            manual names a cloud-to-cloud API integration for StorLogix Cloud.{" "}
            <SourceLink source={SOURCES.ptiCloudManual} /> Our{" "}
            <Link href="/resources/self-storage-gate-compatibility" className={link}>
              compatibility matrix
            </Link>{" "}
            compares the vendors&apos; own integration lists.
          </li>
          <li>
            <strong>Use your FMS vendor&apos;s own access control, if it has one.</strong> Storable
            has its own product, Storable Access Control. <SourceLink source={SOURCES.storableAccessControlFaq} />
          </li>
          <li>
            <strong>Move the computer&apos;s job to the cloud.</strong> This is our service. The
            office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to your
            controllers. We can bridge Storable Edge and Storable Easy to OpenTech Alliance&apos;s
            INSOMNIAC CIA and to DigiGate. Tell us your setup. Read{" "}
            <Link href="/solutions/access-control-hosting" className={link}>
              how cloud-hosted access control works
            </Link>
            .
          </li>
        </ul>

        <SourceList
          sources={[
            SOURCES.ptiCloudManual,
            SOURCES.storableEasyGateSync,
            SOURCES.storableEdgeGateIntegration,
            SOURCES.sitelinkWithholdCodes,
            SOURCES.storableEasyDoorKing,
            SOURCES.storableEasyDigiGate,
            SOURCES.storableEasyStorLogix,
            SOURCES.storableEasyNoke,
            SOURCES.storableEasyCloudNode,
            SOURCES.storableEdgeDelinquency,
            SOURCES.storableEdgeGateReport,
            SOURCES.sitelinkGateNotUpdating,
            SOURCES.sitelinkLockoutPrereq,
            SOURCES.sitelinkGateReport,
            SOURCES.ptiFacts,
            SOURCES.ptiKeypadMessages,
            SOURCES.ptiCloudAdapterGuide,
            SOURCES.opentechG600Guide,
            SOURCES.doorkingSelfStorage,
            SOURCES.doorkingRamManual,
            SOURCES.janusAppTroubleshooting,
            SOURCES.janusNokeTraining,
            SOURCES.storableEasyCommonProblems,
            SOURCES.storableAccessControlFaq,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with Storable, PTI Security Systems, OpenTech Alliance, DoorKing,
          Janus International or Microsoft. Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Talk to us about your gate sync"
        text="Tell us which facility software and gate system you run."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
