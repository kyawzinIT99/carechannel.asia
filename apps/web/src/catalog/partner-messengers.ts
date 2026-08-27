import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import { lineHttpUrl } from "@/server/security/messengers";

export function PARTNER_MESSENGERS(locale: "en" | "my") {
  return [
    { key: "line", label: "LINE", href: lineHttpUrl(HOSPITAL_PROFILE.chatPhoneDisplay) },
  ] as const;
}

export function messengerFooterText(locale: "en" | "my") {
  if (locale === "my") {
    return "ညှိနှိုင်းရေးမှူးက မကြာမီ ဆက်ပြောပါမည်။ လိုပါက LINE မှ ဆက်သွယ်နိုင်သည်။";
  }
  return "A coordinator will continue with you shortly. You can also reach us on LINE.";
}

/** Email footer: no LINE number — keep the rest of the automail. */
export function messengerFooterHtml(locale: "en" | "my") {
  const lead = messengerFooterText(locale);
  return `<p style="margin:0;font-size:14px;line-height:1.6;color:#5b6777">${lead}</p>`;
}
