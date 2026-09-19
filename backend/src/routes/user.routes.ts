import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken } from "../middleware/token";
import { requireAuth } from "../middleware/auth";

const authRouter = express.Router();
const COOKIE_NAME = "token";
const isProd = process.env.NODE_ENV === "production";

const cookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

// The rules the login and register forms apply before sending
// (self-storage-hosting/lib/auth-form.ts). The frontend's
// tests/auth-form.test.ts reads these four lines, so change both files
// together.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const MIN_PASSWORD = 8;
const MAX_NAME = 100;

const EMAIL_TAKEN = { code: "EMAIL_TAKEN", message: "Email already registered" } as const;

type Credentials = { email: string; password: string; name?: string };

/**
 * Reads the body into plain strings before anything reaches a query.
 *
 * express.json() passes through whatever JSON the client sent, so `email` can
 * arrive as an object such as { "$ne": null }. Handed to findOne as is, that
 * is a query operator, and it matches the first account in the collection.
 * Requiring strings here keeps every filter below a literal value.
 *
 * Login checks only the shape. An account made before these rules existed
 * must still be able to sign in, so the stricter rules apply at register.
 */
function readCredentials(
  body: unknown,
  mode: "login" | "register"
): { ok: true; value: Credentials } | { ok: false; message: string } {
  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  if (typeof raw.email !== "string" || typeof raw.password !== "string") {
    return { ok: false, message: "email & password required" };
  }
  const email = raw.email.trim().toLowerCase();
  const password = raw.password;
  if (!email || !password) return { ok: false, message: "email & password required" };
  if (email.length > MAX_EMAIL) return { ok: false, message: "Email is too long" };
  if (mode === "login") return { ok: true, value: { email, password } };

  if (!EMAIL_PATTERN.test(email)) return { ok: false, message: "Enter a valid email address" };
  if (password.length < MIN_PASSWORD) {
    return { ok: false, message: `Password must be at least ${MIN_PASSWORD} characters` };
  }
  // bcrypt reads only the first 72 bytes of a password and ignores the rest,
  // so a longer one would be stored as something weaker than it looks.
  if (bcrypt.truncates(password)) return { ok: false, message: "Password is too long" };
  if (raw.name != null && typeof raw.name !== "string") {
    return { ok: false, message: "Name must be text" };
  }
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  if (name.length > MAX_NAME) {
    return { ok: false, message: `Name must be at most ${MAX_NAME} characters` };
  }
  return { ok: true, value: { email, password, name: name || undefined } };
}

authRouter.post("/register", async (req, res) => {
  const input = readCredentials(req.body, "register");
  if (!input.ok) return res.status(400).json({ code: "BAD_INPUT", message: input.message });
  const { email, password, name } = input.value;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json(EMAIL_TAKEN);

  const passwordHash = await bcrypt.hash(password, 12);
  // Two requests for the same new email can both pass the check above. The
  // unique index on email stops the second one here. Answer it the same way.
  const user = await User.create({ email, passwordHash, name }).catch((err: unknown) => {
    if ((err as { code?: unknown } | null)?.code === 11000) return null;
    throw err;
  });
  if (!user) return res.status(409).json(EMAIL_TAKEN);

  const token = signToken({ sub: String(user._id), email: user.email });
  res.cookie(COOKIE_NAME, token, cookieOpts);
  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
  });
});

authRouter.post("/login", async (req, res) => {
  const input = readCredentials(req.body, "login");
  if (!input.ok) return res.status(400).json({ code: "BAD_INPUT", message: input.message });
  const { email, password } = input.value;
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ code: "INVALID_LOGIN", message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res
      .status(401)
      .json({ code: "INVALID_LOGIN", message: "Invalid credentials" });

  const token = signToken({ sub: String(user._id), email: user.email });
  res.cookie(COOKIE_NAME, token, cookieOpts);
  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
  });
});

authRouter.get("/profile", requireAuth, async (req, res) => {
  const userId = (req as any).user.id;
  const user = await User.findById(userId)
    .select("_id email name createdAt")
    .lean();
  if (!user)
    return res
      .status(404)
      .json({ code: "NOT_FOUND", message: "User not found" });
  res.json({
    user: {
      id: String(user._id),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
  });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    path: "/",
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
  res.json({ ok: true });
});

export default authRouter;
