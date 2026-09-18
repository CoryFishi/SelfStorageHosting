import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { validateContact } from "@/lib/contact";
import { POST } from "@/app/api/contact/route";

const valid = {
  name: "Dana Reyes",
  email: "dana@example.com",
  message: "We run four facilities on Storable Easy and want to move off the office PC.",
  company: "Reyes Storage Group",
  website: "",
};

describe("validateContact", () => {
  it("accepts a complete submission", () => {
    expect(validateContact(valid).ok).toBe(true);
  });

  it("requires name, email and message", () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("rejects a malformed email", () => {
    const r = validateContact({ ...valid, email: "not-an-email" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeTruthy();
  });

  it("rejects a filled honeypot as spam", () => {
    const r = validateContact({ ...valid, website: "buy-cheap-pills" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.website).toBeTruthy();
  });

  it("keeps company, which the spec requires as a real field", () => {
    const r = validateContact(valid);
    expect(r).toMatchObject({ ok: true, value: { company: "Reyes Storage Group" } });
  });

  it("carries the subject through so /demo is distinguishable from /contact", () => {
    expect(validateContact({ ...valid, subject: "demo" })).toMatchObject({
      ok: true,
      value: { subject: "demo" },
    });
  });

  it("rejects an over-long message", () => {
    expect(validateContact({ ...valid, message: "x".repeat(5001) }).ok).toBe(false);
  });

  // The assertion must be unconditional. With only `if (r.ok) expect(...)`,
  // a validator that REJECTS padded input - the likeliest trim regression -
  // runs zero assertions and Vitest reports the case as passed.
  it("trims whitespace from accepted values", () => {
    expect(validateContact({ ...valid, name: "  Dana Reyes  " })).toMatchObject({
      ok: true,
      value: { name: "Dana Reyes" },
    });
  });
});

function req(body: unknown, ip: string) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  const saved = { to: process.env.CONTACT_TO_EMAIL, key: process.env.RESEND_API_KEY };

  // Without this the 503 case passes vacuously on any machine that happens to
  // have real credentials in its environment.
  beforeEach(() => {
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    if (saved.to === undefined) delete process.env.CONTACT_TO_EMAIL;
    else process.env.CONTACT_TO_EMAIL = saved.to;
    if (saved.key === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = saved.key;
  });

  it("answers a tripped honeypot with a 200 indistinguishable from success", async () => {
    const res = await POST(req({ ...valid, website: "buy-cheap-pills" }, "203.0.113.1"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  it("returns 400 with field errors for an invalid submission", async () => {
    const res = await POST(req({}, "203.0.113.2"));
    expect(res.status).toBe(400);
    expect(Object.keys((await res.json()).errors).sort()).toEqual(["email", "message", "name"]);
  });

  it("returns 503 and logs for the operator when the mail provider is unconfigured", async () => {
    // The handler logs on this path and vitest surfaces stderr, so an unstubbed
    // call would print noise into an otherwise pristine suite. Spying also turns
    // the log into an assertion that the operator actually gets a signal.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const res = await POST(req(valid, "203.0.113.3"));
      expect(res.status).toBe(503);
      expect((await res.json()).error).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("rate-limits after five requests from one address", async () => {
    const ip = "203.0.113.9";
    for (let i = 0; i < 5; i++) {
      expect((await POST(req({}, ip))).status).toBe(400);
    }
    expect((await POST(req({}, ip))).status).toBe(429);
  });
});
