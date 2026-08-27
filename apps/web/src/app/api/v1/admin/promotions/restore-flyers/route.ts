import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { hasRole, readSession } from "@/server/auth/session";
import { upsertHospitalFlyers } from "@/server/content/hospital-flyers";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function POST() {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const count = await upsertHospitalFlyers();
    revalidatePublicSite();
    return NextResponse.json({ ok: true, count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "save_failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
