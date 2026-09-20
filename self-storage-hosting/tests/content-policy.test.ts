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
// exempted from those two patterns only -- not from any of the others, which
// it must obey like every other file (spec-driven correction: a blanket
// exemption would also hide a brand-name or unsubstantiated-claim violation
// inside this exact file, which article and event data pass through).
const SCHEMA = path.join("lib", "schema.ts");

// The one file allowed to state outage behaviour in words. Every page renders
// its OUTAGE_BEHAVIOR constant instead of paraphrasing it.
const CLAIMS = path.join("lib", "claims.ts");

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
    // `audit` is deliberately NOT matched bare: /legal/accessibility says its
    // statement rests on "our own checks, not an outside audit", which denies
    // a claim rather than making one.
    /encryption at rest|encrypted at rest|\bRBAC\b|role-based access|roles and permissions|audit (?:exports?|logs?|trails?)|scoped tokens|\bSSO\b|single sign-on|bank-level|enterprise-grade|\bSOC ?2\b|ISO ?27001|signed device tokens?|key rotation|per-facility isolation/i,
    "Unsubstantiated security claim (spec 14B) - only TLS is verified",
  ],
  [/\bPMS\b/, 'Use "FMS" — the industry term is facility management software'],
  [/\breal[- ]time\b/i, 'Spec 13: remove "real time" or qualify it with a measured figure'],
  [
    // Spec 14 D3 is open: say nothing about admin changes made during an
    // outage. Paraphrases drift towards exactly that ("changes resync").
    /\bkeeps? enforcing\b|last-known rules|\bre-?sync/i,
    "Outage wording: render OUTAGE_BEHAVIOR from lib/claims.ts instead of paraphrasing it (spec 14 D3)",
    CLAIMS,
  ],
  [/99\.95\s*%/, "Unsubstantiated uptime claim — spec D3"],
  [/100\+\s*(managed\s*)?sites?/i, "Unsubstantiated scale claim — spec D3"],
  [/\d\s*[–-]\s*\d\s*seconds/, "Unsubstantiated latency claim — spec D3"],
  [/<\s*\d+\s*ms/i, "Unsubstantiated latency claim — spec D3"],
  [
    // Spec 3.1 took these from trade press, and PTI's own pages publish none
    // of them (Plan 2 Appendix A.3). Spec 11 forbids a third-party
    // end-of-support date the vendor has not stated itself. Windows 10's
    // October 14, 2025 is Microsoft's own date and does not match.
    /\b(?:Oct(?:ober)?\.?\s+1,?\s+(?:2025|2023)|1\s+Oct(?:ober)?\.?\s+(?:2025|2023)|Dec(?:ember)?\.?\s+1,?\s+2025|1\s+Dec(?:ember)?\.?\s+2025|2025-10-01|2025-12-01|2023-10-01|10\/0?1\/(?:2025|2023)|12\/0?1\/2025)\b/i,
    "PTI publishes no end-of-support dates for these products — spec 11 guardrail, Plan 2 Appendix A.3",
  ],
  [
    // Spec 3.2(2)'s on-site PC wording failed verification. The two-minute
    // figure comes only from a third party, never from Storable or PTI.
    /\bSystem Controller PC\b|\bdesignated PC\b|\bevery (?:2|two) minutes\b/i,
    "Unverified on-site PC wording from spec 3.2(2) — use Plan 2 Appendix A.4 instead",
  ],
  [
    // PTI's pages list legacy products and name CloudController as the
    // go-forward controller. They do not say PTI moves anyone onto it.
    /\btransition(?:s|ed|ing)?\b[^.]{0,60}\bcustomers\b/i,
    'Do not say PTI "transitions" customers — Plan 2 Appendix A.3',
  ],
  [/"FAQPage"|'FAQPage'/, "FAQ rich results were retired 2026-05-07 — spec 7.2", SCHEMA],
  [/aggregateRating/, "Requires review data we do not have — spec 7.2", SCHEMA],
];

