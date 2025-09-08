import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./token";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = (req as any).cookies?.token as string | undefined;
  const token = cookieToken;

  if (!token)
    return res
      .status(401)
      .json({ code: "NO_TOKEN", message: "Login required" });

  try {
    const payload = verifyToken(token);
    (req as any).user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res
      .status(401)
      .json({ code: "BAD_TOKEN", message: "Invalid or expired token" });
  }
}
