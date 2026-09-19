import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { readdirSync, readFileSync } from "fs";
import path from "path";
import { createApp } from "../src/app";
import { User } from "../src/models/User";
import bcrypt from "bcryptjs";

describe("app wiring", () => {
  const app = createApp();

  it("serves the health check under /api", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("mounts auth routes at /api/users, not /app/auth", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("NO_TOKEN");
  });

  it("parses cookies so requireAuth can read the token", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Cookie", "token=not-a-real-jwt");
    // Reaching BAD_TOKEN proves req.cookies was populated.
    // Without cookie-parser this would still be NO_TOKEN.
    expect(res.body.code).toBe("BAD_TOKEN");
  });

  it("sends CORS headers that permit credentialed cross-origin requests", async () => {
    const res = await request(app)
      .options("/api/users/login")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("hides internal error details from the client on 500s", async () => {
    // No DB connection exists in this test process, so a real query against
    // the User model fails for real (not a mock) once Mongoose's command
    // buffer times out. Speed that timeout up so the test stays fast.
    const prevBufferTimeoutMS = mongoose.get("bufferTimeoutMS");
    mongoose.set("bufferTimeoutMS", 50);
    try {
      const res = await request(app)
        .post("/api/users/register")
        .send({ email: "leak-check@example.com", password: "long-enough-1", name: "x" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ code: "SERVER_ERROR", message: "Server error" });
      // The real Mongoose error text (collection name + "buffering timed
      // out") must never reach the response body.
      const raw = JSON.stringify(res.body);
      expect(raw).not.toMatch(/buffering timed out/i);
      expect(raw).not.toMatch(/users\./i);
    } finally {
      mongoose.set("bufferTimeoutMS", prevBufferTimeoutMS);
    }
  });

  it("answers a route-level error and the global-handler error with the same envelope shape", async () => {
    // requireAuth answers its 401 itself, without ever reaching the global
    // handler in app.ts (and without touching the DB, so it needs none of
    // this test's setup); that handler only fires for thrown/5xx errors. The
    // client (lib/auth-context.tsx) reads `data?.message` on every path, so
    // both must carry exactly {code, message} -- not merely both "have a
    // message somewhere."
    const routeLevel = await request(app).get("/api/users/profile");
    expect(routeLevel.status).toBe(401);

    const prevBufferTimeoutMS = mongoose.get("bufferTimeoutMS");
    mongoose.set("bufferTimeoutMS", 50);
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const globalHandlerLevel = await request(app)
        .post("/api/users/register")
        .send({ email: "leak-check-2@example.com", password: "long-enough-1", name: "x" });
      expect(globalHandlerLevel.status).toBe(500);

      for (const res of [routeLevel, globalHandlerLevel]) {
        expect(Object.keys(res.body).sort()).toEqual(["code", "message"]);
        expect(typeof res.body.code).toBe("string");
        expect(typeof res.body.message).toBe("string");
      }
    } finally {
      spy.mockRestore();
      mongoose.set("bufferTimeoutMS", prevBufferTimeoutMS);
    }
  });

  it("answers the global handler's sub-500 branch with the same envelope", async () => {
    // The handler's `status < 500` branch looked like dead code: nothing in the
    // route tree calls next(err). But express.json() is mounted ahead of the
    // router, and a malformed body makes body-parser throw with .status = 400,
    // which Express forwards straight here. So this branch is reachable by any
    // client that posts broken JSON, and its envelope has to match the others.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const res = await request(app)
        .post("/api/users/register")
        .set("Content-Type", "application/json")
        .send('{"email": "broken"');
      expect(res.status).toBeGreaterThanOrEqual(400);
      expect(res.status).toBeLessThan(500);
      expect(Object.keys(res.body).sort()).toEqual(["code", "message"]);
      expect(typeof res.body.code).toBe("string");
      expect(typeof res.body.message).toBe("string");
    } finally {
      spy.mockRestore();
    }
  });

  it("leaves no source file answering with a legacy { error } body", () => {
    // The tests above can only reach mounted code. An unmounted controller
    // once answered { error } -- a third shape the client's `data?.message`
    // read turns into the generic fallback -- and would have shipped it the
    // day someone mounted it. So check every source file, reachable or not.
    // Matches `error` as a key (first, or after a comma) in the object
    // literal passed to .json(), across line breaks.
    const legacyErrorBody = /\.json\(\s*\{(?:[^{}]*,)?\s*["']?error["']?\s*[:,}]/;
    const srcDir = path.resolve(__dirname, "../src");
    const offenders = readdirSync(srcDir, { recursive: true, encoding: "utf8" })
      .filter((f) => f.endsWith(".ts"))
      .filter((f) => legacyErrorBody.test(readFileSync(path.join(srcDir, f), "utf8")))
      .map((f) => f.split(path.sep).join("/"));
    expect(offenders).toEqual([]);
  });
});

describe("auth input", () => {
  const app = createApp();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Stands in for the database. Every case below is decided before a query
  // runs, or by what the query returns, so none of them needs a connection.
  // The spies also record the filter each query received, which is the thing
  // an operator-injection fix has to control.
  function stubUsers() {
    const findOne = vi.spyOn(User, "findOne").mockResolvedValue(null as never);
    const create = vi.spyOn(User, "create").mockImplementation((async (doc: { email: string; name?: string }) => ({
      _id: "u1",
      email: doc.email,
      name: doc.name,
      createdAt: new Date("2026-09-18T00:00:00.000Z"),
    })) as never);
    return { findOne, create };
  }

  it.each<[string, Record<string, unknown>]>([
    ["an operator object as the email", { email: { $ne: null }, password: "whatever-123" }],
    ["an operator object as the password", { email: "dana@example.com", password: { $ne: null } }],
    ["a missing password", { email: "dana@example.com" }],
    ["a blank email", { email: "   ", password: "whatever-123" }],
  ])("login refuses %s before querying", async (_label, body) => {
    const { findOne } = stubUsers();
    const res = await request(app).post("/api/users/login").send(body);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_INPUT");
    expect(findOne).not.toHaveBeenCalled();
  });

  it.each<[string, Record<string, unknown>, RegExp]>([
    ["an operator object as the email", { email: { $gt: "" }, password: "long-enough-1" }, /email/i],
    ["a malformed email", { email: "dana-at-example", password: "long-enough-1" }, /email/i],
    ["a password under 8 characters", { email: "dana@example.com", password: "short" }, /8 characters/],
    // 40 characters, but 80 bytes: the limit is bcrypt's, and bcrypt counts bytes.
    ["a password over 72 bytes", { email: "dana@example.com", password: "é".repeat(40) }, /too long/i],
    ["a name that is not text", { email: "dana@example.com", password: "long-enough-1", name: { $ne: "" } }, /name/i],
    ["a name over 100 characters", { email: "dana@example.com", password: "long-enough-1", name: "a".repeat(101) }, /name/i],
  ])("register refuses %s before querying", async (_label, body, message) => {
    const { findOne, create } = stubUsers();
    const res = await request(app).post("/api/users/register").send(body);
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("BAD_INPUT");
    expect(res.body.message).toMatch(message);
    expect(findOne).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it("looks the email up trimmed and lower-cased", async () => {
    const { findOne } = stubUsers();
    const res = await request(app)
      .post("/api/users/login")
      .send({ email: "  Dana@Example.COM ", password: "whatever-123" });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe("INVALID_LOGIN");
    expect(findOne).toHaveBeenCalledWith({ email: "dana@example.com" });
  });

  it("registers a valid account with a hashed password and sets the sign-in cookie", async () => {
    const { create } = stubUsers();
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "Dana@Example.com", password: "long-enough-1", name: "  Dana  " });
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ id: "u1", email: "dana@example.com", name: "Dana" });
    const doc = create.mock.calls[0][0] as unknown as { email: string; passwordHash: string; name?: string };
    expect(doc.email).toBe("dana@example.com");
    expect(doc.name).toBe("Dana");
    expect(await bcrypt.compare("long-enough-1", doc.passwordHash)).toBe(true);
    expect(String(res.headers["set-cookie"])).toMatch(/^token=/);
  });

  it("answers a duplicate-key race with EMAIL_TAKEN, not a 500", async () => {
    // Two requests for the same new email can both pass the findOne check.
    // The unique index on email stops the second one inside create().
    const { create } = stubUsers();
    create.mockRejectedValueOnce(Object.assign(new Error("E11000 duplicate key error"), { code: 11000 }));
    const res = await request(app)
      .post("/api/users/register")
      .send({ email: "dana@example.com", password: "long-enough-1" });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ code: "EMAIL_TAKEN", message: "Email already registered" });
  });
});

