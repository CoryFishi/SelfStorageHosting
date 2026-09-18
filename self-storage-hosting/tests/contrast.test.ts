import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { walkFrom } from "./helpers/walk";

const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

function token(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]+)`));
  if (!m) throw new Error(`Token --color-${name} not found in globals.css`);
  const hex = m[1].slice(1);
  // Only 3- and 6-digit (opaque) hex are safe to measure here. A 4- or
  // 8-digit hex carries an alpha channel: luminance() reads bytes at fixed
  // offsets regardless, so an 8-digit #rrggbbaa would be silently measured
  // as fully opaque (passing at a ratio the user never actually sees) and a
  // 4-digit #rgba would yield NaN with no explanation. Fail loudly instead.
  if (hex.length !== 3 && hex.length !== 6) {
    throw new Error(
      `Token --color-${name} is ${m[1]}. This test measures opaque colours only; ` +
        `an alpha channel composites against whatever is behind it and cannot be read from the token alone.`
    );
  }
  return m[1];
}

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const PAIRS: [string, string, string, number][] = [
  ["nav and footer links", "text-50", "primary-700", 4.5],
  ["footer column headings", "accent-200", "primary-700", 4.5],
  ["nav dropdown hover", "text-50", "primary-800", 4.5],
  ["primary CTA on light", "text-950", "accent-50", 4.5],
  ["hero CTA and 404 CTA", "text-950", "accent-500", 4.5],
  ["body copy", "text-900", "background-50", 4.5],
  ["hero subhead", "text-800", "background-50", 4.5],
  // Non-text tier, WCAG 1.4.11 (3.0:1). A focus indicator is the only thing a
  // keyboard user has to tell them where they are, and it is measured against
  // the colours ADJACENT to it -- which is why every ring below is specified
  // with `outline-offset-2`. At that offset the ring sits in the gap and has
  // page background on both sides, so this one pair is the whole measurement.
  // Drawn flush (offset 0) it would instead be adjacent to the button it
  // outlines, where `accent-600` on `accent-500` is 1.52:1 and fails badly.
  ["focus ring on light surfaces", "accent-600", "background-50", 3.0],
  ["focus ring on dark chrome", "accent-200", "primary-700", 3.0],
];

describe("WCAG AA contrast", () => {
  it.each(PAIRS)("%s meets the minimum ratio", (_label, fg, bg, min) => {
    expect(ratio(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });
});

// Every source file under app/ and components/.
const sources = walkFrom("app", /\.tsx?$/).concat(walkFrom("components", /\.tsx?$/));

describe("focus indicators", () => {
  it("never disables the browser default focus ring", () => {
    // `outline-none`/`outline-hidden` with nothing compliant in its place is
    // strictly worse than leaving the UA ring alone: it removes the only
    // thing a keyboard user has. If a design genuinely needs it, the
    // replacement goes in components/ui/focus.ts and gets a row in PAIRS
    // above. Tailwind 4 (this project is on 4.3.3) spells the suppressing
    // utility `outline-hidden` -- `outline-none` now means
    // `outline-style: none` -- so both spellings are matched.
    const offenders = sources.filter((f) =>
      /(?:focus|focus-visible|focus-within):outline-(?:none|hidden)\b|\boutline-hidden\b/.test(
        readFileSync(f, "utf8")
      )
    );
    expect(offenders, `outline-none/outline-hidden found in: ${offenders.join(", ")}`).toEqual([]);
  });

  it("declares focus ring classes in exactly one module", () => {
    // components/Faq.tsx is the one documented exception: its ring is inset
    // (`outline-offset-[-2px]`) because a positive offset on that full-width
    // button draws over the accordion's divider lines and clips at its
    // rounded corners. Browser-verified; do not unify it away.
    const ALLOWED = ["components/ui/focus.ts", "components/Faq.tsx"];
    const offenders = sources.filter(
      (f) =>
        /focus-visible:outline-(?:accent|primary|secondary|text)-\d/.test(
          readFileSync(f, "utf8")
        ) && !ALLOWED.some((a) => f.split("\\").join("/").endsWith(a))
    );
    expect(
      offenders,
      `focus ring class inlined instead of imported from components/ui/focus.ts: ${offenders.join(", ")}`
    ).toEqual([]);
  });
});