// A .tsx page reduced to the prose a reader sees, so a rule can reason about
// sentences instead of about source. Comments go first; then JSX tags, which
// carry every `<SourceLink source={SOURCES.x} />` away with them, so a
// `SOURCES.x` reference can neither break a sentence in two nor push the rest
// of one out of reach; then the JSX expression containers left over, such as
// {" "} and {link}; then HTML entities; then whitespace. Two brace passes
// handle one level of nesting, which is all these pages use in running text.
export function prose(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/&apos;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

// The sentence of `text` containing the character at `at`, and the part of it
// that comes before that character. A sentence ends at . ! or ? followed by
// whitespace and a capital, so neither "Oct. 12" nor a decimal nor an
// abbreviation mid-sentence splits one.
export function sentenceAt(text: string, at: number): { sentence: string; before: string } {
  const boundaries = [...text.slice(0, at).matchAll(/[.!?]\s+(?=[A-Z])/g)];
  const lastEnd = boundaries.at(-1);
  const start = lastEnd === undefined ? 0 : lastEnd.index + lastEnd[0].length;
  const after = text.slice(at);
  const endMatch = /[.!?](?:\s+(?=[A-Z])|\s*$)/.exec(after);
  const end = at + (endMatch === null ? after.length : endMatch.index + 1);
  return { sentence: text.slice(start, end), before: text.slice(start, at) };
}

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
  // instead of reporting every row above as a vacuous pass.
  it("actually walked real files", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(files.map((f) => f.file)).toContain(SCHEMA);
  });

  // Microsoft runs two Extended Security Updates programmes for Windows 10 on
  // different terms, and October 12, 2027 is the consumer one's end date. No
  // row above can catch this: the date is not forbidden, only detaching it
  // from the consumer programme is. Move it onto the commercial programme and
  // every gate stays green while the site states a third party's support
  // terms wrongly -- the most expensive kind of error this site can make.
  //
  // What is checked is a property of the sentence, not a character distance:
  // in the sentence that states the date, the last programme named before the
  // date must be the consumer one. An earlier version measured a 240-character
  // window ending at the date and forbade "commercial" anywhere inside it.
  // That passed only because the page happens to put the commercial clause
  // AFTER the date; reordering the two clauses into a factually identical
  // sentence failed it, one more <SourceLink/> inside the sentence would have
  // pushed the scoping clause out of the window, and reformatting the date
  // would have slipped past it entirely. A guard that fires on a correct edit
  // teaches people to delete guards.
  it("keeps the Windows 10 ESU date scoped to Microsoft's consumer programme", () => {
    // The date in the forms a writer might reasonably reach for, so
    // reformatting it cannot make the rule quietly stop applying.
    const ESU_DATE = /\b(?:Oct(?:ober)?\.? 12,? 2027|12 Oct(?:ober)?\.?,? 2027|2027-10-12|10\/12\/2027)\b/gi;
    const ESU_PROGRAMME = /Extended Security Updates|\bESU\b/i;
    const PROGRAMME = /\b(consumer|commercial)\b/gi;

    const bad: string[] = [];
    let checked = 0;
    for (const f of files) {
      const text = prose(f.text);
      for (const m of text.matchAll(ESU_DATE)) {
        checked++;
        const { sentence, before } = sentenceAt(text, m.index);
        const named = [...before.matchAll(PROGRAMME)].map((p) => p[1].toLowerCase());
        const last = named[named.length - 1];
        if (!ESU_PROGRAMME.test(sentence)) {
          bad.push(`${f.file}: "${m[0]}" is not in a sentence that names the Extended Security Updates programme`);
        } else if (last === undefined) {
          bad.push(`${f.file}: "${m[0]}" names no programme -- say whose ESU programme runs to that date`);
        } else if (last !== "consumer") {
          bad.push(
            `${f.file}: "${m[0]}" reads as the ${last} programme's date; the last programme named before it must be the consumer one`
          );
        }
      }
    }
    // Without this the rule passes on a site that never states the date at
    // all, which is exactly how a guard ships green while asserting nothing.
    expect(
      checked,
      "no file states the Windows 10 consumer ESU end date; delete this guard or fix the scan"
    ).toBeGreaterThan(0);
    expect(bad, bad.join("; ")).toEqual([]);
  });

  it("renders the outage wording from lib/claims.ts", () => {
    // Keeps the row above honest: if no page used the constant, the row
    // would pass just as well on a site that had dropped the answer entirely.
    // A render site, not a mention: imports and comments name the constant too.
    const RENDERS_OUTAGE = /\{OUTAGE_BEHAVIOR\}|\ba:\s*OUTAGE_BEHAVIOR\b/;
    const users = files
      .filter((f) => f.file !== CLAIMS && RENDERS_OUTAGE.test(f.text))
      .map((f) => f.file);
    // The home page, /about-us and /solutions/access-control-hosting.
    expect(users.length, `OUTAGE_BEHAVIOR is rendered by: ${users.join(", ")}`).toBeGreaterThanOrEqual(3);
  });
});
