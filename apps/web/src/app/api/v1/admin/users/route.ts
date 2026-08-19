import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];
const ALLOWED: Role[] = [
  "SUPER_ADMIN",
  "HOSPITAL_ADMIN",
  "INTERNATIONAL_COORDINATOR",
  "RECEPTION",
];

export async function POST(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const role = ALLOWED.includes(body.role as Role) ? (body.role as Role) : Role.HOSPITAL_ADMIN;

  if (name.length < 2 || !email.includes("@") || password.length < 8) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      locale: "en",
      isActive: true,
      roles: { create: { role } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session?.sub,
      action: "user.create",
      entity: "User",
      entityId: user.id,
      meta: { email, role },
    },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
