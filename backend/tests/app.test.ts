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
      expect(res.body).toEqual({ error: "Server error" });
      // The real Mongoose error text (collection name + "buffering timed
      // out") must never reach the response body.
      const raw = JSON.stringify(res.body);
      expect(raw).not.toMatch(/buffering timed out/i);
      expect(raw).not.toMatch(/users\./i);
    } finally {
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
  it("refuses to load in production without JWT_SECRET", async () => {
    vi.resetModules();
    const prev = { env: process.env.NODE_ENV, secret: process.env.JWT_SECRET };
    try {
      process.env.NODE_ENV = "production";
      delete process.env.JWT_SECRET;
      await expect(import("../src/middleware/token")).rejects.toThrow(/JWT_SECRET/);
    } finally {
      // Assigning `undefined` to a process.env key coerces it to the string
      // "undefined" instead of deleting it, so restore with delete when there
      // was no prior value.
      if (prev.env) process.env.NODE_ENV = prev.env;
      else delete process.env.NODE_ENV;
      if (prev.secret) process.env.JWT_SECRET = prev.secret;
      else delete process.env.JWT_SECRET;
    }
  });
});
