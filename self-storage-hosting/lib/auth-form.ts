// Rules, types and messages for the login and register forms, kept free of
// React so they can be tested directly. The account server applies the same
// rules (backend/src/routes/user.routes.ts), and tests/auth-form.test.ts
// fails when the two drift apart.

export type AuthMode = "login" | "register";
export type AuthInput = { email: string; password: string; name?: string };
export type User = { id: string; email: string; name?: string; createdAt?: string };

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_EMAIL = 254;
export const MIN_PASSWORD = 8;
// bcrypt reads only the first 72 bytes of a password. That is bytes, not
// characters: "é" is one character and two bytes.
export const MAX_PASSWORD_BYTES = 72;
export const MAX_NAME = 100;

/** A failed account request. `code` is the server's code, or one of ours. */
export class AuthError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

/**
 * Field errors keyed by field name, or {} when the input can be sent.
 * Login checks only that both fields are filled, as the server does, so an
 * account made before the register rules existed can still sign in.
 */
export function validateAuthInput(mode: AuthMode, input: AuthInput): Record<string, string> {
  const errors: Record<string, string> = {};
  const register = mode === "register";

  const email = input.email.trim();
  if (!email) errors.email = "Please enter your email address.";
  else if (email.length > MAX_EMAIL) errors.email = "That email address is too long.";
  else if (register && !EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  const password = input.password;
  if (!password) errors.password = register ? "Please choose a password." : "Please enter your password.";
  else if (register && password.length < MIN_PASSWORD) {
    errors.password = `Please use at least ${MIN_PASSWORD} characters.`;
  } else if (register && new TextEncoder().encode(password).length > MAX_PASSWORD_BYTES) {
    errors.password = "That password is too long. Please use a shorter one.";
  }

  if (register && (input.name ?? "").trim().length > MAX_NAME) {
    errors.name = `Please keep your name to ${MAX_NAME} characters or fewer.`;
  }
  return errors;
}

/** The `user` in a server response, checked. Throws AuthError("BAD_RESPONSE") otherwise. */
export function toUser(data: unknown): User {
  const user = (data as { user?: unknown } | null)?.user;
  if (!user || typeof user !== "object") {
    throw new AuthError("BAD_RESPONSE", "The account server sent no user");
  }
  const { id, email, name, createdAt } = user as Record<string, unknown>;
  if (typeof id !== "string" || typeof email !== "string") {
    throw new AuthError("BAD_RESPONSE", "The account server sent an incomplete user");
  }
  return {
    id,
    email,
    ...(typeof name === "string" && name ? { name } : {}),
    ...(typeof createdAt === "string" ? { createdAt } : {}),
  };
}

// A Map, not an object: an object literal would answer a code such as
// "constructor" with a function from its prototype.
const FRIENDLY = new Map<string, string>([
  ["INVALID_LOGIN", "That email and password do not match an account."],
  ["EMAIL_TAKEN", "An account already uses that email address. Try logging in instead."],
  ["BAD_INPUT", "Please check your email address and password, then try again."],
  ["NETWORK", "We could not reach the account server. Please check your connection and try again."],
  ["UNAVAILABLE", "Signing in is not available right now."],
]);
const FALLBACK = "Something went wrong. Please try again in a moment.";

/** Plain words for any failure. Never the server's own message. */
export function friendlyAuthError(err: unknown): string {
  return (err instanceof AuthError && FRIENDLY.get(err.code)) || FALLBACK;
}
