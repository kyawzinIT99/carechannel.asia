import { NextResponse } from "next/server";
import { createInquiry } from "@/server/inquiries/create-inquiry";
import { readSession } from "@/server/auth/session";
import { clientIp, rateLimit } from "@/server/security/http";

export async function POST(request: Request) {
  if (!rateLimit(`inq:${clientIp(request)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "too_many" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const session = await readSession();
    const patientId = session?.roles.includes("PATIENT") ? session.sub : undefined;
    const inquiry = await createInquiry(body, patientId);
    return NextResponse.json({ id: inquiry.id, visitorCode: inquiry.visitorCode }, { status: 201 });
  } catch (err) {
    console.error("public inquiry failed", err);
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
