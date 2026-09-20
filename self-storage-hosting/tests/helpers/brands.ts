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
  "VP",
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
