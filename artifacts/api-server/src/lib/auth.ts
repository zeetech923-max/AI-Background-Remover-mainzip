import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SECRET = process.env.ADMIN_SECRET || process.env.DATABASE_URL || "dev-secret-change-me";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const COOKIE_NAME = "bgr_admin";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function sign(payload: string): string {
  const h = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${h}`;
}

function verify(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx < 0) return null;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const [, expStr] = payload.split("|");
  if (!expStr || Number(expStr) < Date.now()) return null;
  return payload;
}

export function issueAdminCookie(res: Response): void {
  const token = sign(`admin|${Date.now() + MAX_AGE_MS}`);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_MS,
    path: "/",
  });
}

export function clearAdminCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

export function isAuthed(req: Request): boolean {
  const token = (req as Request & { cookies?: Record<string, string> }).cookies?.[COOKIE_NAME];
  if (!token) return false;
  return verify(token) !== null;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAuthed(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
