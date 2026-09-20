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

const A = article("digigate-replacement");

export const metadata: Metadata = pageMeta({
  title: "DigiGate Replacement Options",
  description:
    "PTI no longer sells or supports DigiGate. Which products PTI's end-of-life notice names, what keeps running without the PC, and the ways to replace it.",
  path: "/resources/digigate-replacement",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

// Every line of the timeline in PTI's end-of-life notice, exactly as PTI
// printed them (SOURCES.ptiEolNotice). These are the only third-party
// end-of-support dates this page may print. The notice itself has no printed
// issue date, and PTI gives none for DigiGate's legacy status.
//
// All four rows are here, not just the DigiTech-scoped ones. Two of the
// "Products named" cells print Falcon 2000 & Base Unit alongside DigiTech, so
// dropping the Falcon-only row left the table showing Falcon 2000 in the two
// May 28, 2021 rows and then, one row later, an End of Partner Support date
// of December 3, 2021 that is DigiTech's alone. Falcon 2000's End of Partner
// Support was May 28, 2021. Printing a third party's support date later than
// the one it published is the worst error this page could make, so the table
// carries the notice's timeline whole rather than a scoped slice of it.
type Milestone = { key: string; date: string; milestone: string; products: string };

const EOL_TIMELINE: Milestone[] = [
  {
    key: "last-time-buy",
    date: "May 28, 2021",
    milestone: "Last Time Buy Date",
    products: "DigiTech, and Falcon 2000 & Base Unit",
  },
  {
    key: "end-of-direct-support",
    date: "May 28, 2021",
    milestone: "End of Direct Support",
    products: "DigiTech, and Falcon 2000 & Base Unit",
  },
  {
    key: "end-of-partner-support-falcon",
    date: "May 28, 2021",
    milestone: "End of Partner Support",
    products: "Falcon 2000 & Base Unit only",
  },
  {
    key: "end-of-partner-support-digitech",
    date: "December 3, 2021",
    milestone: "End of Partner Support",
    products: "DigiTech",
  },
];

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "DigiGate Replacement Options", path: "/resources/digigate-replacement" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          PTI Security Systems lists DigiGate among its legacy products, which it says it no longer
          sells or supports. Its facts page gives no date for that. <SourceLink source={SOURCES.ptiFacts} />{" "}
          Separately, an archived PTI end-of-life notice for its DigiTech and Falcon 2000 products,
          which PTI keeps in its DigiGate archive, prints dates for DigiTech: May 28, 2021 for the Last
          Time Buy Date and the End of Direct Support, and December 3, 2021 for the End of Partner
          Support. Falcon 2000 &amp; Base Unit shares the first two dates, and its End of Partner
          Support is the earlier May 28, 2021.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} />
        </p>
        <p className="mt-4 text-text-800">
          What still works is a separate question. DigiGate&apos;s installation manual says that once
          programmed, the system controller can run the system without the PC being on. It also says
          the office PC runs the DigiGate software and is used to program the controller.{" "}
          <SourceLink source={SOURCES.digiGateManual} /> The user&apos;s guide describes move-ins,
          move-outs and lockouts in your management software passing to a DigiGate program, which
          sends them on to the controller. <SourceLink source={SOURCES.digiGateUsersGuide} />
        </p>
        <p className="mt-4 text-text-800">
          So you have two decisions: what replaces the hardware, and what to do about the PC while
          you work that out. Below is what PTI&apos;s documents say, how Storable Easy and Storable
          Edge connect to DigiGate, the replacement paths each vendor documents, and what to gather
          before you change anything. If you run Storable Edge or Storable Easy, there is also a way
          to{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            take the office PC out of the software-to-gate chain
          </Link>{" "}
          while you decide.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What PTI says about DigiGate now</h2>
        <p className="mt-4 text-text-800">
          PTI&apos;s facts page has a Legacy Products section. It lists DigiGate under keypads, next
          to the VP Standard Series and Digitech, and lists FalconXT and the StorLogix Cloud Adaptor
          under access control hardware. PTI says it no longer sells or supports the products in that
          section and considers them legacy. <SourceLink source={SOURCES.ptiFacts} />
        </p>
        <p className="mt-4 text-text-800">
          The same page says archived knowledge base materials are accurate for the dates they were
          published, but should not be used on their own to judge what PTI offers today.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> That is how to read every older DigiGate document
          in this article.
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s current knowledge base lists no DigiGate documents. It points readers who cannot
          find their product to its archive. <SourceLink source={SOURCES.ptiKnowledgeBase} /> Among
          the documents under the archive&apos;s DigiGate heading are an installation manual, a user
          manual, a guide to sending your DigiGate files to PTI, and an end-of-life notice that
          PTI&apos;s link calls
          &quot;Falcon2000 &amp; DigiGate End of Life Notice&quot;.{" "}
          <SourceLink source={SOURCES.ptiKbArchive} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What the end-of-life notice says</h2>
        <p className="mt-4 text-text-800">
          The notice is headed End of Life Notice: DigiTech &amp; Falcon 2000 with Falcon Base Unit.
          Its text names DigiTech and Digitech, never DigiGate. No issue date is printed on it.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} /> The link to DigiGate is PTI&apos;s own filing
          of the notice under the DigiGate heading of its archive.{" "}
          <SourceLink source={SOURCES.ptiKbArchive} />
        </p>
        <p className="mt-4 text-text-800">
          It says PTI is discontinuing two solutions and all associated products: Falcon 2000 with
          Falcon Base Unit, software and hardware, and DigiTech, software and hardware. Its timeline,
          in full, gives these dates, and the products column says which of the two each line covers.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} />
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              The whole timeline in PTI&apos;s end-of-life notice, as PTI printed it
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Date
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Milestone
                </th>
                <th scope="col" className="py-3 pr-4 font-semibold">
                  Products named
                </th>
              </tr>
            </thead>
            <tbody>
              {EOL_TIMELINE.map((m) => (
                <tr key={m.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {m.date}
                  </th>
                  <td className="py-3 pr-4 text-text-800">{m.milestone}</td>
                  <td className="py-3 pr-4 text-text-800">{m.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-text-800">
          This article gives those terms and dates as PTI printed them and does not interpret them.
        </p>
        <p className="mt-4 text-text-800">
          The notice gives PTI&apos;s reasons. It called the decision &quot;long overdue&quot;, saying
          many of the products&apos; components had been discontinued several years earlier and were
          obsolete, and that the products could not support the industry&apos;s technological demands.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} />
        </p>
        <p className="mt-4 text-text-800">
          It says customers will be encouraged to contact their local PTI Partners for help
          maintaining or replacing Digitech and Falcon 2000 &amp; Base Unit systems, and that trained
          partners may have inventory of discontinued products while supplies last. It noted that
          stock and replacement units were limited. It strongly encourages migration to the new
          solution and products as soon as possible, without naming them.{" "}
          <SourceLink source={SOURCES.ptiEolNotice} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What keeps working, and what depends on the PC</h2>
        <p className="mt-4 text-text-800">
          Two older documents in PTI&apos;s DigiGate archive explain how the system fits together:
          the DigiGate-700 installation manual, dated 2008, and the
          DigiGate-700 for Windows user&apos;s guide, dated 2009.{" "}
          <SourceLink source={SOURCES.digiGateManual} />{" "}
          <SourceLink source={SOURCES.digiGateUsersGuide} />
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            The system controller, or Syscon, is the heart of the system, and every DigiGate site has one. It
            stores the access codes and tenant information, and decides whether a code entered at a
            keypad is valid. <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            Once programmed, the controller can run the system without the PC being on. An internal
            battery keeps its programming in memory through a power failure.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            The office PC runs the DigiGate software and is used to program the controller. It
            connects over an RS-232 cable up to 50 feet long.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            The controller keeps a log of activity at the site and uploads it to the PC
            automatically when the PC runs the DigiGate program.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            The PC should have its Hibernation and Power Standby features turned off. The manual
            warns that otherwise the PC can have communication problems with the DigiGate system.{" "}
            <SourceLink source={SOURCES.digiGateManual} />
          </li>
          <li>
            When you move a tenant in or out, transfer them to a new unit, bring a delinquent tenant
            up to date or lock a tenant out, your management software writes each transaction to a
            Link file. It then calls a DigiGate program that updates DigiGate&apos;s databases and
            sends the information on to the controller.{" "}
            <SourceLink source={SOURCES.digiGateUsersGuide} />
          </li>
          <li>
            The 2009 user&apos;s guide names Windows 95, 98, NT, XP and Vista, and says that on any
            other operating system the program will not work correctly, if at all.{" "}
            <SourceLink source={SOURCES.digiGateUsersGuide} /> We found no PTI statement about later
            versions of Windows.
          </li>
        </ul>
        <p className="mt-4 text-text-800">
          Put together: the controller checks codes against what it already holds, while changes from
          your management software and your event history both pass through the DigiGate program on
          that PC. If the PC is what worries you,{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            our guide to whether you still need a Windows PC for your gate
          </Link>{" "}
          looks at that question across vendors.
        </p>

        <h3 className="mt-8 text-xl font-semibold">If you run Storable Easy</h3>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s list of the gate software it can integrate with includes DigiGate.{" "}
          <SourceLink source={SOURCES.storableEasyThirdPartyGates} /> Its DigiGate guide has you
          install Storable Easy&apos;s gate sync program and set that program&apos;s Post Download
          Action to digisend.exe in the digi folder. You then set DigiGate to read the gate file
          Storable Easy creates. The guide says DigiGate needs to stay open for the communication to
          work. <SourceLink source={SOURCES.storableEasyDigiGate} />
        </p>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s general troubleshooting article for the gate sync says your computer
          has to stay on 24/7 for the gate to sync, and should not be allowed to sleep or hibernate.{" "}
          <SourceLink source={SOURCES.storableEasyGateSync} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">If you run Storable Edge</h3>
        <p className="mt-4 text-text-800">
          Storable Edge&apos;s gate integration page lists DigiGate among the gate systems you can use
          with Storable Edge. Its requirements say Storable Edge&apos;s gate software must be
          installed on the same computer as the DigiGate gate software, and call for a computer with
          Windows Vista or Windows 7, 8 or 10. It says to keep both your gate software and Storable
          Edge&apos;s gate program running at all times, so that updates to your gate software and
          keypads are not interrupted. <SourceLink source={SOURCES.storableEdgeGateIntegration} />
        </p>
        <p className="mt-4 text-text-800">
          Either way, the chain from your software to your gate runs through a Windows computer
          running DigiGate, then over the RS-232 cable to the controller.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your replacement paths</h2>
        <p className="mt-4 text-text-800">
          PTI&apos;s notice encourages migration but names no product. Here are the paths, each from
          the vendors&apos; own documents, starting with the one that involves no purchase.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Keep it running while you plan</h3>
        <p className="mt-4 text-text-800">
          The manual is the case for not rushing: once programmed, the controller can run the system
          without the PC being on. <SourceLink source={SOURCES.digiGateManual} /> The risk is
          everything around it. Changes still depend on the PC, and on software whose user&apos;s
          guide names Windows versions only up to Vista.{" "}
          <SourceLink source={SOURCES.digiGateUsersGuide} /> PTI lists DigiGate as no longer sold or
          supported. <SourceLink source={SOURCES.ptiFacts} /> Its end-of-life notice said stock was
          limited. <SourceLink source={SOURCES.ptiEolNotice} /> If you wait, keep that PC&apos;s hibernation
          and standby off, as the manual asks, and use the time to work through the checklist further
          down.
        </p>

        <h3 className="mt-8 text-xl font-semibold">PTI&apos;s go-forward controller: CloudController</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s StorLogix Cloud user&apos;s manual calls the CloudController its go-forward
          system controller.{" "}
          <SourceLink source={SOURCES.ptiCloudManual} /> Its facts page lists CloudController
          as current hardware that connects a facility&apos;s on-site access control hardware to
          PTI&apos;s StorLogix Cloud software without a separate adaptor.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> The CloudController page describes a
          cloud-to-cloud configuration that connects your facility&apos;s access control hardware with
          portfolio-wide software. <SourceLink source={SOURCES.ptiCloudControllerPage} />
        </p>
        <p className="mt-4 text-text-800">
          The CloudController page does not mention DigiGate or Digitech.{" "}
          <SourceLink source={SOURCES.ptiCloudControllerPage} /> We found no PTI document about moving
          a DigiGate site onto CloudController. That does not mean it cannot be done. Ask PTI, or a
          PTI partner as the notice suggests, what your site would need and which of your existing
          parts it would keep.
        </p>

        <h3 className="mt-8 text-xl font-semibold">The archived FalconXT route</h3>
        <p className="mt-4 text-text-800">
          An archived PTI document, filed under FalconXT, explains how to replace the Digitech
          System Controller with a FalconXT while keeping Digitech keypads and other peripheral
          devices. <SourceLink source={SOURCES.ptiReplaceSyscon} /> PTI&apos;s facts page now lists
          FalconXT as a legacy product too. <SourceLink source={SOURCES.ptiFacts} /> If you took that
          route earlier or are weighing it,{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            our FalconXT end-of-life guide
          </Link>{" "}
          covers the options from there.
        </p>

        <h3 className="mt-8 text-xl font-semibold">OpenTech Alliance&apos;s PTI keypad integration</h3>
        <p className="mt-4 text-text-800">
          In an April 2020 announcement, OpenTech Alliance said a new integration lets operators
          connect existing PTI Apex or VP keypads to INSOMNIAC® CIA, its cloud-based access control.
          It added that the older keypads do not have all of the features included with CIA.{" "}
          <SourceLink source={SOURCES.opentechPtiKeypads} /> Its current CIA page still offers the
          upgrade with existing PTI Apex or VP keypads. <SourceLink source={SOURCES.opentechCia} />
        </p>
        <p className="mt-4 text-text-800">
          Neither page mentions DigiGate keypads. If yours are DigiGate keypads, ask OpenTech
          Alliance whether they can connect before you plan around it.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Access Control, and the gate vendors Storable lists</h3>
        <p className="mt-4 text-text-800">
          Storable says Storable Access Control embeds access management directly into
          Storable&apos;s facility management software. <SourceLink source={SOURCES.storableAccessControl} />
        </p>
        <p className="mt-4 text-text-800">
          On the same page, answering whether Storable integrates with existing gate hardware,
          Storable says its software integrates with a variety of third-party gate providers, to
          assign gate codes and update the gate software with tenant status. Among the providers it
          names are DigiGate, DoorKing (its 1838 Multi-Door Access Controller), OpenTech
          Alliance&apos;s CIA, PTI&apos;s StorLogix and Falcon, QuikStor, Revenue Control Systems,
          StorGuard and SpiderDoor. <SourceLink source={SOURCES.storableAccessControl} />
        </p>
        <p className="mt-4 text-text-800">
          That answer is about Storable&apos;s software sending codes and tenant status to each
          vendor&apos;s gate software. It does not say which of your DigiGate keypads, wiring or other
          parts a new system could reuse, so ask each vendor about your site.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Before you replace anything</h2>
        <p className="mt-4 text-text-800">
          Two archived PTI documents show what PTI&apos;s own process involved when they were
          written: one for sending your DigiGate files to PTI, and one for replacing the controller. Treat
          them as a list of questions to ask, not as current instructions.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>
            <strong>Your DigiGate files.</strong> PTI&apos;s guide to sending your DigiGate files to
            PTI describes a program that finds and compresses the DigiGate files PTI needs and sends
            them to PTI. It has to be run from the PC that has DigiGate installed, and it asks for a
            sales order or quote number from a PTI salesperson.{" "}
            <SourceLink source={SOURCES.ptiSendDigiGateFiles} />
          </li>
          <li>
            <strong>Your setups.</strong> PTI&apos;s document on replacing the Digitech controller
            with a FalconXT uses the DigiGate application on the PC that ran the access system to
            print reports for configuring the new software.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} /> Keep that PC, and DigiGate on it,
            working until your new system is set up.
          </li>
          <li>
            <strong>Keypad Zones.</strong> An appendix to the same document explains that in
            DigiGate, each tenant is assigned a Keypad Zone that defines which devices they can use
            to enter or exit, and that each tenant&apos;s time zone is handled separately. The
            document also says complex setups, such as those involving elevators or lighting
            control, may need help from a local dealer or installer.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} />
          </li>
          <li>
            <strong>Your FMS settings.</strong> The document says your management software&apos;s
            settings will need to be changed to send information to the new program instead of
            DigiGate. PTI says it cannot give instructions for that step.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} />
          </li>
          <li>
            <strong>Downtime.</strong> For that procedure, the document warns that the access control
            system is inoperable during the changeover, and says to let customers in and out by
            opening gates or doors manually until it is finished.{" "}
            <SourceLink source={SOURCES.ptiReplaceSyscon} /> Ask any vendor how long your gate would
            be down.
          </li>
          <li>
            <strong>Your wiring.</strong> The installation manual describes Uni-Muxes
            daisy-chained to the controller on a two-conductor shielded RS-485 cable, and 700LX
            keypads connecting over the RS-485 data cable.{" "}
            <SourceLink source={SOURCES.digiGateManual} /> Note which of these you have before anyone
            quotes a replacement.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            Write down what is on site: the controller, keypads, Uni-Muxes and any other
            devices, the PC and its version of Windows, and which FMS you run.
          </li>
          <li>Keep the DigiGate PC and its data until your new system is configured.</li>
          <li>
            Ask each vendor you are considering what your site would need, which of your parts it
            would keep, and how long the gate would be down.
          </li>
          <li>Decide what the office PC does in the meantime.</li>
        </ol>
        <p className="mt-4 text-text-800">
          On that last point: if you run Storable Edge or Storable Easy, one option is to take the
          office PC out of the chain between your software and your gate while you plan the hardware
          decision.
          The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to
          your controllers.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-800">
          <li>We can bridge Storable Edge to DigiGate. Tell us your setup.</li>
          <li>We can bridge Storable Easy to DigiGate. Tell us your setup.</li>
        </ul>
        <p className="mt-4 text-text-800">
          If your hardware is something else, or you are not sure what you have, tell us what is on
          site. We will tell you plainly whether we can work with it as it is, and what replacing it
          would involve if not. You can read{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            how our cloud access control hosting works
          </Link>{" "}
          first. For each vendor&apos;s own help pages, see our{" "}
          <Link href="/support" className={link}>
            support page
          </Link>
          .
        </p>

        <SourceList
          sources={[
            SOURCES.ptiFacts,
            SOURCES.ptiEolNotice,
            SOURCES.digiGateManual,
            SOURCES.digiGateUsersGuide,
            SOURCES.ptiKnowledgeBase,
            SOURCES.ptiKbArchive,
            SOURCES.storableEasyThirdPartyGates,
            SOURCES.storableEasyDigiGate,
            SOURCES.storableEasyGateSync,
            SOURCES.storableEdgeGateIntegration,
            SOURCES.ptiCloudManual,
            SOURCES.ptiCloudControllerPage,
            SOURCES.ptiReplaceSyscon,
            SOURCES.opentechPtiKeypads,
            SOURCES.opentechCia,
            SOURCES.storableAccessControl,
            SOURCES.ptiSendDigiGateFiles,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with PTI Security Systems, Storable, OpenTech Alliance, DoorKing,
          QuikStor, Revenue Control Systems, StorGuard, SpiderDoor or Microsoft.
          Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Tell us what DigiGate hardware is on site"
        text="We will tell you plainly whether we can work with it as it is, and what replacing it would involve if not."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
