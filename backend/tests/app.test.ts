import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../src/app";
import { User } from "../src/models/User";

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
        .send({ email: "leak-check@example.com", password: "x", name: "x" });

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
        .send({ email: "leak-check-2@example.com", password: "x", name: "x" });
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
