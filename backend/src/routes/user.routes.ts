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

authRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password)
    return res
      .status(400)
      .json({ code: "BAD_INPUT", message: "email & password required" });
  const exists = await User.findOne({ email });
  if (exists)
    return res
      .status(409)
      .json({ code: "EMAIL_TAKEN", message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name });

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
  const { email, password } = req.body || {};
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
