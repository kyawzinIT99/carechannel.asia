import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { Role } from "@prisma/client";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

function money(value: unknown) {
  const n = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const data: {
    published?: boolean;
    highlight?: string | null;
    nameEn?: string;
    nameMy?: string;
    gender?: "ANY" | "MALE" | "FEMALE";
    listPrice?: number;
    salePrice?: number;
    featuresEn?: string[];
    featuresMy?: string[];
  } = {};
  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.highlight === "string") data.highlight = body.highlight || null;
  if (typeof body.nameEn === "string") data.nameEn = body.nameEn;
  if (typeof body.nameMy === "string") data.nameMy = body.nameMy;
  if (body.gender === "ANY" || body.gender === "MALE" || body.gender === "FEMALE") {
    data.gender = body.gender;
  }
  if (body.listPrice !== undefined) {
    const n = money(body.listPrice);
    if (!Number.isFinite(n)) return NextResponse.json({ error: "invalid_list_price" }, { status: 400 });
    data.listPrice = n;
  }
  if (body.salePrice !== undefined) {
    const n = money(body.salePrice);
    if (!Number.isFinite(n)) return NextResponse.json({ error: "invalid_sale_price" }, { status: 400 });
    data.salePrice = n;
  }
  if (typeof body.featuresEn === "string") {
    data.featuresEn = body.featuresEn.split("\n").map((s: string) => s.trim()).filter(Boolean);
  } else if (Array.isArray(body.featuresEn)) {
    data.featuresEn = body.featuresEn.map(String);
  }
  if (typeof body.featuresMy === "string") {
    data.featuresMy = body.featuresMy.split("\n").map((s: string) => s.trim()).filter(Boolean);
  } else if (Array.isArray(body.featuresMy)) {
    data.featuresMy = body.featuresMy.map(String);
  }
  try {
    const pkg = await prisma.package.update({ where: { id }, data });
    revalidatePublicSite();
    return NextResponse.json(pkg);
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await prisma.package.delete({ where: { id } });
  revalidatePublicSite();
  return NextResponse.json({ ok: true });
}
