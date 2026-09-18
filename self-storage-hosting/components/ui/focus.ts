// Two focus rings, chosen by what sits behind the element being focused.
//
// The offset is load-bearing for both, not decorative: at
// `outline-offset-2` the ring is drawn in the gap around the element, so
// BOTH sides of the ring sit against the surrounding page/chrome background
// -- that is the pairing the ratio below is measured against. Drawn flush
// (no offset, or `outline-offset-0`) the ring would instead sit adjacent to
// the element it outlines, e.g. accent-600 against accent-500 at 1.52:1,
// which fails.
//
// `FOCUS_RING_LIGHT` is accent-600 against the light page background
// (background-50 and similar light surfaces), measured at 3.24:1 -- clears
// the 3.0:1 WCAG 1.4.11 non-text-contrast minimum.
export const FOCUS_RING_LIGHT =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600";

// `FOCUS_RING` is accent-200 against the dark chrome background
// (primary-700), measured at 4.54:1. TopBar and MainNav both render this
// ring, so it lives here rather than as string literals that can drift.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200";
