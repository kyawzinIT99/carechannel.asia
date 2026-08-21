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

export async function POST(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await request.json();
  const slug = String(body.slug ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });
  const row = await prisma.specialty.create({
    data: {
      slug,
      sourceUrl: body.sourceUrl || "https://www.chiangmairam.com",
      imagePath: body.imagePath || null,
      nameEn: body.nameEn,
      nameMy: body.nameMy,
      nameTh: body.nameTh || body.nameEn,
      summaryEn: body.summaryEn,
      summaryMy: body.summaryMy,
      servicesEn: Array.isArray(body.servicesEn) ? body.servicesEn : lines(body.servicesEn),
      servicesMy: Array.isArray(body.servicesMy) ? body.servicesMy : lines(body.servicesMy),
      hoursEn: body.hoursEn || null,
      hoursMy: body.hoursMy || null,
      sortOrder: Number(body.sortOrder ?? 100),
      published: Boolean(body.published),
      parentId: body.parentId || null,
    },
  });
  revalidatePublicSite();
  return NextResponse.json(row, { status: 201 });
}
