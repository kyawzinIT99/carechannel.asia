import { NextResponse } from "next/server";
import { AppointmentStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import { renderApprovedTemplate } from "@/server/communication/templates";

import { secretsEqual } from "@/server/security/http";

function authorized(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  return secretsEqual(request.headers.get("x-ram-hospital-secret"), secret);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);

  const rows = await prisma.appointment.findMany({
    where: {
      status: AppointmentStatus.CONFIRMED,
      preferredDate: { gte: start, lt: end },
    },
    include: { inquiry: true },
  });

  const messages = [];
  for (const row of rows) {
    const template = await prisma.messageTemplate.findUnique({
      where: { key_locale: { key: "appointment.reminder", locale: row.locale } },
    });
    if (!template) continue;
    const text = renderApprovedTemplate(template.body, {
      name: row.inquiry.fullName,
      email: HOSPITAL_PROFILE.email,
    });
    messages.push({
      toEmail: row.inquiry.email,
      locale: row.locale,
      subject: template.subject,
      text,
    });
  }
  return NextResponse.json({ messages });
}
