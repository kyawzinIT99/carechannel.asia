import { NextResponse } from "next/server";
import { createInquiry } from "@/server/inquiries/create-inquiry";
import { readSession } from "@/server/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await readSession();
    const patientId = session?.roles.includes("PATIENT") ? session.sub : undefined;
    const inquiry = await createInquiry(body, patientId);
    return NextResponse.json({ id: inquiry.id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
