import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession, STAFF_ROLES } from "@/server/auth/session";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!hasRole(session, STAFF_ROLES)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  // Allow status update and assignment only
  const data: Record<string, unknown> = {};
  if (body.status) data.status = body.status;
  if (body.assignedToId) data.assignedToId = body.assignedToId;
  const inquiry = await prisma.inquiry.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: { actorId: session?.sub, action: "inquiry.patch", entity: "Inquiry", entityId: id, meta: data as object },
  });
  return NextResponse.json(inquiry);
}
