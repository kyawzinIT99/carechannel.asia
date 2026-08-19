import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/server/auth/session";

export async function POST() {
  (await cookies()).delete(AUTH_COOKIE);
  return NextResponse.json({ ok: true });
}
