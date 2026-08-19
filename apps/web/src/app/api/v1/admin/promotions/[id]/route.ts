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
  for (const key of ["titleEn", "titleMy", "bodyEn", "bodyMy", "imagePath"] as const) {
    if (typeof body[key] === "string") data[key] = body[key];
  }
  if (typeof body.published === "boolean") data.published = body.published;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  const promo = await prisma.promotion.update({ where: { id }, data: data as never });
  return NextResponse.json(promo);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await prisma.promotion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
