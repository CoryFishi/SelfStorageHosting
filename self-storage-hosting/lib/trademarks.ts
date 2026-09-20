// Third-party names this site uses, grouped by the company that owns them.
// /legal/trademarks renders this list, and tests/trademarks.test.ts fails
// when the site prints a watchlisted name that is missing here.
//
// Owners are plain company names, never with a legal suffix: their legal
// entities were not verified. No registration status is claimed for any
// mark beyond the ® its owner prints on INSOMNIAC. INSOMNIAC® keeps the ®
// its owner uses.
export type ThirdPartyMark = { owner: string; marks: string[] };

export const THIRD_PARTY_MARKS: ThirdPartyMark[] = [
  {
    owner: "PTI Security Systems",
    marks: [
      "PTI",
      "StorLogix",
      "StorLogix Cloud",
      "StorLogix Desktop",
      "StorLogix Cloud Adaptor",
      "BridgeApp",
      "FalconXT",
      "Falcon 2000",
      "CloudController",
      "DigiGate",
      "DigiTech",
      "Apex",
      "VP Standard Series",
    ],
  },
  { owner: "OpenTech Alliance", marks: ["OpenTech Alliance", "INSOMNIAC® CIA"] },
  {
    owner: "Storable",
    marks: ["Storable", "Sitelink by Storable", "Storable Edge", "Storable Easy", "Storable Access Control"],
  },
  { owner: "Janus International", marks: ["Janus", "Nokē", "Nokē Smart Entry"] },
  {
    owner: "DoorKing",
    marks: ["DoorKing", "DKS", "Remote Account Manager", "Windows Account Manager", "Cloud Account Manager"],
  },
  // Each of these four publishes its own site under this name, the name
  // lib/sources.ts gives as the publisher.
  { owner: "StorGuard", marks: ["StorGuard"] },
  // Sentinel Systems spells the product "Winsen" on its own site
  // (lib/sources.ts: sentinelHardware), including: "If you are an existing
  // Winsen customer please contact your Sentinel sales representative
  // BEFORE installing a newer version of Winsen than you are currently
  // running." Storable's own gate integration page instead spells it
  // "WinSen" (capital S) when it lists the gate software Storable Edge can
  // run alongside. Each guide keeps whichever spelling its own cited source
  // uses -- neither spelling is normalized to the other, the same policy
  // this file already follows for PTI's "StorLogix Cloud Adaptor" (whose own
  // archived PDF instead titles it "Adapter"). This row credits Sentinel
  // Systems as the owner, so its mark uses Sentinel's own spelling.
  { owner: "Sentinel Systems", marks: ["Sentinel Systems", "Winsen"] },
  { owner: "SpiderDoor", marks: ["SpiderDoor"] },
  { owner: "QuikStor", marks: ["QuikStor"] },
  // Basis: Microsoft's own page on end of support for Windows versions
  // (lib/sources.ts: microsoftWindowsEos), not a page titled "Windows".
  { owner: "Microsoft", marks: ["Windows"] },
  { owner: "Netlify", marks: ["Netlify"] },
  { owner: "Cloudflare", marks: ["Cloudflare"] },
  { owner: "Resend", marks: ["Resend"] },
];

// Product names our guides print because a vendor's own list names them
// (Storable's, Sitelink's or DoorKing's), but whose owners we found no
// first-party page for. Naming an owner here would be a guess, so
// /legal/trademarks lists them in a sentence of their own instead.
export const NAMES_WITHOUT_CONFIRMED_OWNER: string[] = [
  "Revenue Control Systems",
  "Eight IO",
  "BearBox",
  "Cubby Storage",
];
