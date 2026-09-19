import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  AuthError,
  EMAIL_PATTERN,
  MAX_EMAIL,
  MAX_NAME,
  MAX_PASSWORD_BYTES,
  MIN_PASSWORD,
  friendlyAuthError,
  toUser,
  validateAuthInput,
  type AuthInput,
} from "@/lib/auth-form";
import { PKG_ROOT } from "./helpers/walk";

const ok: AuthInput = { email: "dana@example.com", password: "long-enough-1" };

describe("validateAuthInput", () => {
  it("accepts a valid login and a valid registration", () => {
    expect(validateAuthInput("login", ok)).toEqual({});
    expect(validateAuthInput("register", { ...ok, name: "Dana" })).toEqual({});
  });

  it("asks for both fields on either form", () => {
    for (const mode of ["login", "register"] as const) {
      expect(Object.keys(validateAuthInput(mode, { email: " ", password: "" })).sort()).toEqual([
        "email",
        "password",
      ]);
    }
  });

  it.each<[string, AuthInput, string]>([
    ["a malformed email", { ...ok, email: "dana-at-example" }, "email"],
    ["an email over the length limit", { ...ok, email: `${"a".repeat(MAX_EMAIL)}@x.co` }, "email"],
    ["a password under the minimum", { ...ok, password: "a".repeat(MIN_PASSWORD - 1) }, "password"],
    // 40 characters but 80 bytes. The limit is bcrypt's, and bcrypt counts bytes.
    ["a 40-character password that is 80 bytes", { ...ok, password: "é".repeat(40) }, "password"],
    ["a name over the length limit", { ...ok, name: "a".repeat(MAX_NAME + 1) }, "name"],
  ])("register rejects %s", (_label, input, field) => {
    expect(Object.keys(validateAuthInput("register", input))).toEqual([field]);
  });

  it("accepts a password of exactly the minimum length and exactly the byte limit", () => {
    expect(validateAuthInput("register", { ...ok, password: "a".repeat(MIN_PASSWORD) })).toEqual({});
    expect(validateAuthInput("register", { ...ok, password: "a".repeat(MAX_PASSWORD_BYTES) })).toEqual({});
  });

  it("checks only that login fields are filled, so older accounts can still sign in", () => {
    expect(validateAuthInput("login", { email: "dana-at-example", password: "short" })).toEqual({});
  });
});

// The code an AuthError carries, "not an AuthError" for any other throw, or
// undefined when nothing was thrown.
function codeOf(run: () => unknown): string | undefined {
  try {
    run();
  } catch (e) {
    return e instanceof AuthError ? e.code : "not an AuthError";
  }
  return undefined;
}

describe("toUser", () => {
  it("keeps the fields the server sends", () => {
    const user = { id: "u1", email: "dana@example.com", name: "Dana", createdAt: "2026-09-18T00:00:00.000Z" };
    expect(toUser({ user })).toEqual(user);
  });

  it("drops a name or date that is not text", () => {
    expect(toUser({ user: { id: "u1", email: "dana@example.com", name: 5, createdAt: null } })).toEqual({
      id: "u1",
      email: "dana@example.com",
    });
  });

  it.each<[string, unknown]>([
    ["an empty body", null],
    ["a body with no user", {}],
    ["a numeric id", { user: { id: 1, email: "dana@example.com" } }],
    ["a user with no email", { user: { id: "u1" } }],
  ])("refuses %s", (_label, data) => {
    expect(codeOf(() => toUser(data))).toBe("BAD_RESPONSE");
  });
});

describe("friendlyAuthError", () => {
  it.each<[string, RegExp]>([
    ["INVALID_LOGIN", /do not match an account/],
    ["EMAIL_TAKEN", /already uses that email address/],
    ["BAD_INPUT", /check your email address and password/],
    ["NETWORK", /could not reach/],
    ["UNAVAILABLE", /not available/],
  ])("explains %s in plain words", (code, words) => {
    expect(friendlyAuthError(new AuthError(code, "server wording"))).toMatch(words);
  });

  it("never shows the server's own message, which is not written for visitors", () => {
    for (const code of ["SERVER_ERROR", "BAD_RESPONSE", "HTTP_ERROR", "constructor", "INVALID_LOGIN"]) {
      expect(friendlyAuthError(new AuthError(code, "E11000 duplicate key users.email"))).not.toContain("E11000");
    }
    expect(friendlyAuthError(new Error("E11000 duplicate key"))).not.toContain("E11000");
    expect(friendlyAuthError("not even an error")).toMatch(/went wrong/);
  });
});

describe("the account server's rules", () => {
  it("are the rules the forms apply", () => {
    const server = readFileSync(path.join(PKG_ROOT, "..", "backend", "src", "routes", "user.routes.ts"), "utf8");
    const expected = [
      `const EMAIL_PATTERN = /${EMAIL_PATTERN.source}/;`,
      `const MAX_EMAIL = ${MAX_EMAIL};`,
      `const MIN_PASSWORD = ${MIN_PASSWORD};`,
      `const MAX_NAME = ${MAX_NAME};`,
      // bcrypt's own check of its 72-byte limit, which MAX_PASSWORD_BYTES mirrors.
      "bcrypt.truncates(password)",
    ];
    const missing = expected.filter((line) => !server.includes(line));
    expect(missing, `backend/src/routes/user.routes.ts no longer says: ${missing.join(" | ")}`).toEqual([]);
    expect(MAX_PASSWORD_BYTES).toBe(72);
  });
});
