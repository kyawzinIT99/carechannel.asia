import type { PatientReplyCopy } from "@/server/communication/chatgpt";
import { messengerFooterHtml, messengerFooterText } from "@/catalog/partner-messengers";

const NAVY = "#1a2330";
const BLUE = "#0b4f9c";
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
  packageNames: string[];
  specialtyNames: string[];
  extras: string[];
}): PatientReplyCopy {
  const my = input.locale === "my";
  const asked = [
    ...input.packageNames,
    ...input.specialtyNames,
    ...input.extras,
  ].filter(Boolean);
  const about = asked.length
    ? asked.join(my ? "၊ " : ", ")
    : my
      ? "သင့်ခရီးစဉ် တောင်းဆိုမှု"
      : "your visit request";
  return {
    greeting: my ? `${input.fullName} ခင်ဗျာ/ရှင်၊` : `Dear ${input.fullName},`,
    paragraphs: my
      ? [
          `ချင်းမိုင်ရမ် မိတ်ဖက်လမ်းကြောင်းမှ ${about} ကို လက်ခံပါသည်။ ဤစာသည် ဆေးရုံထုတ်ပြန်ချက်အပေါ် အခြေခံပြီး ရောဂါမရှာပေးပါ။`,
          input.message
            ? `သင့်မက်ဆေ့ဂျ်: “${input.message.slice(0, 280)}” — ညှိနှိုင်းရေးမှူးက ဤအချက်များကို အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက် အတည်ပြုပါမည်။`
            : "ညှိနှိုင်းရေးမှူးက ခရီးစဉ်ကို အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက် ကူညီပါမည်။",
        ]
      : [
          `Thank you for writing through the official Myanmar partner channel about ${about}. This message uses hospital-published information only and does not diagnose.`,
          input.message
            ? `We read your note (“${input.message.slice(0, 280)}”). A coordinator will continue from here by email and Telegram until the visit plan is clear.`
            : "A coordinator will continue with you by email and Telegram until the visit plan is clear.",
        ],
    nextSteps: my
      ? [
          "တောင်းဆိုသည့် ပက်ကေ့ချ် သို့မဟုတ် ဌာနကို ဆေးရုံထုတ်ပြန်ချက်နှင့် တိုက်ဆိုင်အတည်ပြုမည်",
          "လာရောက်မည့်နေ့နှင့် နေရာကို Telegram / အီးမေးလ်ဖြင့် ညှိမည်",
          "လေဆိပ်ကား သို့မဟုတ် နေထိုင်ရန် တောင်းထားပါက ပက်ကေ့ချ်ပြင်ပ အဖြစ် သီးခြား အတည်ပြုမည်",
        ]
      : [
          "Match your request to hospital-published packages or centres",
          "Confirm preferred date and campus by email and Telegram",
          "If you asked for airport pickup or a rental apartment, we help only if you want it — not as a hotel or checkup package",
        ],
  };
}

