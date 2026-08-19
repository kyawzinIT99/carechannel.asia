import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { hasRole, readSession } from "@/server/auth/session";
import { inquiriesToCsv, listInquiryReports } from "@/server/inquiries/report";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function GET(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const status = url.searchParams.get("status") === "NEW" ? "NEW" : undefined;
  const rows = await listInquiryReports(status);
  const csv = inquiriesToCsv(rows);
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ram-hospital-inquiries-${stamp}.csv"`,
    },
  });
}
