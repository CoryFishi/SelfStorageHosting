import { Request, Response, NextFunction } from "express";

type User = { id: string; email: string };
const users: User[] = [{ id: "1", email: "demo@example.com" }];

export async function getUsers(
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // pretend DB fetch
  res.json({ data: users });
}

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body as Partial<User>;
    if (!email) return res.status(400).json({ error: "email is required" });

    const newUser: User = { id: String(users.length + 1), email };
    users.push(newUser);
    res.status(201).json({ data: newUser });
  } catch (err) {
    next(err);
  }
}
