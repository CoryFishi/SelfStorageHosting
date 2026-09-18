// The dark chrome pairing is contrast-critical. `text-50` on `primary-700` is
// 5.79:1 and passes WCAG AA; on `primary-600` the same pair is 3.62:1 and fails.
// TopBar and MainNav both render this chrome, so it lives here rather than as
// two string literals that can drift apart in a later edit.
export const CHROME = "w-full border-b border-background-500 bg-primary-700 text-text-50";

// The chrome's focus ring now lives in components/ui/focus.ts alongside its
// light-surface counterpart, so every page can pick the right one instead of
// inlining a ring string. Re-exported here so this stays a one-line change
// for TopBar and MainNav, which already import FOCUS_RING from this module.
export { FOCUS_RING } from "@/components/ui/focus";
