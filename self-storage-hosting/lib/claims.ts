// Claims the owner approved word for word. Pages render these constants
// rather than paraphrasing them, and tests/content-policy.test.ts fails on a
// paraphrase anywhere else.
//
// Outage behaviour (spec §6.1(4)). It says nothing about admin changes made
// during an outage, because spec §14 D3 is still open. Never make it the
// opening line of a page or section.
export const OUTAGE_BEHAVIOR =
  "Controllers keep enforcing the last rules they received. Site events recorded during an outage are sent up when the connection returns.";

// The four hardware categories /about-us ("What we integrate") and
// /solutions/access-control-hosting ("Hardware we work with") both render.
// One array so the two pages cannot drift apart the way they had: the
// smart-lock line once claimed "telemetry" on one page and not the other.
// Nothing here is vendor- or model-specific, so neither page cites a source.
export const HARDWARE_INTEGRATIONS = [
  {
    name: "Gate controllers",
    desc: "Tenant access, schedules and zones, with remote open, lockout and suspend.",
  },
  {
    name: "Keypads and readers",
    desc: "PIN, card or mobile credentials, with time profiles and holiday rules.",
  },
  { name: "Smart locks", desc: "Unit-level control, with a record of every action." },
  {
    name: "Door alarms and sensors",
    desc: "Alarms, motion sensors and battery monitoring, with muted and maintenance modes.",
  },
] as const;

// The four FMS-to-access-control bridges /about-us and
// /solutions/access-control-hosting both render. Spec §14 F (whether each
// bridge may be named as a live integration) is still open, so both pages
// wrap this in the same "We can bridge {from} to {to}. Tell us your setup."
// capability-offer wording rather than a status claim.
export const FMS_BRIDGES = [
  { from: "Storable Edge", to: "INSOMNIAC CIA" },
  { from: "Storable Edge", to: "DigiGate" },
  { from: "Storable Easy", to: "INSOMNIAC CIA" },
  { from: "Storable Easy", to: "DigiGate" },
] as const;
