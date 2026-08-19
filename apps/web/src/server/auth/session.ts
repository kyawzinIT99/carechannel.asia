import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

export const AUTH_COOKIE = "ram_session";

export type SessionPayload = {
  sub: string;
  email: string;
  roles: Role[];
};

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(value);
}

export async function signSession(payload: SessionPayload) {
  return new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secret());
}

export async function readSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export function hasRole(session: SessionPayload | null, roles: Role[]) {
  if (!session) return false;
  return session.roles.some((role) => roles.includes(role));
}

export const STAFF_ROLES: Role[] = [
  "SUPER_ADMIN",
  "HOSPITAL_ADMIN",
  "INTERNATIONAL_COORDINATOR",
  "RECEPTION",
  "DOCTOR",
  "NURSE",
];

export async function setSessionCookie(token: string) {
  const { cookies } = await import("next/headers");
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}
