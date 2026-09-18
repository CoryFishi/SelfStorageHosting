import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
// Comfortably inside ContactForm.tsx's 15-second client abort, so the route
// answers (success, or the friendly 502 below) before the client gives up.
// Without this, a slow provider lets the client abort while the send is
// still in flight: the visitor sees "took too long," the form stays
// populated because the success branch was never reached, they submit again
// -- and the first message may already have been delivered. Two emails, one
// visitor, for the one path the whole site funnels into.
const MAIL_TIMEOUT_MS = 10_000;
// A prune threshold, not a maximum. Naming it MAX_ would assert a bound the
// sweep alone does not enforce.
const PRUNE_ABOVE = 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (entry && now <= entry.resetAt) {
    entry.count += 1;
    return entry.count > MAX_PER_WINDOW;
  }

  // Sweep only when opening a new window, so the common path stays O(1). If
  // nothing had expired, the table is dropped rather than rescanned on every
  // later request: per-IP limiting was never going to stop a distributed flood,
  // and bounded memory and CPU on the only public write path matter more than
  // preserving counters during one.
  if (hits.size > PRUNE_ABOVE) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    if (hits.size > PRUNE_ABOVE) hits.clear();
  }

  hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  return false;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const result = validateContact(body);

  if (!result.ok) {
    // A tripped honeypot gets a 200 so bots cannot tell it failed.
    if (result.errors.website) return NextResponse.json({ ok: true });
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL;
  const key = process.env.RESEND_API_KEY;

  if (!to || !key) {
    console.error("Contact form not configured: set CONTACT_TO_EMAIL and RESEND_API_KEY.");
    return NextResponse.json(
      // Do NOT say "email us directly": SITE.contactEmail is "" until the
      // owner supplies one (spec §14 A), so the page publishes no address
      // and that instruction is impossible to follow.
      { error: "We could not send that right now. Please try again shortly." },
      { status: 503 }
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(MAIL_TIMEOUT_MS),
    body: JSON.stringify({
      from: "Self Storage Hosting <noreply@selfstoragehosting.com>",
      to: [to],
      reply_to: result.value.email,
      // A newline in a Subject is a header-injection vector. `message` may
      // legitimately contain them and is body text; this is a header.
      subject: `Website ${result.value.subject ?? "enquiry"} from ${result.value.name}`.replace(
        /[\r\n]+/g,
        " "
      ),
      text: Object.entries(result.value)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    }),
  }).catch(() => null);

  // A rejected fetch and an error response are the same event from the
  // visitor's side, so both get the same friendly 502 rather than an opaque 500.
  if (!res || !res.ok) {
    const detail = res ? `${res.status} ${await res.text().catch(() => "")}` : "unreachable";
    console.error("Mail provider failed:", detail);
    return NextResponse.json({ error: "We couldn't send that. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
