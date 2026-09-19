export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  facilityCount?: string;
  fms?: string;
  gateSystem?: string;
  // Which form this came from, so /contact and Plan 2's /demo are
  // distinguishable in the inbox. Not user input - the component sets it.
  subject?: string;
  timeline?: string;
};

// The /demo form's timeline select. A value that is not on this list is
// dropped, not rejected. The select cannot produce one, so it came from a
// script, and turning away a genuine lead over a field nobody typed would be
// the wrong trade.
export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 3 months",
  "In 3–6 months",
  "Just researching",
] as const;

function timeline(v: unknown): string | undefined {
  const s = str(v);
  return (TIMELINE_OPTIONS as readonly string[]).includes(s) ? s : undefined;
}

export type ValidationResult =
  | { ok: true; value: ContactPayload }
  | { ok: false; errors: Record<string, string> };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// Secondary fields have no business being long and they flow into the outbound
// email. Truncating rather than rejecting keeps a genuine lead from being turned
// away over a field nobody reads; 200 is far above any real value.
const OPTIONAL_MAX = 200;

function opt(v: unknown): string | undefined {
  const s = str(v).slice(0, OPTIONAL_MAX);
  return s || undefined;
}

export function validateContact(input: unknown): ValidationResult {
  const raw = (input ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  // Honeypot. `website` is never shown to a person, so any value is a bot.
  if (str(raw.website)) {
    errors.website = "Rejected.";
    return { ok: false, errors };
  }

  const name = str(raw.name);
  const email = str(raw.email);
  const message = str(raw.message);

  // A demo request's qualification fields (facility count, FMS, gate system,
  // timeline) already say what the visitor wants, so the free-text box is
  // optional there. The general form has nothing else to go on.
  const isDemo = str(raw.subject) === "demo";

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 200) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";

  if (!message) {
    if (!isDemo) errors.message = "Please tell us what you need.";
  } else if (message.length > 5000) {
    errors.message = "Please keep your message under 5000 characters.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name,
      email,
      message,
      company: opt(raw.company),
      phone: opt(raw.phone),
      facilityCount: opt(raw.facilityCount),
      fms: opt(raw.fms),
      gateSystem: opt(raw.gateSystem),
      subject: opt(raw.subject),
      timeline: timeline(raw.timeline),
    },
  };
}

export type SubmitOutcome = {
  status: "sent" | "error";
  message: string;
  errors: Record<string, string>;
};

const SENT_MESSAGE = "Thanks — we have your message and will reply within one business day.";
const FIELD_ERRORS_MESSAGE = "Please check the highlighted fields.";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Only a plain object whose values are strings can drive per-field messages.
// A string, an array, or nested objects are not field errors, and treating
// them as such shows "check the highlighted fields" with nothing highlighted.
function asFieldErrors(v: unknown): Record<string, string> | null {
  if (typeof v !== "object" || v === null || Array.isArray(v)) return null;
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v)) {
    if (typeof val === "string") out[k] = val;
  }
  return Object.keys(out).length ? out : null;
}

/** Turns a /api/contact response into what the form should display. Pure. */
export function interpretResponse(ok: boolean, body: unknown): SubmitOutcome {
  if (ok) return { status: "sent", message: SENT_MESSAGE, errors: {} };

  const b = (body ?? {}) as Record<string, unknown>;
  const errors = asFieldErrors(b.errors);
  if (errors) return { status: "error", message: FIELD_ERRORS_MESSAGE, errors };

  return {
    status: "error",
    message: typeof b.error === "string" ? b.error : GENERIC_ERROR_MESSAGE,
    errors: {},
  };
}
