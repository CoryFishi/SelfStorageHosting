import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export type AuthPayload = { sub: string; email: string };

const UNSAFE = new Set(["change-me-in-production", "dev-secret", "secret", "changeme"]);

const JWT_SECRET: Secret = (() => {
  const fromEnv = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    // Presence is not the property that matters. The example file ships a
    // placeholder, so a presence-only check accepts a publicly known key.
    if (!fromEnv) throw new Error("JWT_SECRET must be set in production.");
    if (UNSAFE.has(fromEnv.trim().toLowerCase())) {
      throw new Error("JWT_SECRET is still a placeholder value. Set a real secret in production.");
    }
    if (fromEnv.length < 32) {
      throw new Error("JWT_SECRET must be at least 32 characters in production.");
    }
    return fromEnv;
  }
  return fromEnv || "dev-secret";
})();
const signOpts: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES ?? "7d") as SignOptions["expiresIn"],
};

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, signOpts);
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
