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
};

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

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 200) errors.name = "That name is too long.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";

  if (!message) errors.message = "Please tell us what you need.";
  else if (message.length > 5000) errors.message = "Please keep your message under 5000 characters.";

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
    },
  };
}
