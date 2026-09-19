import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { validateContact, interpretResponse, TIMELINE_OPTIONS } from "@/lib/contact";
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

  it("accepts a message at exactly the 5000-character limit", () => {
    expect(validateContact({ ...valid, message: "x".repeat(5000) }).ok).toBe(true);
  });

  it("rejects a name over 200 characters", () => {
    const r = validateContact({ ...valid, name: "x".repeat(201) });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBeTruthy();
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

describe("demo requests", () => {
  const demo = { name: "Dana Reyes", email: "dana@example.com", subject: "demo" };

  // Every case below asserts unconditionally, in the style of the "trims
  // whitespace" case above. A branch that only asserts when r.ok is true
  // passes vacuously when the validator wrongly rejects.
  it("may omit the message, because the qualification fields say what they want", () => {
    expect(validateContact(demo)).toMatchObject({ ok: true, value: { subject: "demo" } });
  });

  it("still requires a message on the general form", () => {
    const r = validateContact({ ...demo, subject: "general" });
    expect(r.ok ? [] : Object.keys(r.errors)).toEqual(["message"]);
  });

  it("still caps a demo message at 5000 characters", () => {
    expect(validateContact({ ...demo, message: "x".repeat(5001) }).ok).toBe(false);
  });

  it("keeps a timeline that is one of the listed options", () => {
    expect(validateContact({ ...demo, timeline: TIMELINE_OPTIONS[1] })).toMatchObject({
      ok: true,
      value: { timeline: "Within 3 months" },
    });
  });

  it("drops a timeline that is not one of the listed options", () => {
    const r = validateContact({ ...demo, timeline: "Tomorrow, or else" });
    expect(r.ok ? r.value.timeline : "rejected instead of dropped").toBeUndefined();
  });
});

describe("interpretResponse", () => {
  it("treats ok as sent, with the thank-you message and no errors", () => {
    expect(interpretResponse(true, {})).toEqual({
      status: "sent",
      message: "Thanks — we have your message and will reply within one business day.",
      errors: {},
    });
  });

  it("treats a plain-object errors map as field errors", () => {
    expect(interpretResponse(false, { errors: { message: "Required." } })).toEqual({
      status: "error",
      message: "Please check the highlighted fields.",
      errors: { message: "Required." },
    });
  });

  it("does not treat a string errors value as field errors", () => {
    expect(interpretResponse(false, { errors: "rejected" })).toEqual({
      status: "error",
      message: "Something went wrong. Please try again.",
      errors: {},
    });
  });

  it("does not treat an array errors value as field errors", () => {
    expect(interpretResponse(false, { errors: ["a"] })).toEqual({
      status: "error",
      message: "Something went wrong. Please try again.",
      errors: {},
    });
  });

  it("keeps only the string-valued entries of an errors object", () => {
    expect(interpretResponse(false, { errors: { a: 1, b: "real" } })).toEqual({
      status: "error",
      message: "Please check the highlighted fields.",
      errors: { b: "real" },
    });
  });

  it("surfaces a top-level error string verbatim", () => {
    expect(interpretResponse(false, { error: "We couldn't send that. Please try again." })).toEqual({
      status: "error",
      message: "We couldn't send that. Please try again.",
      errors: {},
    });
  });

  it("falls back to the generic message for an empty body", () => {
    expect(interpretResponse(false, {})).toEqual({
      status: "error",
      message: "Something went wrong. Please try again.",
      errors: {},
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
    vi.unstubAllGlobals();
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

    // A global counter bug would fail here; the single-IP assertions above
    // would not catch it on their own.
    expect((await POST(req({}, "203.0.113.20"))).status).toBe(400);
  });

  function configured() {
    process.env.CONTACT_TO_EMAIL = "ops@example.com";
    process.env.RESEND_API_KEY = "test-key";
  }

  it("posts the lead to the provider and returns 200 when it accepts", async () => {
    configured();
    const calls: Array<{ url: unknown; init: RequestInit }> = [];
    vi.stubGlobal("fetch", async (url: unknown, init: RequestInit) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ id: "abc" }), { status: 200 });
    });

    const res = await POST(req(valid, "203.0.113.4"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    expect(calls).toHaveLength(1);
    expect(calls[0].url).toBe("https://api.resend.com/emails");
    expect(calls[0].init).toMatchObject({
      method: "POST",
      headers: { Authorization: "Bearer test-key", "Content-Type": "application/json" },
    });
    const sent = JSON.parse(String(calls[0].init.body));
    expect(sent.to).toEqual(["ops@example.com"]);
    expect(sent.reply_to).toBe(valid.email);
    expect(sent.text).toContain(valid.message);
  });

  it("strips control characters out of the Subject header", async () => {
    configured();
    let sent: { subject: string } | undefined;
    vi.stubGlobal("fetch", async (_url: unknown, init: RequestInit) => {
      sent = JSON.parse(String(init.body));
      return new Response("{}", { status: 200 });
    });

    await POST(req({ ...valid, name: "Dana\r\nBcc: victim@example.com" }, "203.0.113.5"));
    expect(sent?.subject).not.toMatch(/[\r\n]/);
    expect(sent?.subject).toContain("Bcc: victim@example.com");
  });

  it("returns 502 when the provider rejects the message", async () => {
    configured();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      vi.stubGlobal("fetch", async () => new Response("rejected", { status: 422 }));
      const res = await POST(req(valid, "203.0.113.6"));
      expect(res.status).toBe(502);
      expect((await res.json()).error).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("returns 502 rather than an opaque 500 when the provider is unreachable", async () => {
    configured();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      vi.stubGlobal("fetch", async () => {
        throw new TypeError("fetch failed");
      });
      const res = await POST(req(valid, "203.0.113.7"));
      expect(res.status).toBe(502);
      expect((await res.json()).error).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("returns 502 rather than hanging when the mail provider never settles", async () => {
    configured();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    // Stands in for the client's real 10-second wait: fires the abort almost
    // immediately so this proves the code path -- a fetch that never settles
    // on its own, wired to an AbortSignal.timeout, resolves to the friendly
    // 502 rather than hanging until the caller gives up -- without an actual
    // 10-second wait in the suite. AbortSignal itself is Node's own tested
    // behavior; only its duration is faked here.
    const realTimeout = AbortSignal.timeout.bind(AbortSignal);
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout").mockImplementation(() => realTimeout(0));
    try {
      vi.stubGlobal(
        "fetch",
        (_url: unknown, init: RequestInit) =>
          new Promise<Response>((_resolve, reject) => {
            init.signal?.addEventListener("abort", () =>
              reject(new DOMException("This operation was aborted.", "AbortError"))
            );
          })
      );
      const res = await POST(req(valid, "203.0.113.8"));
      expect(res.status).toBe(502);
      expect((await res.json()).error).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    } finally {
      timeoutSpy.mockRestore();
      spy.mockRestore();
    }
  });
});
