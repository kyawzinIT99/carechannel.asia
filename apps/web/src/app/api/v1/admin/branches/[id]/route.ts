import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { hasRole, readSession } from "@/server/auth/session";
import { deleteBranch, updateBranch } from "@/server/db/branches";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  try {
    const body = await request.json();
    const data: Parameters<typeof updateBranch>[1] = {};
    for (const key of ["nameEn", "nameMy", "detailEn", "detailMy", "mapQuery", "status"] as const) {
      if (typeof body[key] === "string") data[key] = body[key];
    }
    if (typeof body.published === "boolean") data.published = body.published;
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder);
    const row = await updateBranch(id, data);
    revalidatePublicSite();
    return NextResponse.json(row);
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await deleteBranch(id);
  revalidatePublicSite();
  return NextResponse.json({ ok: true });
}