describe("User model", () => {
  it("defaults role so registration passes schema validation", () => {
    const u = new User({ email: "a@example.com", passwordHash: "x", name: "A" });
    expect(u.role).toBe("user");
    expect(u.validateSync()).toBeUndefined();
  });
});

describe("JWT secret", () => {
  // Assigning `undefined` to a process.env key coerces it to the string
  // "undefined" instead of deleting it, so restore with delete when there
  // was no prior value. Shared by every case below so none of them can leak
  // NODE_ENV or JWT_SECRET into the next test.
  async function withEnv(
    env: { NODE_ENV?: string; JWT_SECRET?: string },
    run: () => Promise<void>
  ) {
    vi.resetModules();
    const prev = { env: process.env.NODE_ENV, secret: process.env.JWT_SECRET };
    try {
      if (env.NODE_ENV === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = env.NODE_ENV;
      if (env.JWT_SECRET === undefined) delete process.env.JWT_SECRET;
      else process.env.JWT_SECRET = env.JWT_SECRET;
      await run();
    } finally {
      if (prev.env) process.env.NODE_ENV = prev.env;
      else delete process.env.NODE_ENV;
      if (prev.secret) process.env.JWT_SECRET = prev.secret;
      else delete process.env.JWT_SECRET;
    }
  }

  it("refuses to load in production without JWT_SECRET", () =>
    withEnv({ NODE_ENV: "production" }, async () => {
      await expect(import("../src/middleware/token")).rejects.toThrow(/JWT_SECRET/);
    }));

  it("refuses the .env.example placeholder in production", () =>
    withEnv({ NODE_ENV: "production", JWT_SECRET: "change-me-in-production" }, async () => {
      await expect(import("../src/middleware/token")).rejects.toThrow(/placeholder/i);
    }));

  it("refuses a secret under 32 characters in production", () =>
    withEnv({ NODE_ENV: "production", JWT_SECRET: "short-secret" }, async () => {
      await expect(import("../src/middleware/token")).rejects.toThrow(/32 characters/);
    }));

  it("accepts a strong secret in production", () =>
    withEnv(
      { NODE_ENV: "production", JWT_SECRET: "x".repeat(40) },
      async () => {
        const { signToken } = await import("../src/middleware/token");
        expect(typeof signToken({ sub: "1", email: "a@example.com" })).toBe("string");
      }
    ));

  it("falls back to the dev secret outside production when absent", () =>
    withEnv({ NODE_ENV: "test" }, async () => {
      const { signToken } = await import("../src/middleware/token");
      expect(typeof signToken({ sub: "1", email: "a@example.com" })).toBe("string");
    }));
});
