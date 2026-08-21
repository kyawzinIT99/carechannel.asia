import type { PatientReplyCopy } from "@/server/communication/chatgpt";
import { messengerFooterHtml, messengerFooterText } from "@/catalog/partner-messengers";

const NAVY = "#1a2330";
const GOLD = "#c4a35a";
const SLATE = "#5b6777";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function p(html: string) {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.7;color:${NAVY}">${html}</p>`;
}

export type GuestLayoutInput = {
  locale: "en" | "my";
  copy: PatientReplyCopy;
  visitorMessage: string;
  visitorCode?: string;
  siteLine?: string;
  packageRows: { name: string; list: string; sale: string }[];
  specialtyBlocks: { name: string; summary: string; services: string[] }[];
  extras: string[];
  channel: string;
  location: string;
};

export function fallbackPatientCopy(input: {
  locale: "en" | "my";
  fullName: string;
  message: string;
  visitorCode?: string;
  packageNames: string[];
  specialtyNames: string[];
  extras: string[];
}): PatientReplyCopy {
  const my = input.locale === "my";
  const code = input.visitorCode ? ` ${input.visitorCode}` : "";
  const asked = [...input.packageNames, ...input.specialtyNames].filter(Boolean)[0];
  return {
    greeting: my ? `${input.fullName} ခင်ဗျာ/ရှင်၊` : `Dear ${input.fullName},`,
    paragraphs: my
      ? [
          asked
            ? `ခရီးစဉ် တောင်းဆိုမှု (${asked}) လက်ခံပါသည်။ ကုဒ်:${code || " —"}။ ညှိနှိုင်းရေးမှူးက မကြာမီ ဆက်ပြောပါမည်။`
            : `ခရီးစဉ် တောင်းဆိုမှု လက်ခံပါသည်။ ကုဒ်:${code || " —"}။ ညှိနှိုင်းရေးမှူးက မကြာမီ ဆက်ပြောပါမည်။`,
        ]
      : [
          asked
            ? `We received your visit request (${asked}). Your code is${code || " —"}. A coordinator will continue with you shortly.`
            : `We received your visit request. Your code is${code || " —"}. A coordinator will continue with you shortly.`,
        ],
    nextSteps: my
      ? ["LINE၊ Telegram သို့မဟုတ် Viber မှ ဆက်ပြောပါ"]
      : ["Continue on LINE, Telegram, or Viber"],
  };
}

export function renderGuestEmailHtml(input: GuestLayoutInput) {
  const my = input.locale === "my";
  const brand = my ? "ချင်းမိုင်ရမ်ဆေးရုံ" : "Chiangmai Ram Hospital Myanmar";
  const kicker = my ? "မိတ်ဖက် ခရီးစဉ်" : "Partner visit";
  const paragraphs = input.copy.paragraphs.map((row) => p(escapeHtml(row))).join("");
  const pkg = input.packageRows[0];
  const spec = input.specialtyBlocks[0];
  const codeLine = input.visitorCode
    ? `<p style="margin:0 0 16px;font-size:20px;font-weight:700;letter-spacing:.08em;color:${GOLD}">${escapeHtml(input.visitorCode)}</p>`
    : "";

  return `<!DOCTYPE html>
<html><body style="margin:0;background:#f3f5f8;padding:24px 12px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;font-family:'Noto Sans','Noto Sans Myanmar',Arial,sans-serif">
    <tr><td style="background:${NAVY};padding:22px 28px">
      <p style="margin:0 0 6px;letter-spacing:.18em;font-size:11px;color:${GOLD};text-transform:uppercase">${escapeHtml(kicker)}</p>
      <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff">${escapeHtml(brand)}</p>
    </td></tr>
    <tr><td style="height:4px;background:${GOLD}"></td></tr>
    <tr><td style="padding:24px 28px">
      ${p(`<strong>${escapeHtml(input.copy.greeting)}</strong>`)}
      ${paragraphs}
      ${codeLine}
      ${pkg ? `<p style="margin:0 0 12px;font-size:14px;color:${NAVY}">${escapeHtml(pkg.name)} — <strong>${escapeHtml(pkg.sale)}</strong></p>` : ""}
      ${spec ? `<p style="margin:0 0 12px;font-size:14px;color:${NAVY}">${escapeHtml(spec.name)}</p>` : ""}
    </td></tr>
    <tr><td style="padding:16px 28px 24px;background:#f7f8fa;color:${SLATE};font-size:13px;line-height:1.6">
      ${messengerFooterHtml(input.locale)}
    </td></tr>
  </table>
</body></html>`;
}

export function renderGuestEmailText(input: GuestLayoutInput) {
  const pkg = input.packageRows[0];
  const spec = input.specialtyBlocks[0];
  return [
    input.copy.greeting,
    "",
    ...input.copy.paragraphs,
    input.visitorCode || "",
    pkg ? `${pkg.name}: ${pkg.sale}` : "",
    spec ? spec.name : "",
    "",
    messengerFooterText(input.locale),
  ]
    .filter((row) => row !== "")
    .join("\n");
}

export function renderStaffEmailHtml(input: {
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  returningPatient?: boolean;
  visitorCode?: string;
  passportNo?: string;
  specialtySlug?: string;
  packageCode?: string;
  preferredDate?: string;
  interpreter?: string;
  message: string;
  intents: string[];
}) {
  return `<div style="font-family:Noto Sans,Arial,sans-serif;color:${NAVY};line-height:1.55;font-size:14px">
    <p style="margin:0 0 8px;letter-spacing:.16em;font-size:11px;color:${GOLD};text-transform:uppercase">New inquiry</p>
    <p style="margin:0 0 12px;font-size:18px;font-weight:700">${escapeHtml(input.fullName)}</p>
    <p style="margin:0 0 4px"><b>${escapeHtml(input.visitorCode || "—")}</b> · ${escapeHtml(input.passportNo || "no passport")}</p>
    <p style="margin:0 0 4px">${escapeHtml(input.phone)}${input.email ? ` · ${escapeHtml(input.email)}` : ""}</p>
    <p style="margin:0 0 4px">${escapeHtml(input.country || "—")} · ${escapeHtml(input.packageCode || input.specialtySlug || "general")}</p>
    <p style="margin:12px 0 0">${escapeHtml(input.message.slice(0, 280))}</p>
  </div>`;
}

export function renderStaffTelegramHtml(input: {
  fullName: string;
  phone: string;
  country?: string;
  returningPatient?: boolean;
  visitorCode?: string;
  passportNo?: string;
  packageCode?: string;
  specialtySlug?: string;
  message: string;
  extras: string[];
}) {
  return [
    `<b>New inquiry</b> ${input.visitorCode ? `<b>${escapeHtml(input.visitorCode)}</b>` : ""}`,
    `<b>${escapeHtml(input.fullName)}</b>`,
    input.passportNo ? `Passport: ${escapeHtml(input.passportNo)}` : "",
    `${escapeHtml(input.phone)}${input.country ? ` · ${escapeHtml(input.country)}` : ""}`,
    input.packageCode ? `Package: ${escapeHtml(input.packageCode)}` : "",
    input.specialtySlug ? `Centre: ${escapeHtml(input.specialtySlug)}` : "",
    input.extras.length ? input.extras.map((row) => escapeHtml(row)).join(" · ") : "",
    "",
    escapeHtml(input.message.slice(0, 200)),
  ]
    .filter((row) => row !== "")
    .join("\n")
    .slice(0, 1200);
}
