import { Locale, OutboundChannel, OutboundStatus } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { renderApprovedTemplate } from "@/server/communication/templates";
import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";

type DispatchInput = {
  templateKey: string;
  locale: Locale;
  toEmail?: string;
  extra?: Record<string, string>;
};

function hospitalVars(extra: Record<string, string> = {}) {
  return {
    email: HOSPITAL_PROFILE.email,
    ...extra,
  };
}

async function postN8n(pathEnv: string, payload: Record<string, unknown>) {
  const url = process.env[pathEnv]?.trim();
  const secret = process.env.N8N_WEBHOOK_SECRET?.trim();
  if (!url) return "disabled" as const;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret ? { "X-Ram-Hospital-Secret": secret } : {}),
      "User-Agent": "Ram-Hospital-Myanmar/1.0",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  });
  return response.ok ? ("delivered" as const) : ("failed" as const);
}

async function sendNodemailer(to: string, subject: string, text: string, html?: string) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return "disabled" as const;
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? user,
    to,
    subject,
    text,
    html,
  });
  return "sent" as const;
}

export async function dispatchApprovedMessage(input: DispatchInput) {
  const template = await prisma.messageTemplate.findUnique({
    where: { key_locale: { key: input.templateKey, locale: input.locale } },
  });
  if (!template) {
    return;
  }
  const vars = hospitalVars(input.extra);
  const subject = renderApprovedTemplate(template.subject, vars);
  const body = renderApprovedTemplate(template.body, vars);

  const record = await prisma.outboundMessage.create({
    data: {
      channel: OutboundChannel.EMAIL,
      toAddress: input.toEmail ?? process.env.STAFF_ALERT_EMAIL ?? "itsolutions.mm@gmail.com",
      templateKey: input.templateKey,
      locale: input.locale,
      payload: vars,
      status: OutboundStatus.QUEUED,
    },
  });

  const n8n = await postN8n("N8N_INQUIRY_WEBHOOK", {
    event: "ram.hospital.message",
    templateKey: input.templateKey,
    locale: input.locale,
    staffEmail: process.env.STAFF_ALERT_EMAIL ?? "itsolutions.mm@gmail.com",
    guestEmail: input.templateKey === "inquiry.received" ? input.toEmail : "",
    toEmail: record.toAddress,
    subject,
    text: body,
    html: body.replace(/\n/g, "<br/>"),
    vars,
  });

  if (n8n === "delivered") {
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: { status: OutboundStatus.SENT },
    });
    return;
  }

  if (input.toEmail) {
    try {
      const mail = await sendNodemailer(input.toEmail, subject, body);
      await prisma.outboundMessage.update({
        where: { id: record.id },
        data: { status: mail === "sent" ? OutboundStatus.SENT : OutboundStatus.SKIPPED },
      });
    } catch (error) {
      await prisma.outboundMessage.update({
        where: { id: record.id },
        data: {
          status: OutboundStatus.FAILED,
          error: error instanceof Error ? error.message : "mail_failed",
        },
      });
    }
  }
}

export async function notifyTelegram(text: string) {
  await postN8n("N8N_INQUIRY_WEBHOOK", {
    event: "ram.hospital.telegram",
    staffEmail: process.env.STAFF_ALERT_EMAIL ?? "itsolutions.mm@gmail.com",
    telegramChatId: process.env.TELEGRAM_STAFF_CHAT_ID?.trim() || "",
    telegramText: text,
    text,
  });
}

