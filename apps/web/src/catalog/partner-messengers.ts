import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import { lineHttpUrl, telegramHttpUrl } from "@/server/security/messengers";

const site = (process.env.SITE_URL || "https://carechannel.onrender.com").replace(/\/$/, "");

export function PARTNER_MESSENGERS(locale: "en" | "my") {
  return [
    { key: "line", label: "LINE", href: lineHttpUrl(HOSPITAL_PROFILE.chatPhoneDisplay) },
    { key: "telegram", label: "Telegram", href: telegramHttpUrl("", HOSPITAL_PROFILE.chatPhoneDisplay) },
    { key: "viber", label: "Viber", href: `${site}/${locale}/connect/viber` },
  ] as const;
}

export function messengerFooterText(locale: "en" | "my") {
  const line = HOSPITAL_PROFILE.chatPhoneDisplay;
  const viber = HOSPITAL_PROFILE.viberDisplay;
  if (locale === "my") {
    return `ဆက်သွယ်ရန်: LINE ${line} · Telegram · Viber ${viber}`;
  }
  return `Continue on LINE ${line}, Telegram, or Viber ${viber}.`;
}

/** Email footer: phone numbers only — many links push Gmail to Spam. */
export function messengerFooterHtml(locale: "en" | "my") {
  const line = HOSPITAL_PROFILE.chatPhoneDisplay;
  const viber = HOSPITAL_PROFILE.viberDisplay;
  const lead =
    locale === "my"
      ? "ညှိနှိုင်းရေးမှူးက မကြာမီ ဆက်ပြောပါမည်။ လိုပါက LINE / Telegram / Viber မှ ဆက်သွယ်နိုင်သည်။"
      : "A coordinator will continue with you shortly. You can also reach us on LINE, Telegram, or Viber.";
  return `<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#5b6777">${lead}</p><p style="margin:0;font-size:13px;color:#5b6777">LINE ${line} · Viber ${viber}</p>`;
}
