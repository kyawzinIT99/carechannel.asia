import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { Role } from "@prisma/client";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  if (typeof body.isActive === "boolean") data.isActive = body.isActive;
  const user = await prisma.user.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: { actorId: session?.sub, action: "user.patch", entity: "User", entityId: id, meta: data as object },
  });
  return NextResponse.json({ id: user.id, isActive: user.isActive });
}