export async function dispatchInquiryConversation(input: {
  locale: Locale;
  guestEmail?: string;
  guestSubject: string;
  guestText: string;
  guestHtml: string;
  staffSubject: string;
  staffText: string;
  staffHtml: string;
  telegramText: string;
}) {
  const staffEmail = process.env.STAFF_ALERT_EMAIL ?? "itsolutions.mm@gmail.com";
  const record = await prisma.outboundMessage.create({
    data: {
      channel: OutboundChannel.EMAIL,
      toAddress: input.guestEmail || staffEmail,
      templateKey: "inquiry.received",
      locale: input.locale,
      payload: { intents: true },
      status: OutboundStatus.QUEUED,
    },
  });

  const n8n = await postN8n("N8N_INQUIRY_WEBHOOK", {
    event: "ram.hospital.inquiry.reply",
    locale: input.locale,
    guestEmail: input.guestEmail || "",
    staffEmail,
    telegramChatId: process.env.TELEGRAM_STAFF_CHAT_ID?.trim() || "",
    webhookSecret: process.env.N8N_WEBHOOK_SECRET?.trim() || "",
    guestSubject: input.guestSubject,
    guestText: input.guestText,
    guestHtml: input.guestHtml,
    staffSubject: input.staffSubject,
    staffText: input.staffText,
    staffHtml: input.staffHtml,
    telegramText: input.telegramText,
    subject: input.guestEmail ? input.guestSubject : input.staffSubject,
    text: input.telegramText,
    html: input.guestEmail ? input.guestHtml : input.staffHtml,
    toEmail: input.guestEmail || staffEmail,
  });

  if (n8n === "delivered") {
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: { status: OutboundStatus.SENT },
    });
    return;
  }

  const fallbackTo = input.guestEmail || staffEmail;
  const fallbackSubject = input.guestEmail ? input.guestSubject : input.staffSubject;
  const fallbackText = input.guestEmail ? input.guestText : input.staffText;
  const fallbackHtml = input.guestEmail ? input.guestHtml : input.staffHtml;
  try {
    const mail = await sendNodemailer(fallbackTo, fallbackSubject, fallbackText, fallbackHtml);
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: { status: mail === "sent" ? OutboundStatus.SENT : OutboundStatus.SKIPPED },
    });
  } catch (error) {
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: {
        status: OutboundStatus.FAILED,
        error: error instanceof Error ? error.message : "mail_failed",
      },
    });
  }
}

/** Promotion follow-up: same n8n Inquiry Alert as inquiry replies, SMTP fallback. */
export async function dispatchGuestPromotion(input: {
  locale: Locale;
  toEmail: string;
  subject: string;
  text: string;
  html: string;
  promotionId: string;
  inquiryId: string;
}) {
  const staffEmail = process.env.STAFF_ALERT_EMAIL ?? "itsolutions.mm@gmail.com";
  const record = await prisma.outboundMessage.create({
    data: {
      channel: OutboundChannel.EMAIL,
      toAddress: input.toEmail,
      templateKey: "promotion.update",
      locale: input.locale,
      payload: { promotionId: input.promotionId, inquiryId: input.inquiryId },
      status: OutboundStatus.QUEUED,
    },
  });

  const staffSubject = `Ram Hospital · promotion follow-up sent (${input.toEmail})`;
  const staffText = `Published promotion mailed to ${input.toEmail}.`;
  const n8n = await postN8n("N8N_INQUIRY_WEBHOOK", {
    event: "ram.hospital.inquiry.reply",
    locale: input.locale,
    guestEmail: input.toEmail,
    staffEmail,
    telegramChatId: "",
    webhookSecret: process.env.N8N_WEBHOOK_SECRET?.trim() || "",
    guestSubject: input.subject,
    guestText: input.text,
    guestHtml: input.html,
    staffSubject,
    staffText,
    staffHtml: `<p>${staffText}</p>`,
    telegramText: "",
    subject: input.subject,
    text: input.text,
    html: input.html,
    toEmail: input.toEmail,
  });

  if (n8n === "delivered") {
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: { status: OutboundStatus.SENT },
    });
    return "sent" as const;
  }

  try {
    const mail = await sendNodemailer(input.toEmail, input.subject, input.text, input.html);
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: {
        status: mail === "sent" ? OutboundStatus.SENT : OutboundStatus.SKIPPED,
        error: mail === "sent" ? null : "n8n_and_smtp_unavailable",
      },
    });
    return mail === "sent" ? ("sent" as const) : ("skipped" as const);
  } catch (error) {
    const message = error instanceof Error ? error.message : "mail_failed";
    await prisma.outboundMessage.update({
      where: { id: record.id },
      data: { status: OutboundStatus.FAILED, error: message },
    });
    return "failed" as const;
  }
}
