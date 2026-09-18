import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const src = readFileSync(path.resolve(__dirname, "../lib/auth-context.tsx"), "utf8");

// These are source-text checks, which is the right shape here - the module is
// a client component and the point is the wire contract, not the render. But a
// suite made only of "does not contain X" and ">= 0" passes on an empty file.
// The first case below and the tightened counts are what make it non-vacuous:
// a 9-line stub with just the four path strings passes everything else.
describe("auth client configuration", () => {
  it("actually exports a provider and a hook", async () => {
    const mod = await import("@/lib/auth-context");
    expect(typeof mod.AuthProvider).toBe("function");
    expect(typeof mod.useAuth).toBe("function");
  });

  it("targets the real backend paths, not /app/auth", () => {
    expect(src).not.toContain("/app/auth");
    for (const p of ["/api/users/login", "/api/users/register", "/api/users/profile", "/api/users/logout"]) {
      expect(src).toContain(p);
    }
  });

  it("sends credentials on every request, including register", () => {
    const fetches = src.match(/fetch\(/g) ?? [];
    const creds = src.match(/credentials: "include"/g) ?? [];
    // Without the floor, 0 >= 0 passes on a file with no fetch at all.
    expect(fetches.length).toBeGreaterThanOrEqual(2);
    expect(creds.length).toBe(fetches.length);
  });

  it("does not depend on a token in the response body", () => {
    // The cookie model means the client never handles a token at all, so assert
    // the word is absent rather than one syntax for reading it: `data.token` was
    // the only shape the old regex caught, and `const { token } = data` slipped
    // straight through it.
    expect(src).not.toMatch(/\btoken\b/i);
  });

  it("does not put auth state in localStorage", () => {
    expect(src).not.toContain("localStorage");
  });

  it("reads the API base from exactly one constant", () => {
    const inline = src.match(/process\.env\.NEXT_PUBLIC_API_BASE/g) ?? [];
    expect(inline.length).toBe(1);
  });
});
