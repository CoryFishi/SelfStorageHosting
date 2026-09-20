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
