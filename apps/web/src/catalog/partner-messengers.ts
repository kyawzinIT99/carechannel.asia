import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import { lineHttpUrl } from "@/server/security/messengers";

export function PARTNER_MESSENGERS(locale: "en" | "my") {
  return [
    { key: "line", label: "LINE", href: lineHttpUrl(HOSPITAL_PROFILE.chatPhoneDisplay) },
  ] as const;
}

export function messengerFooterText(locale: "en" | "my") {
  const line = HOSPITAL_PROFILE.chatPhoneDisplay;
  if (locale === "my") {
    return `ဆက်သွယ်ရန်: LINE ${line}`;
  }
  return `Continue on LINE ${line}.`;
}

/** Email footer: phone numbers only — many links push Gmail to Spam. */
export function messengerFooterHtml(locale: "en" | "my") {
  const line = HOSPITAL_PROFILE.chatPhoneDisplay;
  const lead =
    locale === "my"
      ? "ညှိနှိုင်းရေးမှူးက မကြာမီ ဆက်ပြောပါမည်။ လိုပါက LINE မှ ဆက်သွယ်နိုင်သည်။"
      : "A coordinator will continue with you shortly. You can also reach us on LINE.";
  return `<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#5b6777">${lead}</p><p style="margin:0;font-size:13px;color:#5b6777">LINE ${line}</p>`;
}
