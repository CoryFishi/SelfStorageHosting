import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NAMES_WITHOUT_CONFIRMED_OWNER, THIRD_PARTY_MARKS } from "@/lib/trademarks";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
import { WATCHLIST, words } from "./helpers/brands";

// Everything the site renders comes from these three directories. lib/trademarks.ts
// is excluded from every directory's word set below: it is the list this page
// displays, not a use of a name, and leaving it in would make every name it
// contains "found" whether or not anything else on the site actually prints it.
const DIRS = ["app", "components", "lib"];
const TRADEMARKS_FILE = path.join(PKG_ROOT, "lib", "trademarks.ts");

// URLs are link targets, never printed text, so they are removed before the
// words are counted. Otherwise a vendor's URL slug (".../noke-smart-entry...")
// would count as the site printing a spelling it never shows a reader.
const URL_PATTERN = /https?:\/\/[^\s"'`)]+/g;

function wordsUnder(dir: string): Set<string> {
  const text = walkFrom(dir, /\.tsx?$/)
    .filter((f) => f !== TRADEMARKS_FILE)
    .map((f) => readFileSync(f, "utf8").replace(URL_PATTERN, " "))
    .join("\n");
  return words(text);
}

// One word set per directory, so the sanity check below can prove each
// directory is actually contributing real names, not just the union of all
// three (which would still look non-empty if one directory silently dropped
// out of the scan).
const perDir = new Map(DIRS.map((d) => [d, wordsUnder(d)] as const));

describe("/legal/trademarks", () => {
  const used = new Set<string>();
  for (const set of perDir.values()) for (const w of set) used.add(w);
  // A name counts as listed whether the page gives its owner or lists it
  // among the names whose owners we have not confirmed.
  const listed = words(
    [...THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]), ...NAMES_WITHOUT_CONFIRMED_OWNER].join(" ")
  );

  it("finds the names it is meant to check", () => {
    // Each directory this guard scans must contribute at least one real,
    // independently verifiable watchlisted name that is not simply the list
    // itself (lib/trademarks.ts is excluded above), or that directory could
    // drop out of DIRS without any test noticing.
    const checks: [string, string][] = [
      ["app", "netlify"], // the privacy page names its host
      ["components", "digigate"], // ContactForm's placeholder
      ["lib", "janus"], // lib/vendors.ts
    ];
    for (const [dir, w] of checks) {
      const has = perDir.get(dir)?.has(w) ?? false;
      expect(has, `"${w}" not found under ${dir}/`).toBe(true);
    }
  });

  it("lists every third-party name the site uses", () => {
    const missing = WATCHLIST.filter((w) => used.has(w.toLowerCase()) && !listed.has(w.toLowerCase()));
    expect(missing, `named on the site but not on /legal/trademarks: ${missing.join(", ")}`).toEqual([]);
  });

  it("names each owner without a legal suffix it has not verified", () => {
    const suffixed = THIRD_PARTY_MARKS.map((m) => m.owner).filter((o) =>
      /\b(?:LLC|L\.L\.C\.?|Inc\.?|Incorporated|Ltd|Corp\.?|Corporation|Co\.?|Limited|LLP|PLC|GmbH)\b/.test(o)
    );
    expect(suffixed, `unverified legal entity names: ${suffixed.join(", ")}`).toEqual([]);
  });
});
