import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { Role } from "@prisma/client";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { key } = await context.params;
  const { locale, subject, body } = await request.json();
  const tpl = await prisma.messageTemplate.update({
    where: { key_locale: { key, locale } },
    data: { subject, body },
  });
  return NextResponse.json(tpl);
}
