import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { THIRD_PARTY_MARKS } from "@/lib/trademarks";
import { walkFrom } from "./helpers/walk";
import { WATCHLIST, words } from "./helpers/brands";

// Everything the site renders comes from these three directories.
const siteText = ["app", "components", "lib"]
  .flatMap((d) => walkFrom(d, /\.tsx?$/))
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

describe("/legal/trademarks", () => {
  const used = words(siteText);
  const listed = words(THIRD_PARTY_MARKS.flatMap((m) => [m.owner, ...m.marks]).join(" "));

  it("finds the names it is meant to check", () => {
    for (const w of ["digigate", "storable", "insomniac"]) {
      expect(used.has(w), `"${w}" not found in the site source`).toBe(true);
    }
  });

  it("lists every third-party name the site uses", () => {
    const missing = WATCHLIST.filter((w) => used.has(w.toLowerCase()) && !listed.has(w.toLowerCase()));
    expect(missing, `named on the site but not on /legal/trademarks: ${missing.join(", ")}`).toEqual([]);
  });

  it("names each owner without a legal suffix it has not verified", () => {
    const suffixed = THIRD_PARTY_MARKS.map((m) => m.owner).filter((o) =>
      /\b(?:LLC|Inc\.?|Incorporated|Ltd|Corp\.?|Corporation|GmbH)\b/.test(o)
    );
    expect(suffixed, `unverified legal entity names: ${suffixed.join(", ")}`).toEqual([]);
  });
});
