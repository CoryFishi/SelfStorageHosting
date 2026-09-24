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

const A = article("self-storage-gate-compatibility");

export const metadata: Metadata = pageMeta({
  title: "Storage Gate Compatibility Matrix",
  description:
    "Which gate systems Storable Edge, Storable Easy and Sitelink by Storable list as integrations, next to the gate makers' own lists. Dated and sourced.",
  path: "/resources/self-storage-gate-compatibility",
  ogType: "article",
  publishedTime: A.datePublished,
  modifiedTime: A.dateModified,
});

const link = `font-semibold underline ${FOCUS_RING_LIGHT}`;

// Table 1: each Storable product's own published gate list, read on
// 2026-09-19. "Listed" means that product's list names the system; "Not in
// the list" means it does not, which is not a finding of incompatibility.
type ListCell = { status: "Listed" | "Not in the list"; detail?: string };
type SoftwareRow = { key: string; gate: string; edge: ListCell; easy: ListCell; sitelink: ListCell };

const LISTED: ListCell = { status: "Listed" };
const NOT_LISTED: ListCell = { status: "Not in the list" };

const SOFTWARE_ROWS: SoftwareRow[] = [
  {
    key: "storable-access-control",
    gate: "Storable Access Control (Storable)",
    edge: { status: "Listed", detail: "Called a native Edge solution" },
    easy: LISTED,
    sitelink: { status: "Listed", detail: "As Access Control by Storable" },
  },
  { key: "digigate", gate: "DigiGate", edge: LISTED, easy: LISTED, sitelink: NOT_LISTED },
  {
    key: "doorking",
    gate: "DoorKing",
    edge: { status: "Listed", detail: "1838 Multi-Door Access Controller" },
    easy: LISTED,
    sitelink: NOT_LISTED,
  },
  {
    key: "cia",
    gate: "INSOMNIAC CIA (OpenTech Alliance)",
    edge: { status: "Listed", detail: "As OpenTech CIA" },
    easy: {
      status: "Not in the list",
      detail: "The list has an entry named Insomniac that does not say which product; see the note below",
    },
    sitelink: LISTED,
  },
  {
    key: "pti",
    gate: "PTI Security Systems",
    edge: { status: "Listed", detail: "StorLogix and Falcon, as separate entries" },
    easy: { status: "Listed", detail: "StorLogix and Falcon 2000, as separate entries" },
    sitelink: { status: "Listed", detail: "The company is named; no product is" },
  },
  { key: "quikstor", gate: "QuikStor", edge: LISTED, easy: LISTED, sitelink: NOT_LISTED },
  { key: "rcs", gate: "Revenue Control Systems", edge: LISTED, easy: NOT_LISTED, sitelink: NOT_LISTED },
  { key: "storguard", gate: "StorGuard", edge: LISTED, easy: LISTED, sitelink: LISTED },
  { key: "spiderdoor", gate: "SpiderDoor", edge: LISTED, easy: NOT_LISTED, sitelink: LISTED },
  {
    key: "winsen",
    gate: "WinSen (Sentinel Systems)",
    edge: { status: "Listed", detail: "Except the RSCM and Platinum versions" },
    easy: { status: "Listed", detail: "As Winsen Sentinel" },
    sitelink: { status: "Listed", detail: "As Sentinel Systems; the company is named, no product is" },
  },
  {
    key: "janus-smart-entry",
    gate: "Nokē Smart Entry (Janus International)",
    edge: NOT_LISTED,
    easy: LISTED,
    sitelink: NOT_LISTED,
  },
  { key: "eight-io", gate: "Eight IO", edge: NOT_LISTED, easy: LISTED, sitelink: NOT_LISTED },
  { key: "bearbox", gate: "BearBox", edge: NOT_LISTED, easy: NOT_LISTED, sitelink: LISTED },
];

// Table 2: the Storable products each gate maker's own page names, read on
// 2026-09-19. Several pages use earlier or other names for Storable's
// products; the cells give today's name and say so, and never print the old
// one. The last row is Storable's own page about one gate maker.
type MakerRow = {
  key: string;
  page: string;
  names: string;
  how: string;
  source: (typeof SOURCES)[keyof typeof SOURCES];
};

