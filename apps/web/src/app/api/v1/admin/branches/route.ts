import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { hasRole, readSession } from "@/server/auth/session";
import { createBranch } from "@/server/db/branches";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function POST(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const code = String(body.code ?? "").toUpperCase().replace(/\s+/g, "_").trim();
    if (!code || !body.nameEn || !body.nameMy || !body.detailEn || !body.detailMy) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }
    const row = await createBranch({
      code,
      nameEn: String(body.nameEn),
      nameMy: String(body.nameMy),
      detailEn: String(body.detailEn),
      detailMy: String(body.detailMy),
      mapQuery: String(body.mapQuery || body.nameEn),
      status: body.status === "opening_soon" ? "opening_soon" : "open",
      sortOrder: Number(body.sortOrder ?? 100),
      published: Boolean(body.published ?? true),
    });
    revalidatePublicSite();
    return NextResponse.json(row, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
