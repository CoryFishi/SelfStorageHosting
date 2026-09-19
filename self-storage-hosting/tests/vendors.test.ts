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

function supportSource(): string {
  const file = pageFiles().get("/support");
  expect(file, "/support has no page.tsx").toBeDefined();
  return readFileSync(file!, "utf8");
}

describe("vendor directory", () => {
  it("lists every vendor in Appendix A.2", () => {
    expect(VENDORS.length).toBeGreaterThanOrEqual(8);
  });

  it.each(VENDORS.map((v) => [v.products, v] as const))(
    "%s links over https with a real check date",
    (_name, v) => {
      expect(new URL(v.url).protocol).toBe("https:");
      expect(v.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      // Round-trips only for a real calendar date: 2026-02-30 comes back as 03-02.
      expect(new Date(`${v.verifiedOn}T00:00:00Z`).toISOString().slice(0, 10)).toBe(v.verifiedOn);
      expect(v.company.trim()).not.toBe("");
      expect(v.products.trim()).not.toBe("");
    }
  );

  it("has every vendor's company on the watchlist", () => {
    // A vendor added to VENDORS without a watchlist entry could slip its name
    // into the /support title unnoticed.
    const listed = new Set(WATCHLIST.map((w) => w.toLowerCase()));
    const missing = VENDORS.map((v) => v.company.split(" ")[0]).filter(
      (w) => !listed.has(w.toLowerCase())
    );
    expect(missing, `add these to WATCHLIST: ${missing.join(", ")}`).toEqual([]);
  });

  it("publishes no phone numbers", () => {
    const text = readFileSync(path.join(PKG_ROOT, "lib", "vendors.ts"), "utf8") + supportSource();
    const phones = text.match(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g) ?? [];
    expect(phones, `phone numbers found: ${phones.join(", ")}`).toEqual([]);
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