const MAKER_ROWS: MakerRow[] = [
  {
    key: "pti",
    page: "PTI Security Systems: facility software integrations table",
    names:
      "Storable Edge (listed under an earlier name, in two rows), Storable Easy (listed under another name), Sitelink",
    how: "Sitelink and Storable Easy: BridgeApp yes, API no. Storable Edge: one row with BridgeApp yes, API no, and a separate webhooks row with BridgeApp no, API yes.",
    source: SOURCES.ptiIntegrationsTable,
  },
  {
    key: "opentech-2018",
    page: "OpenTech Alliance: release dated September 19, 2018",
    names: "Sitelink",
    how: "Says Sitelink was the first vendor to integrate with the INSOMNIAC CIA API.",
    source: SOURCES.opentechSitelink2018,
  },
  {
    key: "doorking",
    page: "DoorKing: self-storage page",
    names:
      "Storable Edge (listed under an earlier name), Storable Easy (listed under another name, linked to the domain of Storable Easy's help center), Sitelink",
    how: "All three are on the list for the Remote Account Manager, which DoorKing describes as Windows software that runs on a host personal computer.",
    source: SOURCES.doorkingSelfStorage,
  },
  {
    key: "janus",
    page: "Janus International: Nokē Smart Entry integration partners (list revised July 2026)",
    names: "Storable Edge (listed under an earlier name), Storable Easy (listed under another name), Sitelink",
    how: "Not stated. The names are logos.",
    source: SOURCES.janusNokePartners,
  },
  {
    key: "storguard",
    page: "StorGuard: partners page",
    names: "Storable Edge (listed under an earlier name), Storable Easy (listed under another name), Sitelink",
    how: "Not stated.",
    source: SOURCES.storguardPartners,
  },
  {
    key: "sentinel",
    page: "Sentinel Systems: hardware page",
    names: "Storable Edge (listed under an earlier name), Sitelink",
    how: "Not stated. The names are logos under an access control compatibility heading.",
    source: SOURCES.sentinelHardware,
  },
  {
    key: "spiderdoor",
    page: "SpiderDoor: access control page",
    names: "Storable Edge (listed under an earlier name), Sitelink",
    how: "Not stated for each software product.",
    source: SOURCES.spiderdoorAccessControl,
  },
  {
    key: "spiderdoor-on-storable",
    page: "SpiderDoor integration page on Storable's own site",
    names: "Sitelink",
    how: "Says Sitelink and SpiderDoor communicate through the cloud, and that a computer at the site is no longer needed.",
    source: SOURCES.storableSpiderDoor,
  },
];

const th = "py-3 pr-4 font-semibold";
const td = "py-3 pr-4 text-text-800";

function Cell({ cell }: { cell: ListCell }) {
  return (
    <td className={td}>
      {cell.status}
      {cell.detail !== undefined && <span className="block text-sm text-text-700">{cell.detail}</span>}
    </td>
  );
}

