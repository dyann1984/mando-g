import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { AdminUser, InviteCode } from "@/types/presskit";
import { getAdmins, saveAdmins, getInvites, saveInvites } from "@/lib/db";

function getJwtSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET no está configurada en las variables de entorno de producción.");
    }
    return "dev_secret_mando_g_local_development_only";
  }
  return secret;
}

const COOKIE_NAME = "mg_presskit_session";

export interface SessionData {
  userId: string;
  username: string;
  email: string;
  role: string;
  exp: number;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: AdminUser, expiresInDays = 7): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    })
  ).toString("base64url");

  const signature = crypto
    .createHmac("sha256", getJwtSecret())
    .update(`${header}.${payload}`)
    .digest("base64url");

  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): SessionData | null {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", getJwtSecret())
      .update(`${header}.${payload}`)
      .digest("base64url");

    if (signature !== expectedSignature) return null;

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as SessionData;
    if (data.exp < Date.now()) return null;

    return data;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 días
  });
}

export function removeSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function generateInviteCode(role: "admin" | "editor" = "admin", daysValid = 7): InviteCode {
  const code = "MG-" + crypto.randomBytes(4).toString("hex").toUpperCase();
  const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString();
  return {
    id: "inv_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    code,
    role,
    createdAt: new Date().toISOString(),
    expiresAt,
    used: false,
    revoked: false,
  };
}

