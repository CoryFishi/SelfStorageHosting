import { NextResponse } from "next/server";
import { validateContact } from "@/lib/contact";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const MAX_TRACKED_IPS = 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // The Map would otherwise grow for the life of the instance.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  }
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
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
    body: JSON.stringify({
      from: "Self Storage Hosting <noreply@selfstoragehosting.com>",
      to: [to],
      reply_to: result.value.email,
      subject: `Website ${result.value.subject ?? "enquiry"} from ${result.value.name}`,
      text: Object.entries(result.value)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("Resend rejected the message:", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn't send that. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
