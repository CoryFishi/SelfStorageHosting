import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { walkFrom } from "./helpers/walk";

const DIRS = ["app", "components", "lib"];

const files = DIRS.flatMap((d) => walkFrom(d)).map((f) => ({
  file: path.relative(path.resolve(__dirname, ".."), f),
  text: readFileSync(f, "utf8"),
}));

// lib/schema.ts lists "FAQPage" and "aggregateRating" inside its own
// blocklist. It enforces those two rules rather than breaking them, so it is
// exempted from those two patterns only -- not from the other eleven, which
// it must obey like every other file (spec-driven correction: a blanket
// exemption would also hide a brand-name or unsubstantiated-claim violation
// inside this exact file, which Plan 3 will feed article/event data through).
const SCHEMA = path.join("lib", "schema.ts");

const FORBIDDEN: [RegExp, string, string?][] = [
  [/\bStorEdge\b/, 'Use "Storable Edge" (renamed 2025-03-06)'],
  [/\bDigi Gate\b/, 'Use "DigiGate" (one word)'],
  [/\bEasy Storage Solutions\b/, 'Use "Storable Easy" (renamed 2025-03-06)'],
  [/\bStor-Guard\b/, 'Use "StorGuard" (one word)'],
  [/\bSiteLink\b/, 'Use "Sitelink by Storable"'],
  [
    // Both the jargon and the plain-English form of every claim. The jargon-only
    // version of this pattern let two of them ship on the home page, because
    // marketing copy never says "RBAC" -- it says it in ordinary words.
    // `audit` is deliberately NOT matched bare: the approved security answer ends
    // "...isolation and audit - ask us", which is an invitation, not a claim.
    /encryption at rest|encrypted at rest|\bRBAC\b|role-based access|roles and permissions|audit (?:exports?|logs?|trails?)|scoped tokens|\bSSO\b|single sign-on|bank-level|enterprise-grade|\bSOC ?2\b|ISO ?27001|signed device tokens?|key rotation|per-facility isolation/i,
    "Unsubstantiated security claim (spec 14B) - only TLS is verified",
  ],
  [/\bPMS\b/, 'Use "FMS" — the industry term is facility management software'],
  [/\breal[- ]time\b/i, 'Spec 13: remove "real time" or qualify it with a measured figure'],
  [/99\.95\s*%/, "Unsubstantiated uptime claim — spec D3"],
  [/100\+\s*(managed\s*)?sites?/i, "Unsubstantiated scale claim — spec D3"],
  [/\d\s*[–-]\s*\d\s*seconds/, "Unsubstantiated latency claim — spec D3"],
  [/<\s*\d+\s*ms/i, "Unsubstantiated latency claim — spec D3"],
  [/"FAQPage"|'FAQPage'/, "FAQ rich results were retired 2026-05-07 — spec 7.2", SCHEMA],
  [/aggregateRating/, "Requires review data we do not have — spec 7.2", SCHEMA],
];

describe("content policy", () => {
  it.each(FORBIDDEN)("never contains %s", (pattern, why, exempt) => {
    const offenders = files
      .filter((f) => f.file !== exempt && pattern.test(f.text))
      .map((f) => f.file);
    expect(offenders, `${why}. Found in: ${offenders.join(", ")}`).toEqual([]);
  });

  // Every case above is "no file matches a bad pattern," which also passes
  // when `files` is empty -- e.g. if DIRS pointed at the wrong root, or
  // walkFrom's directory resolution silently broke. Assert the walk actually
  // found something, and something specific, so a broken walk fails loudly
  // instead of reporting thirteen vacuous passes.
  it("actually walked real files", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(files.map((f) => f.file)).toContain(SCHEMA);
  });
});
