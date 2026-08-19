import { NextResponse } from "next/server";
import { Locale, Role } from "@prisma/client";
import { HOSPITAL_PROFILE, PARTNER_CHANNEL } from "@/catalog/hospital-source";
import { hasRole, readSession } from "@/server/auth/session";
import { dispatchGuestPromotion, notifyTelegram } from "@/server/automation/dispatch";
import { renderGuestEmailHtml, renderGuestEmailText } from "@/server/communication/message-format";
import { prisma } from "@/server/db/prisma";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function POST(request: Request) {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as { inquiryIds?: string[]; promotionId?: string };
  const inquiryIds = Array.isArray(body.inquiryIds) ? body.inquiryIds.slice(0, 40) : [];
  const promotionId = body.promotionId?.trim();
  if (!inquiryIds.length || !promotionId) {
    return NextResponse.json({ error: "select_visitors_and_promotion" }, { status: 400 });
  }

  const promotion = await prisma.promotion.findUnique({ where: { id: promotionId } });
  if (!promotion || !promotion.published) {
    return NextResponse.json({ error: "promotion_not_published" }, { status: 400 });
  }

  const inquiries = await prisma.inquiry.findMany({
    where: { id: { in: inquiryIds } },
  });

  const results = { sent: 0, skipped: 0, failed: 0, noEmail: 0 };

  for (const row of inquiries) {
    const email = row.email?.trim();
    if (!email) {
      results.noEmail += 1;
      continue;
    }
    const locale: Locale = row.locale === "my" ? "my" : "en";
    const my = locale === "my";
    const title = my ? promotion.titleMy : promotion.titleEn;
    const bodyText = my ? promotion.bodyMy : promotion.bodyEn;
    const copy = {
      greeting: my ? `${row.fullName} ခင်ဗျာ/ရှင်၊` : `Dear ${row.fullName},`,
      paragraphs: [
        my
          ? "သင့်ခရီးစဉ် တောင်းဆိုမှုအရ ဆေးရုံထုတ်ပြန်သည့် ပရိုမိုးရှင်း အသစ်ကို ပေးပို့ပါသည်။ ရောဂါမရှာပါ။"
          : "Following your visit request, here is an updated hospital-published promotion. This is not a diagnosis.",
        title,
        bodyText,
      ],
      nextSteps: my
        ? ["LINE / Telegram / Viber သို့မဟုတ် ဤဝက်ဘ်ဆိုက်မှသာ incentive ကို အတည်ပြုပါ", "ညှိနှိုင်းရေးမှူးက ခရီးစဉ်ကို ဆက်လက် ကူညီပါမည်"]
        : ["Confirm the incentive only on this website, LINE, Telegram, or Viber", "A coordinator will continue with your visit plan"],
    };
    const html = renderGuestEmailHtml({
      locale: my ? "my" : "en",
      copy,
      visitorMessage: row.message,
      packageRows: [],
      specialtyBlocks: [],
      extras: [],
      channel: PARTNER_CHANNEL[my ? "my" : "en"],
      location: my ? HOSPITAL_PROFILE.locationNoteMy : HOSPITAL_PROFILE.locationNoteEn,
    });
    const text = renderGuestEmailText({
      locale: my ? "my" : "en",
      copy,
      visitorMessage: row.message,
      packageRows: [],
      specialtyBlocks: [],
      extras: [],
      channel: PARTNER_CHANNEL[my ? "my" : "en"],
      location: my ? HOSPITAL_PROFILE.locationNoteMy : HOSPITAL_PROFILE.locationNoteEn,
    });
    const subject = my
      ? `ချင်းမိုင်ရမ် · ပရိုမိုးရှင်း အသစ် — ${promotion.titleMy}`
      : `Chiangmai Ram · updated promotion — ${promotion.titleEn}`;
    const status = await dispatchGuestPromotion({
      locale,
      toEmail: email,
      subject,
      text,
      html,
      promotionId: promotion.id,
      inquiryId: row.id,
    });
    if (status === "sent") results.sent += 1;
    else if (status === "failed") results.failed += 1;
    else results.skipped += 1;
  }

  await prisma.auditLog.create({
    data: {
      actorId: session.sub,
      action: "inquiry.promote",
      entity: "Promotion",
      entityId: promotion.id,
      meta: { inquiryIds, ...results },
    },
  });

  await notifyTelegram(
    [
      "<b>Chiangmai Ram · promotion sent</b>",
      escapeTelegram(promotion.titleEn),
      `Sent ${results.sent} · skipped ${results.skipped} · failed ${results.failed} · no email ${results.noEmail}`,
    ].join("\n"),
  );

  return NextResponse.json(results);
}

function escapeTelegram(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
