// The date each legal page's wording last changed, shown at the top of that
// page. Change a page's date in the same commit that changes its text.
//
// These pages are drafts of the owner's policies, not legal advice. The owner
// or counsel must still review them (spec 6.11, 14 C). PR #1 merged before
// that review, so it is overdue: see docs/deploy-checklist.md.
export const LEGAL_UPDATED = {
  privacy: "2026-09-19",
  terms: "2026-09-19",
  trademarks: "2026-09-19",
  accessibility: "2026-09-19",
} as const;
