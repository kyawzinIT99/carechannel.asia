import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/prisma";
import { setSessionCookie, signSession } from "@/server/auth/session";
import { Role } from "@prisma/client";
import { clientIp, rateLimit } from "@/server/security/http";

export async function POST(request: Request) {
  if (!rateLimit(`reg:${clientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
    phone?: string;
    locale?: "en" | "my";
  };
  if (!body.email || !body.password || !body.name) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }
  if (body.password.length < 8) {
    return NextResponse.json({ error: "weak_password" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email: body.email.trim().toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }
  const user = await prisma.user.create({
    data: {
      email: body.email.trim().toLowerCase(),
      passwordHash: await bcrypt.hash(body.password, 12),
      name: body.name,
      phone: body.phone || null,
      locale: body.locale === "my" ? "my" : "en",
      roles: { create: { role: Role.PATIENT } },
    },
    include: { roles: true },
  });
  const token = await signSession({
    sub: user.id,
    email: user.email,
    roles: user.roles.map((r) => r.role),
  });
  await setSessionCookie(token);
  return NextResponse.json({ ok: true, roles: user.roles.map((r) => r.role) }, { status: 201 });
}
