import { describe, it, expect, vi } from "vitest";
import request from "supertest";
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
    process.env.NODE_ENV = "production";
    delete process.env.JWT_SECRET;
    await expect(import("../src/middleware/token")).rejects.toThrow(/JWT_SECRET/);
    process.env.NODE_ENV = prev.env;
    if (prev.secret) process.env.JWT_SECRET = prev.secret;
  });
});
