import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { Role } from "@prisma/client";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

function promoData(body: Record<string, unknown>) {
  const kind = String(body.kind ?? "announcement").trim() === "flyer" ? "flyer" : "announcement";
  const flyerGroup = String(body.flyerGroup ?? "").trim();
  return {
    titleEn: String(body.titleEn ?? "").trim(),
    titleMy: String(body.titleMy ?? "").trim(),
    bodyEn: String(body.bodyEn ?? "").trim(),
    bodyMy: String(body.bodyMy ?? "").trim(),
    imagePath: body.imagePath ? String(body.imagePath).trim() || null : null,
    kind,
    flyerGroup: kind === "flyer" && (flyerGroup === "checkup" || flyerGroup === "specialty" || flyerGroup === "hospital")
      ? flyerGroup
      : null,
    sortOrder: Number(body.sortOrder ?? 100),
    published: Boolean(body.published),
  };
}

export async function GET() {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.promotion.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = promoData(await request.json());
  if (!body.titleEn || !body.titleMy || !body.bodyEn || !body.bodyMy) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  try {
    const promo = await prisma.promotion.create({ data: body });
    revalidatePublicSite();
    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
