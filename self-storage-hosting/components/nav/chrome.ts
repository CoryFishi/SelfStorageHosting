// The dark chrome pairing is contrast-critical. `text-50` on `primary-700` is
// 5.79:1 and passes WCAG AA; on `primary-600` the same pair is 3.62:1 and fails.
// TopBar and MainNav both render this chrome, so it lives here rather than as
// two string literals that can drift apart in a later edit.
export const CHROME = "w-full border-b border-background-500 bg-primary-700 text-text-50";

// One focus ring for every interactive element in the chrome. Keeping it in one
// place is what stops a nav surface from quietly shipping without one -- which
// is exactly how the mobile menu's links were missed.
export const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-200";
