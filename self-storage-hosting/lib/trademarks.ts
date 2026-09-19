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
    marks: ["PTI", "StorLogix", "StorLogix Cloud", "FalconXT", "CloudController", "DigiGate"],
  },
  { owner: "OpenTech Alliance", marks: ["OpenTech Alliance", "INSOMNIAC® CIA"] },
  { owner: "Storable", marks: ["Storable", "Sitelink by Storable", "Storable Edge", "Storable Easy"] },
  { owner: "Janus International", marks: ["Janus", "Nokē", "Nokē Smart Entry"] },
  { owner: "DoorKing", marks: ["DoorKing", "DKS"] },
  { owner: "Netlify", marks: ["Netlify"] },
  { owner: "Cloudflare", marks: ["Cloudflare"] },
  { owner: "Resend", marks: ["Resend"] },
];
