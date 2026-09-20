// Third-party company, product and service names this site prints, one word
// each. Two guards use this list:
//   - tests/vendors.test.ts keeps them out of the /support title, description
//     and h1 (spec D8);
//   - tests/trademarks.test.ts requires every one the site uses to be listed
//     on /legal/trademarks.
// Add a name here the first time the site mentions a new company or product.
// A name missing from this list is invisible to both guards.
export const WATCHLIST = [
  "PTI",
  "StorLogix",
  "FalconXT",
  "CloudController",
  "DigiGate",
  "OpenTech",
  "INSOMNIAC",
  "Storable",
  "Sitelink",
  "Janus",
  "Nokē",
  "Noke",
  "DoorKing",
  "DKS",
  "BridgeApp",
  "Falcon",
  "DigiTech",
  "Apex",
  "StorGuard",
  "Sentinel",
  "WinSen",
  "SpiderDoor",
  "QuikStor",
  "Revenue",
  "Eight",
  "BearBox",
  "Cubby",
  "Microsoft",
  "Windows",
  "Netlify",
  "Cloudflare",
  "Resend",
];

// Lower-cased words. Splitting on anything that is not a letter or a digit
// keeps "Nokē" whole, where a \b-bounded regex would not match it at all.
export const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9ē]+/).filter(Boolean));

// Names that /legal/trademarks must spell out in full, checked as whole
// phrases rather than word by word.
//
// WATCHLIST above cannot do this job. tests/vendors.test.ts matches it one
// token at a time -- it has to, because the same list also keeps vendor names
// out of the /support title -- and its "keeps each watchlist entry to one
// word" case hard-fails any multi-word entry. So tests/trademarks.test.ts
// compares word sets, and a word set cannot tell a name from its parts:
//
//   - every word of "VP Standard Series" is already in the pooled set via
//     other entries, so deleting that mark changes nothing it can see;
//   - "Windows" looks listed for as long as DoorKing's "Windows Account
//     Manager" is listed, even with Microsoft's own "Windows" mark deleted.
//
// Every name here must appear verbatim as an owner, a mark, or an entry of
// NAMES_WITHOUT_CONFIRMED_OWNER in lib/trademarks.ts -- and must actually be
// printed somewhere on the site, so the list cannot go stale and start
// passing vacuously. Add a name the first time a page prints it in full.
//
// "VP Standard Series" lives here rather than on WATCHLIST for a second
// reason: "VP" also means Vice President, and a WATCHLIST token is both
// forced onto /legal/trademarks and banned from the /support title.
export const VERBATIM_NAMES = [
  "PTI Security Systems",
  "StorLogix Cloud",
  "StorLogix Cloud Adaptor",
  "StorLogix Desktop",
  "Falcon 2000",
  "VP Standard Series",
  "OpenTech Alliance",
  "INSOMNIAC® CIA",
  "Sitelink by Storable",
  "Storable Edge",
  "Storable Easy",
  "Storable Access Control",
  "Janus International",
  "Nokē Smart Entry",
  "Remote Account Manager",
  "Windows Account Manager",
  "Cloud Account Manager",
  "Sentinel Systems",
  "Windows",
  "Revenue Control Systems",
  "Eight IO",
];

// Who owns which mark, written out here independently of lib/trademarks.ts.
//
// Listing a name is not the same as attributing it correctly, and nothing was
// checking the attribution: moving "Storable Access Control" from Storable to
// DoorKing left all twenty-four trademark and legal cases green while
// /legal/trademarks published a false ownership claim. A register derived from
// lib/trademarks.ts could not catch that -- it would move with the mark. This
// one is written from the vendors' own pages, the same sources lib/sources.ts
// cites, so the two have to agree.
//
// What is pinned: every mark that is not its owner's own name, spelled
// identically. What is not: a mark that IS its owner's name, such as
// StorGuard's "StorGuard" or Netlify's "Netlify" -- there is nothing to get
// wrong while the two strings match, and the moment such a mark is moved under
// a different owner the pair stops matching and has to be pinned like any
// other. tests/trademarks.test.ts enforces that coverage rule, so this list
// cannot fall behind lib/trademarks.ts without a test saying so.
export const MARK_OWNERS: [mark: string, owner: string][] = [
  ["PTI", "PTI Security Systems"],
  ["StorLogix", "PTI Security Systems"],
  ["StorLogix Cloud", "PTI Security Systems"],
  ["StorLogix Desktop", "PTI Security Systems"],
  ["StorLogix Cloud Adaptor", "PTI Security Systems"],
  ["BridgeApp", "PTI Security Systems"],
  ["FalconXT", "PTI Security Systems"],
  ["Falcon 2000", "PTI Security Systems"],
  ["CloudController", "PTI Security Systems"],
  ["DigiGate", "PTI Security Systems"],
  ["DigiTech", "PTI Security Systems"],
  ["Apex", "PTI Security Systems"],
  ["VP Standard Series", "PTI Security Systems"],
  ["INSOMNIAC® CIA", "OpenTech Alliance"],
  ["Sitelink by Storable", "Storable"],
  ["Storable Edge", "Storable"],
  ["Storable Easy", "Storable"],
  ["Storable Access Control", "Storable"],
  ["Janus", "Janus International"],
  ["Nokē", "Janus International"],
  ["Nokē Smart Entry", "Janus International"],
  ["DKS", "DoorKing"],
  ["Remote Account Manager", "DoorKing"],
  ["Windows Account Manager", "DoorKing"],
  ["Cloud Account Manager", "DoorKing"],
  ["Winsen", "Sentinel Systems"],
  ["Windows", "Microsoft"],
];
