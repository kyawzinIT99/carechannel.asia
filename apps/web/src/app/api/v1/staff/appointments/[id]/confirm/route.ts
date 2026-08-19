import { NextResponse } from "next/server";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession, STAFF_ROLES } from "@/server/auth/session";
import { dispatchApprovedMessage } from "@/server/automation/dispatch";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!hasRole(session, STAFF_ROLES)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await context.params;
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { status: AppointmentStatus.CONFIRMED },
    include: { inquiry: true },
  });
  await prisma.inquiry.update({
    where: { id: appointment.inquiryId },
    data: { status: "CONTACTED" },
  });
  await prisma.auditLog.create({
    data: {
      actorId: session?.sub,
      action: "appointment.confirm",
      entity: "Appointment",
      entityId: appointment.id,
    },
  });
  if (appointment.inquiry.email) {
    await dispatchApprovedMessage({
      templateKey: "appointment.confirmed",
      locale: appointment.locale,
      toEmail: appointment.inquiry.email,
      extra: { name: appointment.inquiry.fullName },
    });
  }
  return NextResponse.json({ ok: true });
}
