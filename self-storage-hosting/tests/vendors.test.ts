import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { VENDORS } from "@/lib/vendors";
import { PKG_ROOT } from "./helpers/walk";
import { pageFiles, pageMetaArg } from "./helpers/pages";

// Every vendor, company and product name that appears on /support, one word
// each. Spec D8: none may appear in the page's title, description or h1.
const WATCHLIST = [
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
];

// Lower-cased words. Splitting on anything that is not a letter or a digit
// keeps "Nokē" whole, where a \b-bounded regex would not match it at all.
const words = (s: string) => new Set(s.toLowerCase().split(/[^a-z0-9ē]+/).filter(Boolean));

// Words that show up next to a brand name in `company`/`products` but are not
// themselves a name: generic company-suffix words, connectors and generic
// product-line words. None of these needs a watchlist entry.
const GENERIC = new Set([
  "security",
  "systems",
  "cloud",
  "and",
  "alliance",
  "cia",
  "by",
  "edge",
  "easy",
  "any",
  "other",
  "product",
  "products",
  "international",
  "smart",
  "entry",
]);

function supportSource(): string {
  const file = pageFiles().get("/support");
  expect(file, "/support has no page.tsx").toBeDefined();
  return readFileSync(file!, "utf8");
}

// Matches a phone number in any of the shapes vendors' own pages use:
// "(800) 555-0100", "(800)555-0100", "800-555-0100", "800.555.0100",
// "800–555–0100" (en dash) and the bare digit run "8005550100". Every
// separator between the three digit groups is optional independently, and
// the parenthesised area code is optional, so this also matches a plain
// 10-digit run with no punctuation at all.
const PHONE = /\(?\b\d{3}\)?[\s.\-–]?\d{3}[\s.\-–]?\d{4}\b/g;

describe("vendor directory", () => {
  it("lists exactly the Appendix A.2 vendors and support URLs", () => {
    // Pins company and url only, not products: a later task's probe edits a
    // products string, and that must not also break this guard.
    expect(VENDORS.map((v) => [v.company, v.url])).toEqual([
      ["PTI Security Systems", "https://www.ptisecurity.com/us/en/get_support"],
      ["OpenTech Alliance", "https://opentechalliance.com/support/"],
      ["Storable", "https://support.sitelink.com/"],
      ["Storable", "https://help.storedge.com/"],
      ["Storable", "https://www.storageunitsoftware.com/support/"],
      ["Storable", "https://www.storable.com/support/"],
      ["Janus International", "https://www.janusintl.com/knowledge"],
      ["DoorKing", "https://www.doorking.com/tech-support/"],
    ]);
  });

  it.each(VENDORS.map((v) => [v.products, v] as const))(
    "%s links over https with a real check date",
    (_name, v) => {
      expect(new URL(v.url).protocol).toBe("https:");
      expect(v.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Round-trips only for a real calendar date: 2026-02-30 comes back as 03-02.
      expect(new Date(`${v.verifiedOn}T00:00:00Z`).toISOString().slice(0, 10)).toBe(v.verifiedOn);
      expect(
        v.verifiedOn <= new Date().toISOString().slice(0, 10),
        `${v.company} (${v.products}) has a verifiedOn in the future: ${v.verifiedOn}`
      ).toBe(true);
      expect(v.company.trim()).not.toBe("");
      expect(v.products.trim()).not.toBe("");
    }
  );

  it("has every vendor and product name on the watchlist", () => {
    // A vendor or product added to VENDORS without a watchlist entry could
    // slip its name into the /support title unnoticed. Checking company alone
    // missed a product-only name such as "SpareFoot".
    const listed = new Set(WATCHLIST.map((w) => w.toLowerCase()));
    const missing = VENDORS.flatMap((v) =>
      [...words(`${v.company} ${v.products}`)].filter((w) => !GENERIC.has(w) && !listed.has(w))
    );
    expect(missing, `add these to WATCHLIST: ${missing.join(", ")}`).toEqual([]);
  });

  it("keeps each watchlist entry to one word", () => {
    // The watchlist is matched one token at a time (see "has every vendor and
    // product name on the watchlist" and the title/description/h1 check
    // below). A multi-word entry could never match a single token and would
    // silently stop guarding anything.
    const multiWord = WATCHLIST.filter((n) => words(n).size !== 1);
    expect(multiWord, `watchlist entries must be exactly one word: ${multiWord.join(", ")}`).toEqual([]);
  });

  it("publishes no phone numbers", () => {
    const supportFile = pageFiles().get("/support");
    expect(supportFile, "/support has no page.tsx").toBeDefined();
    const files: [string, string][] = [
      [path.join(PKG_ROOT, "lib", "vendors.ts"), "lib/vendors.ts"],
      [supportFile!, "app/(marketing)/support/page.tsx"],
    ];
    for (const [filePath, label] of files) {
      const text = readFileSync(filePath, "utf8");
      const phones = text.match(PHONE) ?? [];
      expect(phones, `phone numbers found in ${label}: ${phones.join(", ")}`).toEqual([]);
      expect(text.includes("tel:"), `${label} must not contain a "tel:" link`).toBe(false);
    }
  });

  it("keeps vendor names out of the /support title, description and h1", () => {
    const src = supportSource();
    const meta = pageMetaArg(src);
    const h1 = src.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    expect(meta, "/support must call pageMeta").not.toBeNull();
    expect(h1, "/support must have an h1").toBeDefined();
    const seen = words(`${meta} ${h1}`);
    const named = WATCHLIST.filter((n) => seen.has(n.toLowerCase()));
    expect(named, `/support names a vendor in its title, description or h1: ${named.join(", ")}`).toEqual([]);
  });
});
