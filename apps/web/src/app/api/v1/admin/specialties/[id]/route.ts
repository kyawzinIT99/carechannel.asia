import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { Role } from "@prisma/client";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

function lines(value: unknown) {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const data: Record<string, unknown> = {};
  for (const key of ["nameEn", "nameMy", "nameTh", "summaryEn", "summaryMy", "imagePath", "hoursEn", "hoursMy", "sourceUrl"] as const) {
    if (typeof body[key] === "string") data[key] = body[key] || null;
  }
  if (typeof body.published === "boolean") data.published = body.published;
  if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
  if (body.servicesEn !== undefined) data.servicesEn = Array.isArray(body.servicesEn) ? body.servicesEn : lines(body.servicesEn);
  if (body.servicesMy !== undefined) data.servicesMy = Array.isArray(body.servicesMy) ? body.servicesMy : lines(body.servicesMy);
  const row = await prisma.specialty.update({ where: { id }, data: data as never });
  revalidatePublicSite();
  return NextResponse.json(row);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await prisma.specialty.delete({ where: { id } });
  revalidatePublicSite();
  return NextResponse.json({ ok: true });
}
