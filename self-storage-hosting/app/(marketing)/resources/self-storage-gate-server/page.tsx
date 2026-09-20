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

const A = article("self-storage-gate-server");

export const metadata: Metadata = pageMeta({
  title: "Do You Still Need a Gate Server?",
  description:
    "Some gate setups still depend on a Windows PC at the facility. Which ones do, which do not, and what Windows 10 end of support means for yours.",
  path: "/resources/self-storage-gate-server",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

type SourceEntry = (typeof SOURCES)[keyof typeof SOURCES];

type ComputerRow = {
  key: string;
  system: string;
  says: string;
  sources: readonly SourceEntry[];
};

// Each row states only what that vendor's own document says, from the
// verified a5-* research claims. The "cia" row is the page's first mention of
// OpenTech Alliance's product, so it carries the ® and later mentions do not.
const COMPUTER_ROWS: readonly ComputerRow[] = [
  {
    key: "easy-sync",
    system: "Storable Easy gate sync program",
    says: "The computer must stay on 24/7 for the gate to sync. If the \"Checked for change\" message in Storable Easy does not appear every 5 minutes, the sync has stopped. The troubleshooting steps restart the program's service in the Windows Services app.",
    sources: [SOURCES.storableEasyGateSync],
  },
  {
    key: "easy-digigate",
    system: "Storable Easy with DigiGate",
    says: "The gate sync program's Post Download Action is set to digisend.exe, and DigiGate should stay open for communication to work properly.",
    sources: [SOURCES.storableEasyDigiGate],
  },
  {
    key: "edge",
    system: "Storable Edge gate program",
    says: "Must be installed on the same computer as the DigiGate, DoorKing, PTI, QuikStor, Revenue Control Systems, StorGuard, SpiderDoor or WinSen gate software. Storable Edge sends gate code changes to the gate software every 5 minutes; keep both programs running at all times.",
    sources: [SOURCES.storableEdgeGateIntegration],
  },
  {
    key: "digigate",
    system: "DigiGate (DigiGate-700 manual)",
    says: "The office PC runs the DigiGate software and programs the system controller, which can then run the system with the PC off.",
    sources: [SOURCES.digiGateManual],
  },
  {
    key: "storlogix-desktop",
    system: "PTI StorLogix Desktop",
    says: "The requirements only cover a computer dedicated to PTI software: Windows 10 or higher, with a working FalconXT connected by USB or Ethernet.",
    sources: [SOURCES.ptiDesktopRequirements],
  },
  {
    key: "storlogix-cloud",
    system: "PTI StorLogix Cloud",
    says: "StorLogix Desktop no longer has to be installed first; a site can be set up directly in the cloud. If your FMS is not yet integrated with PTI's API, the BridgeApp is required, on the PC or server that also holds your FMS client. If your FMS has a cloud integration with StorLogix Cloud, the BridgeApp is unnecessary.",
    sources: [SOURCES.ptiCloudManual],
  },
  {
    key: "cloudcontroller",
    system: "PTI CloudController",
    says: "PTI describes it as cloud-native, linking the site's access control hardware straight to StorLogix Cloud with no separate adaptor. PTI lists the StorLogix Cloud Adaptor as a legacy product.",
    sources: [SOURCES.ptiFacts],
  },
  {
    key: "cia",
    system: "OpenTech Alliance INSOMNIAC® CIA",
    says: "The software is stored in the cloud. The 2018 K-500 keypad manual describes a controller that communicates with a central database over the internet.",
    sources: [SOURCES.opentechCia, SOURCES.opentechK500Manual],
  },
  {
    key: "sitelink-cia",
    system: "Sitelink by Storable with INSOMNIAC CIA (2018)",
    says: "Sitelink said the pairing ends reliance on gate software running on a local PC, and that cloud access systems can operate without PCs at the store through the Sitelink API.",
    sources: [SOURCES.sitelinkCiaNews],
  },
  {
    key: "doorking-ram",
    system: "DoorKing Remote Account Manager",
    says: "Windows-based software that runs on a host personal computer.",
    sources: [SOURCES.doorkingSelfStorage],
  },
  {
    key: "doorking-wam",
    system: "DoorKing Windows Account Manager",
    says: "Designed to be installed on one PC.",
    sources: [SOURCES.doorkingWindowsAccountManager],
  },
  {
    key: "doorking-cloud",
    system: "DoorKing Cloud Account Manager",
    says: "A web browser-based tool for programming 1830 Series entry systems from any internet-connected device. DoorKing's cloud software requires the 1830-186 TCP/IP adapter, and DoorKing lists Cubby as the only self-storage software compatible with it.",
    sources: [SOURCES.doorkingCloudAccountManager, SOURCES.doorkingSelfStorage],
  },
  {
    key: "janus-smart-entry",
    system: "Janus International Nokē Smart Entry",
    says: "Wireless and cloud-based: tenants enter with a smartphone, and owners use a web portal. Each mesh hub location needs 110V power and internet access over Cat 6 wire.",
    sources: [SOURCES.janusNoke1],
  },
  {
    key: "sitelink-hardware",
    system: "Sitelink Web Edition",
    says: "A computer is required to use Sitelink Web Edition: Windows 11 or newer, with Windows 7, 8, 8.1 and 10 no longer supported. This is the computer you run Sitelink on, not a gate computer.",
    sources: [SOURCES.sitelinkRecommendedHardware],
  },
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Do You Still Need a Gate Server?", path: "/resources/self-storage-gate-server" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          It depends on your gate system and your facility management software (FMS). Some setups, as
          their own vendors document them, still depend on a Windows computer that stays on around the
          clock. <SourceLink source={SOURCES.storableEasyGateSync} /> For some cloud systems, the
          documents name no such computer for day-to-day management.{" "}
          <SourceLink source={SOURCES.opentechCia} />{" "}
          <SourceLink source={SOURCES.doorkingCloudAccountManager} />{" "}
          <SourceLink source={SOURCES.janusNoke1} />
        </p>
        <p className="mt-4 text-text-800">
          Here, a gate server means the computer that runs your gate software, or the one that runs the
          sync between your FMS and the gate. Despite the name, the documents below mostly call it a PC
          or simply your computer.
        </p>
        <p className="mt-4 text-text-800">
          Windows matters too: Microsoft ended support for Windows 10 on October 14, 2025.{" "}
          <SourceLink source={SOURCES.microsoftWindowsEos} /> The Windows section below covers what
          that means for a gate computer.
        </p>
        <p className="mt-4 text-text-800">
          One option, and the one we sell, is hosting: the office PC&apos;s job moves to the cloud, and
          a small bridge stays at the site to talk to your controllers. You can read how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud access control hosting
          </Link>{" "}
          works. This guide covers the other options too.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What a gate server actually does</h2>
        <p className="mt-4 text-text-800">A gate computer can do two separate jobs.</p>

        <h3 className="mt-8 text-xl font-semibold">Job one: running the gate maker&apos;s software</h3>
        <p className="mt-4 text-text-800">
          The DigiGate-700 installation manual, which PTI Security Systems keeps in its document
          archive, is a clear example. It says the office PC runs the DigiGate software and is used to
          program the system controller. The PC connects to the controller by an RS-232 cable up to 50
          feet long, and receives the controller&apos;s activity log when it runs the DigiGate
          program. <SourceLink source={SOURCES.digiGateManual} /> The manual asks for the PC&apos;s
          hibernation and standby features to be turned off, and it is plain about the gate itself:
          &quot;Once programmed, the system controller can run the system without the PC being
          on.&quot; <SourceLink source={SOURCES.digiGateManual} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">Job two: syncing your FMS with the gate</h3>
        <p className="mt-4 text-text-800">
          Storable Easy describes the chain. A change you make in Storable Easy goes to the gate sync
          program on your computer, which connects Storable Easy to your gate program, and the gate
          software sends it on to the gate. <SourceLink source={SOURCES.storableEasyCommonProblems} />{" "}
          Storable&apos;s troubleshooting page is direct: &quot;Your computer must stay turned on 24/7
          for the gate to sync correctly.&quot; <SourceLink source={SOURCES.storableEasyGateSync} /> A
          screensaver is fine, and so is logging off, but the computer should not sleep or hibernate.{" "}
          <SourceLink source={SOURCES.storableEasyGateSync} />{" "}
          <SourceLink source={SOURCES.storableEasyCommonProblems} />
        </p>
        <p className="mt-4 text-text-800">
          So the two jobs can differ when the computer is off: the DigiGate manual describes the gate
          itself, while Storable describes changes reaching it. A gate that still opens does not prove
          the computer is optional. If codes have stopped matching, our guide to{" "}
          <Link href="/resources/gate-not-syncing" className={link}>
            a gate that is not syncing
          </Link>{" "}
          walks through the checks.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          What each vendor&apos;s documents say about a computer
        </h2>
        <p className="mt-4 text-text-800">
          Each row reports what the vendor&apos;s own document says, including where it describes
          something other than a computer. A product missing from a list is not proof that it is
          incompatible; that document simply does not list it.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              What each vendor&apos;s own document says about a computer
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  System or integration
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  What its vendor&apos;s document says
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPUTER_ROWS.map((row) => (
                <tr key={row.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {row.system}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{row.says}</td>
                  <td className="py-3 pr-4 text-text-800">
                    {row.sources.map((s, i) => (
                      <span key={s.url}>
                        {i > 0 && "; "}
                        <SourceLink source={s} />
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Storable Easy and Storable Edge</h3>
        <p className="mt-4 text-text-800">
          Storable&apos;s help pages refer to your computer without saying where it has to be.
          Storable Edge&apos;s gate integration page lists INSOMNIAC CIA and Storable Access Control
          among its integrations, but its same-computer sentence does not name those two, and the page
          does not say whether they need the gate program. <SourceLink source={SOURCES.storableEdgeGateIntegration} /> Our{" "}
          <Link href="/resources/self-storage-gate-compatibility" className={link}>
            self-storage gate compatibility matrix
          </Link>{" "}
          compares which gate systems each Storable product lists.
        </p>

        <h3 className="mt-8 text-xl font-semibold">
          PTI: StorLogix Desktop, StorLogix Cloud and the BridgeApp
        </h3>
        <p className="mt-4 text-text-800">
          StorLogix Desktop&apos;s installation guide has you choose whether the computer is the
          StorLogix server or a workstation. <SourceLink source={SOURCES.ptiDesktopInstallGuide} />{" "}
          PTI&apos;s facts page lists StorLogix Desktop, FalconXT, the StorLogix Cloud Adaptor and
          DigiGate as legacy products it no longer sells or supports, and gives no dates for them.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          StorLogix Cloud does not remove the computer in every case. PTI&apos;s StorLogix Cloud manual
          says the BridgeApp is required if your FMS is not yet integrated with PTI&apos;s API, and describes it
          as a service that processes FMS flat files and keeps running in the background. PTI says to
          install it on the PC or server that also holds your FMS client, which does not have to be at
          the site, though it usually is. <SourceLink source={SOURCES.ptiCloudManual} /> PTI&apos;s
          facts page marks Sitelink, Storable Edge and Storable Easy as connecting through the BridgeApp
          rather than the API, with a separate Storable Edge webhooks row marked for the API.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> Our guides to{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end of life
          </Link>{" "}
          and{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            replacing DigiGate
          </Link>{" "}
          go further.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Cloud systems: INSOMNIAC CIA, DoorKing and Nokē</h3>
        <p className="mt-4 text-text-800">
          In the documents cited here, the CIA controller reaches its database over the internet,
          DoorKing&apos;s Cloud Account Manager runs in a web browser, and each Nokē mesh hub location
          needs internet access. None of these documents names a computer that has to stay on for
          day-to-day management.
        </p>
        <p className="mt-4 text-text-800">
          DoorKing documents both kinds. Its cloud page says previous programming methods required a
          dedicated PC. <SourceLink source={SOURCES.doorkingCloudAccountManager} /> Version 6.5 B of its
          Windows Account Manager can transfer the user database to the Cloud Account Manager.{" "}
          <SourceLink source={SOURCES.doorkingWindowsAccountManager} /> Check your FMS first:
          DoorKing&apos;s self-storage page lists Sitelink, Storable Edge and Storable Easy for its
          Remote Account Manager, but only Cubby for its cloud software.{" "}
          <SourceLink source={SOURCES.doorkingSelfStorage} />
        </p>
        <p className="mt-4 text-text-800">
          OpenTech Alliance&apos;s 2018 K-500 manual for CIA also says that if the internet connection
          is lost, the controller runs on its own from cached data, but no code or configuration
          changes are possible until the connection returns.{" "}
          <SourceLink source={SOURCES.opentechK500Manual} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Windows 10 end of support and your gate computer</h2>
        <p className="mt-4 text-text-800">
          Microsoft says Windows 10 reached end of support on October 14, 2025, and that it no longer
          provides software updates, security fixes or technical assistance for Windows 10 PCs.{" "}
          <SourceLink source={SOURCES.microsoftWindowsEos} /> Microsoft&apos;s consumer Extended
          Security Updates (ESU) program keeps enrolled Windows 10 devices on critical and important
          security updates through October 12, 2027, and Microsoft points commercial customers to a
          separate program, whose terms this guide does not cover.{" "}
          <SourceLink source={SOURCES.microsoftWindowsEos} />
        </p>
        <p className="mt-4 text-text-800">Now set that beside the Windows versions these documents name:</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            Storable Edge&apos;s gate integration requirements list Windows Vista, 7, 8 or 10, and do
            not mention Windows 11. <SourceLink source={SOURCES.storableEdgeGateIntegration} />
          </li>
          <li>
            DoorKing&apos;s Windows Account Manager page lists Windows 7, 8 and 10, and does not mention
            Windows 11. <SourceLink source={SOURCES.doorkingWindowsAccountManager} />
          </li>
          <li>
            Storable Easy recommends a computer running Windows 7 or later.{" "}
            <SourceLink source={SOURCES.storableEasyCommonProblems} />
          </li>
          <li>
            PTI&apos;s StorLogix Desktop requirements list Windows 10 or higher.{" "}
            <SourceLink source={SOURCES.ptiDesktopRequirements} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          A page that does not mention Windows 11 is not saying the software fails on it, so ask the
          vendor before you upgrade or replace the computer.
        </p>
        <p className="mt-4 text-text-800">
          For a gate computer still on Windows 10, Microsoft&apos;s statement applies as it does to any
          Windows 10 PC: unless the computer is enrolled in ESU, Microsoft no longer provides it with
          security fixes. The choices for the computer itself are to enroll it in an ESU program that
          applies to it, to move the gate software to a newer Windows version your vendors confirm they
          support, or to move to a setup that does not need the computer.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How to check your own site</h2>
        <p className="mt-4 text-text-800">Answer these for each facility before you change anything.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            <strong>Is there a computer that has to stay on?</strong> Look for one that is never
            switched off, with sleep turned off and gate software open. In Storable Easy, open the Setup
            tab and select Gate: if you see a red X, or the &quot;Checked for change&quot; message does
            not appear every 5 minutes, Storable says the sync has stopped.{" "}
            <SourceLink source={SOURCES.storableEasyGateSync} />
          </li>
          <li>
            <strong>What runs on it?</strong> List each program: the gate maker&apos;s software, a sync
            program from your FMS, PTI&apos;s BridgeApp, and the FMS itself. Some run as services, as
            the table shows for Storable Easy, so check the Windows Services app as well as the screen.
          </li>
          <li>
            <strong>What does the vendor say happens if it is off?</strong> Find your system in the
            table above. Note whether the document means the gate itself or changes reaching it.
          </li>
          <li>
            <strong>Which Windows version does it run?</strong> Compare it with Microsoft&apos;s dates
            and your vendors&apos; listed versions above.
          </li>
          <li>
            <strong>What else depends on it?</strong> If your FMS runs on the same computer, retiring
            the gate software may not retire the computer. PTI&apos;s BridgeApp, described above, is
            one example.
          </li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold">Your options</h2>

        <h3 className="mt-8 text-xl font-semibold">Keep the current setup for now</h3>
        <p className="mt-4 text-text-800">
          If it works, you can keep it. That means keeping the computer on and awake as the documents
          above ask, checking that the sync is running, and settling the Windows 10 question with ESU or
          a newer Windows version your vendors confirm.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Move to your gate vendor&apos;s cloud product</h3>
        <p className="mt-4 text-text-800">
          For PTI sites, that is StorLogix Cloud, with CloudController as PTI&apos;s go-forward
          controller. If your FMS connects through the BridgeApp, a PC or server that holds your FMS
          client stays in the picture. <SourceLink source={SOURCES.ptiCloudManual} /> For DoorKing 1830
          Series entry systems, it is the Cloud Account Manager.{" "}
          <SourceLink source={SOURCES.doorkingCloudAccountManager} /> Check DoorKing&apos;s FMS list,
          described above, before you plan on it.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Choose a cloud access system that works with your FMS</h3>
        <p className="mt-4 text-text-800">
          OpenTech Alliance describes INSOMNIAC CIA, and Janus International describes Nokē Smart
          Entry, as cloud-based. <SourceLink source={SOURCES.opentechCia} />{" "}
          <SourceLink source={SOURCES.janusNoke1} /> Which FMS each one works with is a separate
          question; our{" "}
          <Link href="/resources/self-storage-gate-compatibility" className={link}>
            compatibility matrix
          </Link>{" "}
          sets out what each vendor publishes.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Use your FMS vendor&apos;s own access control</h3>
        <p className="mt-4 text-text-800">
          Storable Edge&apos;s gate integration page lists Storable Access Control among its
          integrations. <SourceLink source={SOURCES.storableEdgeGateIntegration} /> If you run Storable
          software, ask Storable what it would involve at your site.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Move the computer&apos;s job to a hosted service</h3>
        <p className="mt-4 text-text-800">
          This is what we do. The office PC&apos;s job moves to the cloud. A small bridge stays at the
          site to talk to your controllers. We can bridge Storable Edge and Storable Easy to OpenTech
          Alliance&apos;s INSOMNIAC CIA and to DigiGate. Tell us your setup.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <p className="mt-4 text-text-800">
          Start with the checklist. If you run DigiGate or FalconXT, read our guides to{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            DigiGate replacement options
          </Link>{" "}
          or{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end of life
          </Link>{" "}
          first, since PTI lists both as legacy products. <SourceLink source={SOURCES.ptiFacts} /> If
          codes are not reaching the gate today, work through the{" "}
          <Link href="/resources/gate-not-syncing" className={link}>
            gate sync diagnostic guide
          </Link>{" "}
          before you change anything else.
        </p>
        <p className="mt-4 text-text-800">
          If hosting is the option you want to explore, read how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud access control hosting
          </Link>{" "}
          works. Tell us what is on site. We will tell you plainly whether we can work with it as it is,
          and what replacing it would involve if not. Pricing depends on how many facilities you run and
          what hardware is on site.
        </p>

        <SourceList
          sources={[
            SOURCES.storableEasyGateSync,
            SOURCES.opentechCia,
            SOURCES.doorkingCloudAccountManager,
            SOURCES.janusNoke1,
            SOURCES.microsoftWindowsEos,
            SOURCES.digiGateManual,
            SOURCES.storableEasyCommonProblems,
            SOURCES.storableEasyDigiGate,
            SOURCES.storableEdgeGateIntegration,
            SOURCES.ptiDesktopRequirements,
            SOURCES.ptiCloudManual,
            SOURCES.ptiFacts,
            SOURCES.opentechK500Manual,
            SOURCES.sitelinkCiaNews,
            SOURCES.doorkingSelfStorage,
            SOURCES.doorkingWindowsAccountManager,
            SOURCES.sitelinkRecommendedHardware,
            SOURCES.ptiDesktopInstallGuide,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, Storable, OpenTech Alliance, DoorKing, Janus
          International or Microsoft, or with the makers of QuikStor, Revenue Control Systems,
          StorGuard, SpiderDoor, WinSen or Cubby. Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Is your gate tied to an office PC?"
        text="Tell us your facility software and what is on site. We will tell you plainly whether we can work with it as it is."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