export function renderGuestEmailHtml(input: GuestLayoutInput) {
  const my = input.locale === "my";
  const brand = my ? "ချင်းမိုင်ရမ်ဆေးရုံ" : "Chiangmai Ram Hospital Myanmar";
  const kicker = my ? "မြန်မာ မိတ်ဖက် ခရီးစဉ်" : "Myanmar partner visit channel";
  const nextTitle = my ? "နောက်တစ်ဆင့်" : "What happens next";
  const requestTitle = my ? "သင့်တောင်းဆိုမှု" : "Your request";
  const pkgTitle = my ? "ပက်ကေ့ချ် (ဆေးရုံထုတ်ပြန်ချက်)" : "Packages (hospital-published)";
  const specTitle = my ? "ဌာန (ဆေးရုံထုတ်ပြန်ချက်)" : "Centres (hospital-published)";
  const paragraphs = input.copy.paragraphs.map((row) => p(escapeHtml(row))).join("");
  const steps = input.copy.nextSteps
    .map(
      (row, i) =>
        `<tr><td style="padding:8px 0;vertical-align:top;color:${GOLD};font-weight:700;width:28px">${i + 1}.</td><td style="padding:8px 0;color:${NAVY};font-size:14px;line-height:1.6">${escapeHtml(row)}</td></tr>`,
    )
    .join("");
  const pkgRows = input.packageRows
    .map(
      (row) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e8edf3">${escapeHtml(row.name)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8edf3;color:${SLATE};text-decoration:line-through">${escapeHtml(row.list)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e8edf3;font-weight:700;color:${BLUE}">${escapeHtml(row.sale)}</td>
        </tr>`,
    )
    .join("");
  const specs = input.specialtyBlocks
    .map((block) => {
      const services = block.services
        .slice(0, 8)
        .map((s) => `<li style="margin:0 0 4px">${escapeHtml(s)}</li>`)
        .join("");
      return `<h3 style="margin:18px 0 8px;font-size:16px;color:${BLUE}">${escapeHtml(block.name)}</h3>
        <p style="margin:0 0 8px;color:${SLATE};font-size:14px;line-height:1.6">${escapeHtml(block.summary)}</p>
        <ul style="margin:0;padding-left:18px;color:${NAVY};font-size:14px">${services}</ul>`;
    })
    .join("");
  const extras = input.extras
    .map((row) => `<p style="margin:0 0 8px;font-size:14px;color:${NAVY}">• ${escapeHtml(row)}</p>`)
    .join("");

  return `<!DOCTYPE html>
<html><body style="margin:0;background:#f3f5f8;padding:24px 12px">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;font-family:'Noto Sans','Noto Sans Myanmar',Arial,sans-serif">
    <tr><td style="background:${NAVY};padding:28px 32px">
      <p style="margin:0 0 6px;letter-spacing:.18em;font-size:11px;color:${GOLD};text-transform:uppercase">${escapeHtml(kicker)}</p>
      <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff">${escapeHtml(brand)}</p>
    </td></tr>
    <tr><td style="height:4px;background:${GOLD}"></td></tr>
    <tr><td style="padding:28px 32px">
      ${p(`<strong>${escapeHtml(input.copy.greeting)}</strong>`)}
      ${paragraphs}
      ${
        input.copy.nextSteps.length
          ? `<table role="presentation" width="100%" style="margin:8px 0 20px;background:#f7f4ec;border-radius:12px"><tr><td style="padding:16px 18px">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${GOLD};font-weight:700">${escapeHtml(nextTitle)}</p>
              <table role="presentation" width="100%">${steps}</table>
            </td></tr></table>`
          : ""
      }
      ${
        input.visitorMessage
          ? `<p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${SLATE};font-weight:700">${escapeHtml(requestTitle)}</p>
             <p style="margin:0 0 18px;padding:12px 14px;background:#f4f7fb;border-left:3px solid ${BLUE};font-size:14px;color:${NAVY};line-height:1.6">${escapeHtml(input.visitorMessage)}</p>`
          : ""
      }
      ${input.siteLine ? p(escapeHtml(input.siteLine)) : ""}
      ${
        pkgRows
          ? `<p style="margin:8px 0 10px;font-size:13px;font-weight:700;color:${BLUE}">${escapeHtml(pkgTitle)}</p>
             <table role="presentation" width="100%" cellspacing="0" style="border:1px solid #e8edf3;border-radius:10px;overflow:hidden;font-size:14px">
               <tr style="background:#f4f7fb;color:${SLATE}">
                 <th align="left" style="padding:10px 12px">${my ? "ပက်ကေ့ချ်" : "Package"}</th>
                 <th align="left" style="padding:10px 12px">${my ? "စာရင်း" : "List"}</th>
                 <th align="left" style="padding:10px 12px">${my ? "ပရိုမိုးရှင်း" : "Promotion"}</th>
               </tr>
               ${pkgRows}
             </table>`
          : ""
      }
      ${specs ? `<p style="margin:22px 0 0;font-size:13px;font-weight:700;color:${BLUE}">${escapeHtml(specTitle)}</p>${specs}` : ""}
      ${extras}
    </td></tr>
    <tr><td style="padding:20px 32px 28px;background:#f7f8fa;color:${SLATE};font-size:13px;line-height:1.6">
      <p style="margin:0 0 8px">${escapeHtml(input.channel)}</p>
      <p style="margin:0 0 8px">${escapeHtml(input.location)}</p>
      ${messengerFooterHtml(input.locale)}
    </td></tr>
  </table>
</body></html>`;
}

export function renderGuestEmailText(input: GuestLayoutInput) {
  const lines = [
    input.copy.greeting,
    "",
    ...input.copy.paragraphs,
    "",
    ...(input.copy.nextSteps.length ? ["Next:", ...input.copy.nextSteps.map((s, i) => `${i + 1}. ${s}`), ""] : []),
    input.visitorMessage ? `Your request: ${input.visitorMessage}` : "",
    input.siteLine || "",
    ...input.packageRows.map((row) => `${row.name}: ${row.sale} (list ${row.list})`),
    ...input.specialtyBlocks.map((b) => `${b.name}\n${b.summary}`),
    ...input.extras,
    "",
    input.channel,
    input.location,
    messengerFooterText(input.locale),
  ];
  return lines.filter((row) => row !== "").join("\n");
}

export function renderStaffEmailHtml(input: {
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  returningPatient?: boolean;
  visitorCode?: string;
  specialtySlug?: string;
  packageCode?: string;
  preferredDate?: string;
  interpreter?: string;
  message: string;
  intents: string[];
  guestHtml: string;
}) {
  return `<div style="font-family:Noto Sans,Arial,sans-serif;color:${NAVY};line-height:1.6">
    <p style="margin:0 0 4px;letter-spacing:.16em;font-size:11px;color:${GOLD};text-transform:uppercase">Staff alert</p>
    <h2 style="margin:0 0 16px;color:${NAVY}">New partner inquiry — ${escapeHtml(input.fullName)}</h2>
    <table role="presentation" cellspacing="0" style="font-size:14px;margin-bottom:20px">
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Incentive code</td><td>${escapeHtml(input.visitorCode || "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Phone</td><td>${escapeHtml(input.phone)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Email</td><td>${escapeHtml(input.email || "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Country</td><td>${escapeHtml(input.country || "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Returning patient</td><td>${input.returningPatient ? "yes" : "no"}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Package</td><td>${escapeHtml(input.packageCode || "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Centre</td><td>${escapeHtml(input.specialtySlug || "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Date</td><td>${escapeHtml(input.preferredDate || "—")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Interpreter</td><td>${escapeHtml(input.interpreter || "no")}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:${SLATE}">Intents</td><td>${escapeHtml(input.intents.join(", ") || "general")}</td></tr>
    </table>
    <p><strong>Guest message</strong><br/>${escapeHtml(input.message)}</p>
    <hr style="border:none;border-top:1px solid #e8edf3;margin:24px 0"/>
    <p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${SLATE}">Guest reply already sent</p>
    ${input.guestHtml}
  </div>`;
}

export function renderStaffTelegramHtml(input: {
  fullName: string;
  phone: string;
  country?: string;
  returningPatient?: boolean;
  visitorCode?: string;
  packageCode?: string;
  specialtySlug?: string;
  message: string;
  copy: PatientReplyCopy;
  extras: string[];
}) {
  const preview = [input.copy.greeting, ...input.copy.paragraphs].join("\n").slice(0, 900);
  const extras = input.extras.length ? `\n${input.extras.map((row) => `• ${escapeHtml(row)}`).join("\n")}` : "";
  return [
    `<b>Chiangmai Ram · new visit request</b>`,
    "",
    `<b>${escapeHtml(input.fullName)}</b>`,
    input.visitorCode ? `Incentive code: <b>${escapeHtml(input.visitorCode)}</b>` : "",
    `${escapeHtml(input.phone)}${input.country ? ` · ${escapeHtml(input.country)}` : ""}`,
    `Returning patient: ${input.returningPatient ? "yes" : "no"}`,
    `Package: ${escapeHtml(input.packageCode || "—")}`,
    `Centre: ${escapeHtml(input.specialtySlug || "—")}`,
    extras,
    "",
    `<b>Guest wrote</b>`,
    escapeHtml(input.message.slice(0, 500)),
    "",
    `<b>Reply sent to guest</b>`,
    escapeHtml(preview),
    "",
    escapeHtml(messengerFooterText("en")),
  ]
    .filter((row) => row !== undefined)
    .join("\n")
    .slice(0, 3900);
}
