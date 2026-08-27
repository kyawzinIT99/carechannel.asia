import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession, STAFF_ROLES } from "@/server/auth/session";

export async function GET() {
  const session = await readSession();
  if (!hasRole(session, STAFF_ROLES)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const [totalInquiries, newInquiries, confirmedAppts, promotions] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.promotion.count({ where: { published: true, kind: { not: "flyer" } } }).catch(() =>
      prisma.promotion.count({ where: { published: true } }),
    ),
  ]);
  return NextResponse.json({ totalInquiries, newInquiries, confirmedAppts, promotions });
}
