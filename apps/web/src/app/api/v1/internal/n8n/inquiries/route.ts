import { NextResponse } from "next/server";
import { ingestExternalInquiry } from "@/server/inquiries/create-inquiry";
import { secretsEqual } from "@/server/security/http";

function authorized(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  return secretsEqual(request.headers.get("x-ram-hospital-secret"), secret);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const inquiry = await ingestExternalInquiry(body);
    return NextResponse.json({ id: inquiry.id, visitorCode: inquiry.visitorCode, ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