export default function ArticlePage() {
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Storage Gate Compatibility Matrix", path: "/resources/self-storage-gate-compatibility" },
        ]}
      />
      <JsonLd data={articleSchema({ ...A, path: articlePath(A.slug) })} />

      <article className="mx-auto max-w-3xl px-4 pt-12 pb-16 sm:px-6">
        <h1 className="text-3xl font-extrabold sm:text-4xl">{A.headline}</h1>
        <ArticleDates article={A} />
        <p className="mt-6 text-lg text-text-800">
          If you run Storable Edge, Storable Easy or Sitelink by Storable, start with your own software&apos;s
          published gate list, then check the gate maker&apos;s page. The three Storable lists are not the same, and
          the gate makers&apos; pages do not always name the same pairings. We read all of them on September 19,
          2026. The two tables below report what they said that day, and the page cites where each comes from.
        </p>
        <p className="mt-4 text-text-800">
          Three cautions before you use them. Vendors revise these lists without notice, and most of the lists carry
          no date. A system that is not in a published list may still work with your software: the list simply does
          not name it. And a listing on one side is a reason to ask the other side, not a promise. Before you change
          hardware or software, ask both vendors, your software maker and your gate maker, about your exact setup.
        </p>
        <p className="mt-4 text-text-800">
          This page covers only Storable&apos;s three facility management software (FMS) products. Those are the
          lists we could check against the vendors&apos; own pages on the check date. Other software makers publish
          their own integration lists. If you run something else, read that maker&apos;s list and your gate
          maker&apos;s page directly.
        </p>
        <p className="mt-4 text-text-800">
          We have an interest in this topic, so here it is plainly. We can bridge Storable Edge and Storable Easy to
          OpenTech Alliance&apos;s INSOMNIAC® CIA and to DigiGate. Tell us your setup. You can read how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            access control hosting
          </Link>{" "}
          works. Nothing about us appears in the tables. They report only what the vendors publish.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How to read the tables</h2>
        <p className="mt-4 text-text-800">
          &quot;Listed&quot; means the product&apos;s own published list named the gate system on September 19, 2026.
          &quot;Not in the list&quot; means that list did not name it. It is not a finding that the two cannot work
          together. Where a list uses its own name for a system, or adds a condition, the cell says so in smaller
          type.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What each Storable product lists</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Table 1. Gate systems named in each Storable product&apos;s own published integration list, as checked
              on September 19, 2026.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className={th}>
                  Gate system
                </th>
                <th scope="col" className={th}>
                  Storable Edge
                </th>
                <th scope="col" className={th}>
                  Storable Easy
                </th>
                <th scope="col" className={th}>
                  Sitelink
                </th>
              </tr>
            </thead>
            <tbody>
              {SOFTWARE_ROWS.map((r) => (
                <tr key={r.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.gate}
                  </th>
                  <Cell cell={r.edge} />
                  <Cell cell={r.easy} />
                  <Cell cell={r.sitelink} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="mt-8 text-xl font-semibold">Where each column comes from</h3>
        <p className="mt-4 text-text-800">
          Storable Edge: the gate integration article in Storable Edge&apos;s help center, which carries no date. It
          names WinSen except the RSCM (Remote Site Control Module) and Platinum versions. It also names Storable
          Access Control, which it calls a native Edge solution.{" "}
          <SourceLink source={SOURCES.storableEdgeGateIntegration} />
        </p>
        <p className="mt-4 text-text-800">
          Storable Easy: the third-party gate integrations article in Storable Easy&apos;s knowledge base, which
          names eleven gate software products and carries no date.{" "}
          <SourceLink source={SOURCES.storableEasyThirdPartyGates} /> One entry is named Insomniac. The Insomniac
          article in the same gate integrations section of Storable Easy&apos;s help is about Insomniac kiosks, which
          it says talk to Storable Easy through an API. It does not mention CIA access control.{" "}
          <SourceLink source={SOURCES.storableEasyKiosks} /> So Table 1 does not count that entry as a CIA gate
          listing. If you run Storable Easy and want CIA at the gate, ask Storable what the entry covers.
        </p>
        <p className="mt-4 text-text-800">
          Sitelink: the gates and access page of the Sitelink marketplace, which names seven partners. The same page
          says Sitelink integrates with many gate and access systems and tells operators to phone for an up-to-date
          list. <SourceLink source={SOURCES.sitelinkGatesMarketplace} /> So &quot;Not in the list&quot; in
          the Sitelink column tells you less than it does in the other two.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable&apos;s own access control product</h3>
        <p className="mt-4 text-text-800">
          All three lists name Storable Access Control, Storable&apos;s own product. Its product page answers a
          question about existing gate hardware by naming nine third-party gate providers, introduced with the words
          &quot;Some of these providers include&quot;: DigiGate, DoorKing (1838 Multi-Door Access Controller),
          OpenTech CIA, PTI/StorLogix, PTI/Falcon, QuikStor, Revenue Control Systems, StorGuard and SpiderDoor. The
          page does not present that list as complete, and it does not say which Storable software each provider
          works with. <SourceLink source={SOURCES.storableAccessControl} />
        </p>

        <h3 className="mt-8 text-xl font-semibold">A listing says nothing about hardware status</h3>
        <p className="mt-4 text-text-800">
          The Storable lists are about the software side. PTI&apos;s facts page lists DigiGate and FalconXT among
          legacy products that PTI no longer sells or supports, and it gives no dates for either.{" "}
          <SourceLink source={SOURCES.ptiFacts} /> Storable Edge&apos;s and Storable Easy&apos;s lists both name
          DigiGate, and both have a PTI Falcon entry (Storable Easy&apos;s says Falcon 2000). If DigiGate or FalconXT
          is on your site, read our guides to{" "}
          <Link href="/resources/digigate-replacement" className={link}>
            replacing DigiGate
          </Link>{" "}
          and{" "}
          <Link href="/resources/falconxt-end-of-life" className={link}>
            FalconXT end of life
          </Link>
          .
        </p>

        <h2 className="mt-10 text-2xl font-semibold">What the gate makers publish</h2>
        <p className="mt-4 text-text-800">
          The other half of the check is the gate maker&apos;s own page. Table 2 shows which Storable products each
          one names, and what it says about how the connection runs. The last row is Storable&apos;s own page about
          one gate maker, SpiderDoor. Several of these pages use earlier or other names for Storable&apos;s products.
          The table gives today&apos;s name and says when a page uses a different one.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="mb-2 text-left text-sm text-text-700">
              Table 2. Storable products named on gate makers&apos; own pages, and on Storable&apos;s SpiderDoor
              page, as checked on September 19, 2026.
            </caption>
            <thead>
              <tr className="border-b border-background-300">
                <th scope="col" className={th}>
                  Page
                </th>
                <th scope="col" className={th}>
                  Storable products it names
                </th>
                <th scope="col" className={th}>
                  How it connects, if the page says
                </th>
                <th scope="col" className={th}>
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {MAKER_ROWS.map((r) => (
                <tr key={r.key} className="border-b border-background-200 align-top">
                  <th scope="row" className="py-3 pr-4 font-normal text-text-800">
                    {r.page}
                  </th>
                  <td className={td}>{r.names}</td>
                  <td className={td}>{r.how}</td>
                  <td className={td}>
                    <SourceLink source={r.source} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-text-800">
          Read the two tables together. Where both sides name a pairing, you have two independent documents: Storable
          Easy lists Janus International&apos;s Nokē system, and Janus&apos;s page shows Storable Easy under another
          name. Where only one side names it, take that as a question for the other vendor. Janus&apos;s page shows
          Storable Edge, but Storable Edge&apos;s list does not name Nokē. DoorKing names Sitelink, but the Sitelink
          marketplace does not name DoorKing. Neither is a disagreement. One document is simply silent.
        </p>
        <p className="mt-4 text-text-800">
          OpenTech Alliance&apos;s integration partners page shows logos for Sitelink, Storable Edge and Storable
          Easy, the last under another name. It does not say which OpenTech product each logo refers to, so it is
          not in Table 2 as a CIA listing. <SourceLink source={SOURCES.opentechPartners} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How the connection works, where the documents say</h2>
        <p className="mt-4 text-text-800">
          A listing tells you that a vendor names a pairing. It does not tell you what has to run, or where. These
          are the documents that say. Where a document is silent, so is this page.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Edge</h3>
        <p className="mt-4 text-text-800">
          Storable Edge&apos;s gate article says its gate software must be installed on the same computer as the
          DigiGate, DoorKing, PTI, QuikStor, Revenue Control Systems, StorGuard, SpiderDoor or WinSen gate software.
          OpenTech CIA is on the same list but is not named in that sentence, and the article does not say how CIA
          connects. The article tells you to keep your gate software and Storable Edge&apos;s gate program running
          at all times, and says Storable Edge sends gate code changes to the gate software every 5 minutes. Its
          requirements include a computer running Windows Vista, 7, 8 or 10 with .NET Framework 3.5.{" "}
          <SourceLink source={SOURCES.storableEdgeGateIntegration} /> If that computer is getting old, our guide to{" "}
          <Link href="/resources/self-storage-gate-server" className={link}>
            whether you still need a gate PC
          </Link>{" "}
          covers what to weigh.
        </p>
        <p className="mt-4 text-text-800">
          PTI describes a second route for Storable Edge. In a release datelined March 16, 2026, on a page PTI
          dates March 13, 2026, PTI says it and Storable announced a partnership to deliver a new integration
          between PTI&apos;s StorLogix Cloud and Storable Edge, calls the connection webhook-based, and says the
          integration &quot;eliminates the need for on-site syncing tools&quot;.{" "}
          <SourceLink source={SOURCES.ptiStorableRelease} />{" "}
          PTI&apos;s integrations table has two rows for Storable Edge: one marked BridgeApp, and a webhooks row
          marked API. <SourceLink source={SOURCES.ptiIntegrationsTable} /> Storable Edge&apos;s undated help article
          does not mention the webhook route. If you run PTI with Storable Edge, ask both vendors which route your
          site would use.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Storable Easy</h3>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s gate list says setup starts once one of the listed gate programs is downloaded on your
          computer. Storable&apos;s support team then connects it to Storable Easy.{" "}
          <SourceLink source={SOURCES.storableEasyThirdPartyGates} /> Its PTI StorLogix guide starts with installing
          the gate sync program. It says two later steps, setting up the StorLogix interface and selecting PTI as the
          gate system, can be skipped with the cloud-based version of PTI. It does not mark the first step as
          optional. <SourceLink source={SOURCES.storableEasyStorLogix} />
        </p>
        <p className="mt-4 text-text-800">
          Storable Easy&apos;s Nokē article describes a different route. It says codes saved in the gate key field are
          sent to Nokē through webhooks. <SourceLink source={SOURCES.storableEasyNoke} /> If codes stop matching
          between your software and the gate, our{" "}
          <Link href="/resources/gate-not-syncing" className={link}>
            gate sync diagnostic guide
          </Link>{" "}
          walks through the vendors&apos; own troubleshooting documents.
        </p>

        <h3 className="mt-8 text-xl font-semibold">Sitelink</h3>
        <p className="mt-4 text-text-800">
          A few documents describe how specific Sitelink pairings connect. Storable&apos;s SpiderDoor integration
          page says Sitelink and SpiderDoor communicate through the cloud, and that you will no longer need a
          computer at the site. <SourceLink source={SOURCES.storableSpiderDoor} /> OpenTech Alliance announced in
          September 2018 that Sitelink was the first vendor to integrate with the INSOMNIAC CIA API.{" "}
          <SourceLink source={SOURCES.opentechSitelink2018} /> PTI&apos;s integrations table marks Sitelink under the
          BridgeApp, not the API. <SourceLink source={SOURCES.ptiIntegrationsTable} /> None of these documents covers
          Sitelink&apos;s other gate pairings.
        </p>

        <h3 className="mt-8 text-xl font-semibold">PTI&apos;s two routes</h3>
        <p className="mt-4 text-text-800">
          PTI&apos;s StorLogix Cloud manual says there are two ways to connect facility software to StorLogix Cloud:
          a cloud-to-cloud API integration or the BridgeApp. It says the BridgeApp should be installed on the PC or
          server that also houses your facility software client. PTI adds, &quot;This does not have to be at the actual site
          itself,&quot; though it says that usually is the case. If your software already has a cloud integration
          with StorLogix Cloud, the manual says the BridgeApp is unnecessary.{" "}
          <SourceLink source={SOURCES.ptiCloudManual} />
        </p>
        <p className="mt-4 text-text-800">
          PTI&apos;s table puts Sitelink and Storable Easy under the BridgeApp column and not the API column.{" "}
          <SourceLink source={SOURCES.ptiIntegrationsTable} /> The table describes software pairings, not any one
          site. Ask PTI which route your site would use, and where the software for it would run.
        </p>

        <h3 className="mt-8 text-xl font-semibold">DoorKing</h3>
        <p className="mt-4 text-text-800">
          DoorKing&apos;s self-storage page lists all three Storable products, two of them under other names, for its
          Remote Account Manager, which it describes as Windows software that runs on a host personal computer. Its
          list for DoorKing Cloud Software names one self-storage application only, and it is none of the three
          Storable products.{" "}
          <SourceLink source={SOURCES.doorkingSelfStorage} />
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Questions to ask both vendors</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-text-800">
          <li>
            Is my exact gate system, model and version on your current list? Storable Edge&apos;s list shows why the
            version matters: it names WinSen, except two versions of it.
          </li>
          <li>
            How does the connection run: software on a computer, or cloud to cloud? If it is a computer, which one,
            and does it have to stay on?
          </li>
          <li>How often do changes made in the software reach the gate?</li>
          <li>Does the gate maker still sell and support the hardware on my site?</li>
          <li>Can you give me the answer in writing, with the date?</li>
        </ol>

        <h2 className="mt-10 text-2xl font-semibold">What to do next</h2>
        <p className="mt-4 text-text-800">
          If your software and your gate maker both name each other and nothing on your site is on a legacy list,
          you may not need to change anything yet. Confirm the details with both vendors and note the date you
          asked.
        </p>
        <p className="mt-4 text-text-800">
          If something does need to change, you have more than one path. Storable offers its own access control
          product, and all three Storable lists name it. Storable Edge operators on PTI can ask both vendors about
          the webhook route PTI describes. Gate makers publish their own software lists, as Table 2 shows, so you can
          check a new gate against your software before you buy it.
        </p>
        <p className="mt-4 text-text-800">
          If the part you want to change is the computer your gate depends on, this is how our service handles it.
          The office PC&apos;s job moves to the cloud. A small bridge stays at the site to talk to your controllers.
          Tell us what is on site. We will tell you plainly whether we can work with it as it is, and what replacing
          it would involve if not. Pricing depends on how many facilities you run and what hardware is on site. See
          how our{" "}
          <Link href="/solutions/access-control-hosting" className={link}>
            access control hosting
          </Link>{" "}
          works. If you are reviewing your facility website at the same time, see our{" "}
          <Link href="/solutions/web-hosting" className={link}>
            web hosting
          </Link>{" "}
          too.
        </p>

        <SourceList
          sources={[
            SOURCES.storableEdgeGateIntegration,
            SOURCES.storableEasyThirdPartyGates,
            SOURCES.storableEasyKiosks,
            SOURCES.sitelinkGatesMarketplace,
            SOURCES.storableAccessControl,
            SOURCES.ptiFacts,
            SOURCES.ptiIntegrationsTable,
            SOURCES.opentechSitelink2018,
            SOURCES.doorkingSelfStorage,
            SOURCES.janusNokePartners,
            SOURCES.storguardPartners,
            SOURCES.sentinelHardware,
            SOURCES.spiderdoorAccessControl,
            SOURCES.storableSpiderDoor,
            SOURCES.opentechPartners,
            SOURCES.ptiStorableRelease,
            SOURCES.storableEasyStorLogix,
            SOURCES.storableEasyNoke,
            SOURCES.ptiCloudManual,
          ]}
        />
        <p className="mt-8 text-sm text-text-700">
          We are not affiliated with Storable, PTI Security Systems, OpenTech Alliance, DoorKing, Janus International,
          StorGuard, Sentinel Systems, SpiderDoor, QuikStor, Revenue Control Systems, Eight IO, BearBox or Microsoft.
          Product names are the property of their owners.
        </p>
      </article>

      <CtaBand
        heading="Check your software and gate pairing"
        text="Tell us which facility software and gate system each of your sites runs."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/demo", label: "Request a demo" }}
      />
    </>
  );
}
