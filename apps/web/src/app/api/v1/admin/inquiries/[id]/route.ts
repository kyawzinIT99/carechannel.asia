import { NextResponse } from "next/server";
import { InquiryStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession, STAFF_ROLES } from "@/server/auth/session";

const STATUSES = new Set<string>(Object.values(InquiryStatus));

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!hasRole(session, STAFF_ROLES)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const data: { status?: InquiryStatus; assignedToId?: string } = {};
  if (typeof body.status === "string" && STATUSES.has(body.status)) {
    data.status = body.status as InquiryStatus;
  }
  if (typeof body.assignedToId === "string" && body.assignedToId.length > 0 && body.assignedToId.length < 64) {
    data.assignedToId = body.assignedToId;
  }
  if (!data.status && !data.assignedToId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const inquiry = await prisma.inquiry.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: { actorId: session?.sub, action: "inquiry.patch", entity: "Inquiry", entityId: id, meta: data as object },
  });
  return NextResponse.json(inquiry);
}
