import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

export type AuthPayload = { sub: string; email: string };

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev-secret";
const signOpts: SignOptions = {
  expiresIn: (process.env.JWT_EXPIRES ?? "7d") as SignOptions["expiresIn"],
};

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, signOpts);
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
