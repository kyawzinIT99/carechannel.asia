import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";

export const PARTNER_MESSENGERS = [
  { key: "line", label: "LINE", href: HOSPITAL_PROFILE.lineUrl },
  { key: "telegram", label: "Telegram", href: HOSPITAL_PROFILE.telegramUrl },
  { key: "viber", label: "Viber", href: HOSPITAL_PROFILE.viberUrl },
] as const;

export function messengerFooterText(locale: "en" | "my") {
  const line = HOSPITAL_PROFILE.chatPhoneDisplay;
  const viber = HOSPITAL_PROFILE.viberDisplay;
  if (locale === "my") {
    return `တရားဝင် incentive ခရီးစဉ်: ဤဝက်ဘ်ဆိုက်၊ LINE (${line})၊ Telegram သို့မဟုတ် Viber (${viber}) မှသာ ဆက်သွယ်ပါ။ Facebook မှ မဟုတ်ပါ။`;
  }
  return `Official incentive visit: continue only on this website, LINE (${line}), Telegram, or Viber (${viber}). Not Facebook.`;
}

export function messengerFooterHtml(locale: "en" | "my") {
  const items = PARTNER_MESSENGERS.map(
    (ch) =>
      `<a href="${ch.href}" style="color:#0b4f9c;margin-right:12px;font-weight:600">${ch.label}</a>`,
  ).join("");
  const numbers =
    locale === "my"
      ? `LINE: ${HOSPITAL_PROFILE.chatPhoneDisplay} · Viber: ${HOSPITAL_PROFILE.viberDisplay}`
      : `LINE: ${HOSPITAL_PROFILE.chatPhoneDisplay} · Viber: ${HOSPITAL_PROFILE.viberDisplay}`;
  const lead =
    locale === "my"
      ? "တရားဝင် incentive ပမာဏနှင့် ခရီးစဉ်ကို ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှသာ ဆက်လက် အတည်ပြုပါ။"
      : "Confirm the official incentive amount and visit plan only on this website, LINE, Telegram, or Viber.";
  return `<p style="margin:0 0 8px">${lead}</p><p style="margin:0 0 8px">${numbers}</p><p style="margin:0">${items}</p>`;
}
