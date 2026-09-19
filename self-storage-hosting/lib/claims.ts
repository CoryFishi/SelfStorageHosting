// Claims the owner approved word for word. Pages render these constants
// rather than paraphrasing them, and tests/content-policy.test.ts fails on a
// paraphrase anywhere else.
//
// Outage behaviour (spec §6.1(4)). It says nothing about admin changes made
// during an outage, because spec §14 D3 is still open. Never make it the
// opening line of a page or section.
export const OUTAGE_BEHAVIOR =
  "Controllers keep enforcing the last rules they received. Site events recorded during an outage are sent up when the connection returns.";
