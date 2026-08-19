import { NextResponse } from "next/server";
import { Locale } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import { renderApprovedTemplate } from "@/server/communication/templates";

function authorized(request: Request) {
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("x-ram-hospital-secret") === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as {
    locale?: "en" | "my";
    text?: string;
  };
  const locale = (body.locale === "my" ? "my" : "en") as Locale;
  const template = await prisma.messageTemplate.findUnique({
    where: { key_locale: { key: "telegram.help", locale } },
  });
  if (!template) {
    return NextResponse.json({ error: "no_template" }, { status: 500 });
  }
  const text = renderApprovedTemplate(template.body, {
    email: HOSPITAL_PROFILE.email,
  });
  return NextResponse.json({ text });
}
