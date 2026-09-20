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

const A = article("falconxt-end-of-life");

export const metadata: Metadata = pageMeta({
  title: "FalconXT End of Life: Your Options",
  description:
    "PTI lists FalconXT and the StorLogix Cloud Adaptor as legacy products it no longer sells or supports. Every path forward, each one cited to its vendor.",
  path: "/resources/falconxt-end-of-life",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

// Page 7 of the migration manual (ptiMigrationManual): wire labels and
// terminal names from its table.
type WireRow = { wire: string; falcon: string; cloud: string };

const WIRING: readonly WireRow[] = [
  { wire: "Red, 12VDC", falcon: "Port 1", cloud: "DC + Out on the Power Supply Board" },
  { wire: "Black, GND", falcon: "Port 2", cloud: "DC - on the Power Supply Board" },
  { wire: "White, Data +", falcon: "Port 3", cloud: "A on the IO Module" },
  { wire: "Shield", falcon: "Port 4", cloud: "GND on the IO Module" },
  { wire: "Green, Data -", falcon: "Port 5", cloud: "B on the IO Module" },
];

// The controller comparison chart (ptiComparisonChart). The chart prints a
// check or a cross; this table writes them as Yes and No.
type ChartRow = { feature: string; falcon: "Yes" | "No"; cloud: "Yes" | "No" };

const CHART: readonly ChartRow[] = [
  { feature: "Cloud native", falcon: "No", cloud: "Yes" },
  { feature: "Cloud-based software", falcon: "Yes", cloud: "Yes" },
  { feature: "Automatic firmware updates", falcon: "No", cloud: "Yes" },
  { feature: "Enhanced offline mode", falcon: "No", cloud: "Yes" },
  { feature: "Webhooks", falcon: "Yes", cloud: "Yes" },
  { feature: "SMS notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Email notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Push notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Browser notifications", falcon: "Yes", cloud: "Yes" },
  { feature: "Aggregated dashboard", falcon: "Yes", cloud: "Yes" },
  { feature: "Integrates with unit security devices", falcon: "Yes", cloud: "Yes" },
  { feature: "Integrates with mobile solutions", falcon: "Yes", cloud: "Yes" },
];

// Generic questions; no vendor facts.
const QUESTIONS: readonly string[] = [
  "Which of my current devices do you keep, and which do you replace? Go device by device: controller, keypads, door alarms, smart locks.",
  "Can my existing wire stay, or must new wire be pulled? Who pays for it?",
  "Who does the installation, and who answers for it if something fails in the first week?",
  "What additional equipment might the job need, and at what cost?",
  "Where must the new equipment be mounted, and what power and backup does it need?",
  "How do tenant codes and access history get into the new system: imported, or rebuilt from my FMS?",
  "Does it work with my FMS today, and what happens to the old integration while the new one goes in?",
  "How is the changeover staged, and how much downtime should I plan for?",
  "What does it cost up front, and what does it cost each year after that?",
  "Is the product you are quoting on your current product list?",
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "FalconXT End of Life: Your Options", path: "/resources/falconxt-end-of-life" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          PTI Security Systems lists FalconXT and the StorLogix Cloud Adaptor among its legacy
          products, which it says it no longer sells or supports. PTI&apos;s pages publish no date
          for this, so this guide gives none. <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s plain-text facts file says the same. It adds that FalconXT, the StorLogix Cloud
          Adaptor and StorLogix Desktop should not be described as current PTI products.{" "}
          <SourceLink source={SOURCES.ptiLlmsTxt} />
        </p>
        <p className="mt-4 text-text-800">
          If one of these runs your gate, this guide explains what each product is, how to tell
          which you have, and every realistic path forward: staying put for now, PTI&apos;s own
          CloudController, keeping your PTI keypads on another vendor&apos;s system, switching
          vendors, and, if a PC is part of your setup, moving its job to a hosted service such as
          our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            cloud-hosted access control
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What PTI says, and what it does not</h2>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page has a Legacy Products section. It describes the products listed
          there as &quot;no longer sold or supported&quot; by PTI. FalconXT and the StorLogix Cloud
          Adaptor sit under access control hardware. StorLogix Desktop sits under software. The same
          list also names the VP Standard Series keypads and DigiGate.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          Neither the facts page nor the plain-text file gives a date for any of this. Neither says
          whether, or for how long, a FalconXT will keep reporting to StorLogix Cloud through an
          adaptor, and neither mentions repairs or spare parts. If a date matters to your plans, ask
          PTI for it in writing.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          What you have: FalconXT, the adaptor and StorLogix Desktop
        </h2>
        <p className="mt-4 text-text-800">
          Which of these are on your site decides which options apply to you.
        </p>

        <h3 className="mt-8 text-xl font-semibold">FalconXT, the controller</h3>
        <p className="mt-4 text-text-800">
          FalconXT is a PTI access controller. PTI&apos;s controller comparison chart sets it side
          by side with the CloudController, feature by feature.{" "}
          <SourceLink source={SOURCES.ptiComparisonChart} /> PTI&apos;s migration manual shows the
          wires from Access Interface (AI) devices landing on ports 1 to 5 of the FalconXT&apos;s AI
          devices module. <SourceLink source={SOURCES.ptiMigrationManual} /> PTI&apos;s CloudController
          manual gives keypads, multiplexers and relay boards as examples of AI devices.{" "}
          <SourceLink source={SOURCES.ptiCloudControllerManual} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">The StorLogix Cloud Adaptor, the link to the cloud</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page describes StorLogix Cloud as central cloud management software.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> PTI&apos;s 2023 blog on the CloudController says
          the FalconXT requires an adaptor to communicate through the cloud.{" "}
          <SourceLink source={SOURCES.ptiNextGenBlog} /> PTI&apos;s archived StorLogix Cloud and
          FalconXT user guide describes that adaptor as a small computer that lets the FalconXT
          communicate over the Internet. <SourceLink source={SOURCES.ptiCloudFalconGuide} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">StorLogix Desktop, the PC software</h3>
        <p className="mt-4 text-text-800">
          StorLogix Desktop is PTI software that runs on a Windows computer. PTI&apos;s archived
          computer requirements for it call for Windows 10 or higher. Its hardware requirements list
          an installed and working FalconXT, plus at least one AI device or door controller
          connected to that FalconXT. <SourceLink source={SOURCES.ptiDesktopRequirements} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">Which setup is yours?</h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            A FalconXT that reports to StorLogix Cloud: a controller and an adaptor, both on the
            legacy list. <SourceLink source={SOURCES.ptiFacts} />
          </li>
          <li>
            A FalconXT with StorLogix Desktop on a Windows computer: the controller and the software
            are both on the legacy list. <SourceLink source={SOURCES.ptiFacts} />
          </li>
          <li>
            A CloudController that reports to StorLogix Cloud: no adaptor is involved, and PTI lists
            the CloudController among its current products.{" "}
            <SourceLink source={SOURCES.ptiLlmsTxt} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          If you cannot tell which you have, start with the section on identifying your system on
          our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your options</h2>
        <p className="mt-4 text-text-800">
          There are five realistic paths. They are not exclusive: you can stay put for a while and
          collect quotes on the others.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Stay where you are, for now</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s pages set no date for these products. They say that PTI no longer sells or
          supports them. <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          PTI has written about the risk in general terms. A 2026 PTI blog on moving from desktop to
          cloud tells owners to weigh the expense they could face when a desktop system ultimately
          fails, whether from a hardware failure or because the computer&apos;s operating system no
          longer supports it. The blog is about desktop systems in general and does not name
          FalconXT. <SourceLink source={SOURCES.ptiDesktopToCloudBlog} />
        </p>
        <p className="mt-4 text-text-800">
          If you stay for now, use the time: write down what is on site and get quotes, so that a
          failed part does not leave you choosing in a hurry.
        </p>

        <h3 className="mt-8 text-xl font-semibold">PTI&apos;s own path: the CloudController</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s StorLogix Cloud user&apos;s manual calls the CloudController its go-forward
          system controller.{" "}
          <SourceLink source={SOURCES.ptiCloudManual} /> PTI describes it as cloud-native
          hardware that links a facility&apos;s on-site access control hardware to StorLogix Cloud
          without a separate adaptor. <SourceLink source={SOURCES.ptiLlmsTxt} /> PTI&apos;s
          2023 blog makes the same point: the CloudController does not need a cloud adaptor, where
          the FalconXT does. <SourceLink source={SOURCES.ptiNextGenBlog} />
        </p>
        <p className="mt-4 text-text-800">
          PTI also publishes a FalconXT to CloudController migration manual. Here is what it says
          the change involves, with one point from PTI&apos;s CloudController manual.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Wiring.</strong> Page 7 maps each wire on the FalconXT&apos;s AI devices module
            to a terminal on the CloudController. The table below shows the mapping.{" "}
            <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>New wire or old.</strong> The CloudController user&apos;s manual reads
            differently. It says to use new wire during retrofits and change-outs, not wire already
            pulled on a site. <SourceLink source={SOURCES.ptiCloudControllerManual} /> The two
            documents do not settle which applies to you, so ask PTI or your installer whether your
            existing wire can stay.
          </li>
          <li>
            <strong>Who does the work.</strong> PTI recommends that a certified, licensed, qualified
            technician install and set up its equipment. PTI can recommend local dealers and
            installers. Checking their qualifications and negotiating any pricing or contracts is the
            customer&apos;s responsibility, unless PTI has been specifically contracted in writing
            to do so on the customer&apos;s behalf. <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>Extra equipment.</strong> The manual says troubleshooting and configuration may
            include buying additional equipment. It names none and gives no prices.{" "}
            <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>Placement.</strong> The CloudController is not intended for outdoor
            installation. <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
          <li>
            <strong>Power.</strong> For sites prone to brownouts, blackouts, electrical storms or
            other major power interruptions, the manual recommends installing a UPS. It says the
            controller and system power supplies must be on UPSs separate from the computer&apos;s.{" "}
            <SourceLink source={SOURCES.ptiMigrationManual} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          The manual does not list which keypads or other AI devices carry over to a
          CloudController. <SourceLink source={SOURCES.ptiMigrationManual} /> Ask for that in
          writing too.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Where each wire on the FalconXT&apos;s AI devices module moves on the CloudController,
              from page 7 of PTI&apos;s migration manual
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Wire
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  FalconXT AI devices module
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  CloudController terminal
                </th>
              </tr>
            </thead>
            <tbody>
              {WIRING.map((r) => (
                <tr key={r.falcon} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.wire}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{r.falcon}</td>
                  <td className="py-3 pr-4 text-text-800">{r.cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-text-800">
          PTI&apos;s controller comparison chart marks three features as CloudController only: cloud
          native, automatic firmware updates and enhanced offline mode. Every other row is checked
          for both controllers. <SourceLink source={SOURCES.ptiComparisonChart} /> PTI&apos;s 2023
          blog adds that updating a FalconXT&apos;s firmware means inserting a flash drive into the
          controller. <SourceLink source={SOURCES.ptiNextGenBlog} />
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              PTI&apos;s controller comparison chart. The chart prints a check or a cross; they are
              shown here as Yes and No.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Feature
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  FalconXT
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  CloudController
                </th>
              </tr>
            </thead>
            <tbody>
              {CHART.map((r) => (
                <tr key={r.feature} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.feature}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{r.falcon}</td>
                  <td className="py-3 pr-4 text-text-800">{r.cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Keep your PTI keypads, change what is behind them</h3>
        <p className="mt-4 text-text-800">
          In April 2020, OpenTech Alliance announced an integration that lets operators connect
          existing PTI Apex or VP keypads to INSOMNIAC® CIA, its cloud-based access control.{" "}
          <SourceLink source={SOURCES.opentechPtiKeypads} />
        </p>
        <p className="mt-4 text-text-800">
          Keep three things in mind. The announcement covers PTI keypads and does not mention the
          FalconXT controller. It says the older keypads do not have every feature that CIA
          includes. And it dates from 2020. <SourceLink source={SOURCES.opentechPtiKeypads} />{" "}
          OpenTech Alliance&apos;s current CIA page still offers the upgrade with existing PTI Apex or
          VP keypads. <SourceLink source={SOURCES.opentechCia} /> Confirm with OpenTech Alliance that
          it fits your keypads. Note too that PTI lists
          the VP Standard Series among its legacy products.{" "}
          <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          What would stay and what would go on your site is a question for OpenTech Alliance and an
          installer.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Switch to another access control vendor</h3>
        <p className="mt-4 text-text-800">
          Several companies sell access control for self-storage. Each one below is described only
          by what its own pages say, in no particular order. This is not a complete list, and
          naming a vendor here is not a recommendation.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Storable Access Control.</strong> Storable says its access control software is
            fully integrated and designed for self-storage operators, with access point management
            built into the Storable platform. In its answer on whether it integrates with existing
            gate hardware, the same page lists PTI/StorLogix and PTI/Falcon among the third-party
            gate providers its software integrates with. It does not say which Falcon model.{" "}
            <SourceLink source={SOURCES.storableAccessControl} />
          </li>
          <li>
            <strong>OpenTech Alliance&apos;s INSOMNIAC CIA.</strong> OpenTech Alliance says CIA
            gives you control of a single facility or thousands of properties from anywhere.{" "}
            <SourceLink source={SOURCES.opentechCia} />
          </li>
          <li>
            <strong>Janus International&apos;s Nokē Smart Entry.</strong> Janus International
            describes the Nokē system as a fully integrated smart access solution designed for
            self-storage facilities. <SourceLink source={SOURCES.janusNoke} /> Its FAQ says the
            legacy Nokē locking product was controlled by the PTI access control system, and that
            the current version uses unit controllers at the door to control each lock. If
            you have the older Nokē locks, ask Janus International what the current version needs.{" "}
            <SourceLink source={SOURCES.janusFaq} />
          </li>
          <li>
            <strong>DoorKing.</strong> DoorKing says it provides automated access solutions designed
            for self-storage operations. <SourceLink source={SOURCES.doorkingSelfStorage} />
          </li>
          <li>
            <strong>StorGuard.</strong> StorGuard says it offers security and software solutions to
            the self-storage industry. Its products page lists keypads and access controllers.{" "}
            <SourceLink source={SOURCES.storguardProducts} />
          </li>
          <li>
            <strong>Sentinel Systems.</strong> Sentinel Systems says its access control systems
            integrate with the major management software used in the self-storage industry.{" "}
            <SourceLink source={SOURCES.sentinelHardware} />
          </li>
          <li>
            <strong>SpiderDoor.</strong> SpiderDoor says it offers cellular and wireless gate access
            solutions to self-storage owners. <SourceLink source={SOURCES.spiderdoorHome} /> Its page
            on switching systems says it does not migrate data from your old access control system,
            and connects to your management software instead.{" "}
            <SourceLink source={SOURCES.spiderdoorSwitch} />
          </li>
          <li>
            <strong>QuikStor.</strong> QuikStor, whose home page presents it as self-storage
            management software, says it has a native access control system.{" "}
            <SourceLink source={SOURCES.quikstorHome} />
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          Ask each vendor, in writing, which of your current devices it would keep and which it
          would replace. To see which gate systems several facility management software (FMS)
          products list as integrations, see our{" "}
          <Link href="/resources/self-storage-gate-compatibility" className={link}>
            gate compatibility matrix
          </Link>
          .
        </p>

        <h3 className="mt-8 text-xl font-semibold">Take the office PC out of the chain</h3>
        <p className="mt-4 text-text-800">
          This path is for sites where a PC is part of how the gate runs. If you run StorLogix
          Desktop, PTI&apos;s requirements put a Windows computer in that chain.{" "}
          <SourceLink source={SOURCES.ptiDesktopRequirements} /> Our guide to{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            whether you still need a Windows PC to run your gate
          </Link>{" "}
          covers the wider question.
        </p>
        <p className="mt-4 text-text-800">
          This is the path we offer. The office PC&apos;s job moves to the cloud. A small bridge
          stays at the site to talk to your controllers. The chain runs from your FMS, to our cloud
          service, to that bridge at the site, to your gate, keypads and locks. We work with gate
          controllers, keypads and readers, smart locks, and door alarms and sensors.
        </p>
        <p className="mt-4 text-text-800">
          Tell us what is on site. We will tell you plainly whether we can work with it as it is,
          and what replacing it would involve if not. Pricing depends on how many facilities you run
          and what hardware is on site.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions to ask any vendor before you switch</h2>
        <p className="mt-4 text-text-800">
          Whichever path you take, including PTI&apos;s, get answers to these in writing before you
          sign anything.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          {QUESTIONS.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
        <p className="mt-4 text-text-800">
          Two vendors have written about these points. SpiderDoor says two access control systems
          cannot run fully in parallel, because your management software can control only one
          access control integration at a time. <SourceLink source={SOURCES.spiderdoorSwitch} /> Ask
          each vendor how it handles that with your FMS. The checklist in PTI&apos;s desktop-to-cloud
          blog tells owners to allow for some downtime while they switch over.{" "}
          <SourceLink source={SOURCES.ptiDesktopToCloudBlog} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <p className="mt-4 text-text-800">
          Start by writing down what is on site: the controller, any adaptor or PC, the keypads, and
          any door alarms or smart locks. If you are not sure which PTI setup you have, our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>{" "}
          has a section to help you work it out.
        </p>
        <p className="mt-4 text-text-800">
          Next, put the questions above to PTI or a PTI dealer about a CloudController, and to at
          least one other vendor. Compare what each would keep, replace and charge. If DigiGate is
          also on your site, our{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            DigiGate replacement guide
          </Link>{" "}
          covers it separately.
        </p>
        <p className="mt-4 text-text-800">
          If a PC in your office is part of your gate setup and you want it out of the chain, read
          how{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            our cloud-hosted access control
          </Link>{" "}
          works, or go straight to its section on{" "}
          <Link href="/solutions/access-control-hosting#end-of-life" className={link}>
            moving off end-of-life gate hardware
          </Link>
          . Tell us what is on site. We will tell you plainly whether we can work with it as it is,
          and what replacing it would involve if not.
        </p>

        <SourceList
          sources={[
            SOURCES.ptiFacts,
            SOURCES.ptiLlmsTxt,
            SOURCES.ptiComparisonChart,
            SOURCES.ptiMigrationManual,
            SOURCES.ptiCloudControllerManual,
            SOURCES.ptiNextGenBlog,
            SOURCES.ptiCloudFalconGuide,
            SOURCES.ptiDesktopRequirements,
            SOURCES.ptiDesktopToCloudBlog,
            SOURCES.ptiCloudManual,
            SOURCES.opentechPtiKeypads,
            SOURCES.storableAccessControl,
            SOURCES.opentechCia,
            SOURCES.janusNoke,
            SOURCES.janusFaq,
            SOURCES.doorkingSelfStorage,
            SOURCES.storguardProducts,
            SOURCES.sentinelHardware,
            SOURCES.spiderdoorHome,
            SOURCES.spiderdoorSwitch,
            SOURCES.quikstorHome,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, OpenTech Alliance, Storable, Janus
          International, DoorKing, StorGuard, Sentinel Systems, SpiderDoor, QuikStor or Microsoft.
          Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Not sure what to do about your FalconXT?"
        text="Tell us what is on site. We will tell you plainly whether we can work with it as it is, and what replacing it would involve if not."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
