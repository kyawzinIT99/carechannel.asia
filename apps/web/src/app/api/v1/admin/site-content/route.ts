import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { hasRole, readSession } from "@/server/auth/session";
import { upsertSiteContent } from "@/server/db/site-content";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function PATCH(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const rows: { key: string; valueEn: string; valueMy: string }[] = Array.isArray(body?.rows) ? body.rows : [];
    for (const row of rows) {
      if (!row.key) continue;
      await upsertSiteContent({
        key: String(row.key),
        valueEn: String(row.valueEn ?? ""),
        valueMy: String(row.valueMy ?? ""),
      });
    }
    revalidatePublicSite();
    return NextResponse.json({ ok: true, count: rows.length });
  } catch (error) {
    return NextResponse.json({ error: "save_failed" }, { status: 400 });
  }
}
