import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NAMES_WITHOUT_CONFIRMED_OWNER, THIRD_PARTY_MARKS } from "@/lib/trademarks";
import { PKG_ROOT, walkFrom } from "./helpers/walk";
import { VERBATIM_NAMES, WATCHLIST, words } from "./helpers/brands";

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

// The same source text the word sets are built from, kept as prose instead of
// split into words, so a multi-word name can be matched whole. Whitespace is
// collapsed first: JSX wraps a long name across two lines, and "Storable
// Access\n          Control" is still the site printing "Storable Access
// Control". Lower-cased, because the site's own casing is checked elsewhere
// (lib/trademarks.ts documents the Winsen/WinSen split) and this guard is
// about whether a name is listed at all.
const siteProse = DIRS.map((d) =>
  walkFrom(d, /\.tsx?$/)
    .filter((f) => f !== TRADEMARKS_FILE)
    .map((f) => readFileSync(f, "utf8").replace(URL_PATTERN, " "))
    .join("\n")
)
  .join("\n")
  .replace(/\s+/g, " ")
  .toLowerCase();

const printsInFull = (name: string) => siteProse.includes(name.replace(/\s+/g, " ").toLowerCase());

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

  // Every owner, mark and unconfirmed name exactly as lib/trademarks.ts
  // spells it, for the two checks below. Whole strings, not words: that is
  // the whole point of them.
  const listedVerbatim = new Set(
    [...THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]), ...NAMES_WITHOUT_CONFIRMED_OWNER].map((n) =>
      n.replace(/\s+/g, " ").toLowerCase()
    )
  );

  it("finds the full-length names it is meant to check", () => {
    // Keeps the next case honest. It only asks about names the site prints,
    // so an entry the site stopped printing would sit there passing on
    // nothing. When this fails, either a page dropped the name -- delete the
    // VERBATIM_NAMES entry -- or the scan above is broken.
    const unused = VERBATIM_NAMES.filter((n) => !printsInFull(n));
    expect(
      unused,
      `VERBATIM_NAMES entries no page prints any more; remove them or fix the scan: ${unused.join(", ")}`
    ).toEqual([]);
  });

  it("lists every full-length name the site prints, spelled out in full", () => {
    // The word-set case above cannot see these: see VERBATIM_NAMES in
    // tests/helpers/brands.ts for why, and why they cannot live on WATCHLIST.
    const missing = VERBATIM_NAMES.filter(
      (n) => printsInFull(n) && !listedVerbatim.has(n.replace(/\s+/g, " ").toLowerCase())
    );
    expect(
      missing,
      `printed in full on the site but not listed in full on /legal/trademarks: ${missing.join(", ")}`
    ).toEqual([]);
  });

  it("gives every owner at least one mark of its own", () => {
    // "lists every third-party name the site uses" pools every owner and
    // every mark into one bag of words, so an owner keeps its own name in
    // that bag after its marks are emptied. Emptying Microsoft's marks drops
    // the site's attribution of Windows and leaves every other case here
    // green, because DoorKing's "Windows Account Manager" still contributes
    // the word "windows".
    const bad = THIRD_PARTY_MARKS.filter(
      (m) => m.marks.length === 0 || m.marks.some((k) => k.trim() === "") || m.owner.trim() === ""
    ).map((m) => m.owner || "(unnamed owner)");
    expect(bad, `owners listed with no mark, or with a blank name: ${bad.join(", ")}`).toEqual([]);
  });

  it("names each owner without a legal suffix it has not verified", () => {
    const suffixed = THIRD_PARTY_MARKS.map((m) => m.owner).filter((o) =>
      /\b(?:LLC|L\.L\.C\.?|Inc\.?|Incorporated|Ltd|Corp\.?|Corporation|Co\.?|Limited|LLP|PLC|GmbH)\b/.test(o)
    );
    expect(suffixed, `unverified legal entity names: ${suffixed.join(", ")}`).toEqual([]);
  });
});
