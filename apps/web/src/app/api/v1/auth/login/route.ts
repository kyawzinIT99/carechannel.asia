import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/server/db/prisma";
import { signSession, setSessionCookie, STAFF_ROLES } from "@/server/auth/session";
import { Role } from "@prisma/client";
import { clientIp, rateLimit } from "@/server/security/http";
import { dummyPasswordHash } from "@/server/security/urls";

const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function POST(request: Request) {
  if (!rateLimit(`login:${clientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    portal?: "patient" | "staff";
  };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }
  const portal = body.portal === "staff" ? "staff" : "patient";

  const user = await prisma.user.findUnique({
    where: { email: body.email },
    include: { roles: true },
  });
  if (!user || !user.isActive) {
    await bcrypt.compare(body.password, dummyPasswordHash());
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const roles = user.roles.map((r) => r.role);
  const isStaff = roles.some((role) => STAFF_ROLES.includes(role));
  const isAdmin = roles.some((role) => ADMIN_ROLES.includes(role));
  const isPatient = roles.includes("PATIENT");

  if (portal === "patient" && !isPatient) {
    return NextResponse.json({ error: "staff_portal" }, { status: 403 });
  }
  if (portal === "staff" && !isStaff) {
    return NextResponse.json({ error: "patient_portal" }, { status: 403 });
  }

  const token = await signSession({
    sub: user.id,
    email: user.email,
    roles,
  });
  await setSessionCookie(token);

  const destination =
    portal === "staff"
      ? isAdmin
        ? "admin"
        : "staff"
      : "account";

  return NextResponse.json({ ok: true, roles, destination, portal });
}
