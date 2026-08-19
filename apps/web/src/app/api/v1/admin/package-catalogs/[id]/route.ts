import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { Role } from "@prisma/client";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  for (const key of ["nameEn", "nameMy", "notesEn", "notesMy", "sourceUrl"] as const) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  if (body.validFrom) data.validFrom = new Date(body.validFrom);
  if (body.validTo) data.validTo = new Date(body.validTo);
  const catalog = await prisma.packageCatalog.update({ where: { id }, data: data as never });
  return NextResponse.json(catalog);
}
