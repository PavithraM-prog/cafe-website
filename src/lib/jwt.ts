import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "cozy_beans_super_secret_fallback_key";

export function signToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}
