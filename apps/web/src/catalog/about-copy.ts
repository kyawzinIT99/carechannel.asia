import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";

/** Public About copy. Admin can override each key in SiteContent. */
export const ABOUT_FIELDS = [
  {
    key: "about.kicker",
    label: "Small line above title",
    multiline: false,
    fallbackEn: "Official partner · Asia patients",
    fallbackMy: "တရားဝင် မိတ်ဖက် · အာရှ လူနာများ",
  },
  {
    key: "about.title",
    label: "Page title",
    multiline: false,
    fallbackEn: "Who we are",
    fallbackMy: "ကျွန်ုပ်တို့ ဘယ်သူများလဲ",
  },
  {
    key: "about.lead",
    label: "Lead paragraph",
    multiline: true,
    fallbackEn:
      "This website is the official Chiangmai Ram Hospital partner channel for patients from Myanmar and across Asia. We are not a third-party medical broker. The hospital-published incentive is confirmed here, with confidence, because this channel is the official partner.",
    fallbackMy:
      "ဤဝက်ဘ်ဆိုက်သည် မြန်မာနှင့် အာရှတလွှားမှ လူနာများအတွက် ချင်းမိုင်ရမ်ဆေးရုံ၏ တရားဝင် မိတ်ဖက်လမ်းကြောင်းဖြစ်သည်။ တတိယပါတီ ဆေးကြားခံမဟုတ်ပါ။ ဆေးရုံထုတ်ပြန်သည့် incentive ကို ဤနေရာတွင် ယုံကြည်စိတ်ချစွာ အတည်ပြုသည် — ဤလမ်းကြောင်းသည် တရားဝင် မိတ်ဖက်ဖြစ်သောကြောင့် ဖြစ်သည်။",
  },
  {
    key: "about.whoTitle",
    label: "Who we are — heading",
    multiline: false,
    fallbackEn: "Our relationship with Chiangmai Ram",
    fallbackMy: "ချင်းမိုင်ရမ်နှင့် ကျွန်ုပ်တို့၏ ဆက်ဆံရေး",
  },
  {
    key: "about.whoBody",
    label: "Who we are — body",
    multiline: true,
    fallbackEn:
      "Chiangmai Ram Hospital is the hospital. This partner site plans the incentive visit for Asia patients — Myanmar first, then other countries in the region — using only hospital-published centres and 2026 check-up packages. A coordinator stays with you by email, LINE, Telegram, or Viber until the visit plan is clear.",
    fallbackMy:
      "ချင်းမိုင်ရမ်ဆေးရုံသည် ဆေးရုံဖြစ်သည်။ ဤမိတ်ဖက်ဆိုက်သည် အာရှလူနာများ (မြန်မာကို ဦးစားပေးပြီး ဒေသတွင်း အခြားနိုင်ငံများ) အတွက် incentive ခရီးစဉ်ကို စီစဉ်သည်။ ဆေးရုံထုတ်ပြန်သည့် ဌာနနှင့် ၂၀၂၆ စစ်ဆေးပက်ကေ့ချ်များကိုသာ သုံးသည်။ ညှိနှိုင်းရေးမှူးက အီးမေးလ်၊ LINE၊ Telegram သို့မဟုတ် Viber ဖြင့် ခရီးစဉ်ရှင်းသည်အထိ ဆက်လက်ကူညီသည်။",
  },
  {
    key: "about.whyTitle",
    label: "Why inquire here — heading",
    multiline: false,
    fallbackEn: "Why inquire on this website",
    fallbackMy: "ဤဝက်ဘ်ဆိုက်မှ အဘယ်ကြောင့် တောင်းဆိုသင့်သနည်း",
  },
  {
    key: "about.whyBody",
    label: "Why inquire here — body",
    multiline: true,
    fallbackEn:
      "If you trust this official channel, send your request here. The published partner incentive is beneficial because it is confirmed through the official partner — not because we invent a different hospital or a different medical service. Independent agents may show similar packages. The difference is authority: the amount and the visit plan are confirmed on this website, LINE, Telegram, or Viber.",
    fallbackMy:
      "ဤတရားဝင်လမ်းကြောင်းကို ယုံကြည်ပါက တောင်းဆိုမှုကို ဤနေရာမှ ပို့ပါ။ ထုတ်ပြန်သည့် မိတ်ဖက် incentive သည် အကျိုးရှိသည်မှာ တရားဝင် မိတ်ဖက်မှ အတည်ပြုသောကြောင့် ဖြစ်သည် — ဆေးရုံအသစ် သို့မဟုတ် ဆေးဝန်ဆောင်မှုအသစ်ကို တီထွင်သောကြောင့် မဟုတ်ပါ။ လွတ်လပ်သော ကြားခံများက ဆင်တူပက်ကေ့ချ်ကို ပြနိုင်သည်။ ကွာခြားချက်မှာ အာဏာဖြစ်သည်။ ပမာဏနှင့် ခရီးစဉ်ကို ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှ အတည်ပြုသည်။",
  },
  {
    key: "about.eventTitle",
    label: "Opening announcement — heading",
    multiline: false,
    fallbackEn: "Announced at the temple opening",
    fallbackMy: "ဘုရားဖွင့်ပွဲတွင် ကြေညာခဲ့သည်",
  },
  {
    key: "about.eventBody",
    label: "Opening announcement — body",
    multiline: true,
    fallbackEn:
      "This official partner relationship was announced publicly at the temple opening ceremony. The same announcement is on Facebook page ChiangmaiRam.myanmar. Facebook is for that public record. Visit requests continue only on this website, LINE, Telegram, or Viber — not as a Facebook inquiry, and not as emergency care.",
    fallbackMy:
      "ဤတရားဝင် မိတ်ဖက်ဆက်ဆံရေးကို ဘုရားဖွင့်ပွဲတွင် အများပြည်သူသို့ ကြေညာခဲ့သည်။ အလားတူ ကြေညာချက်ကို Facebook စာမျက်နှာ ChiangmaiRam.myanmar တွင် ကြည့်နိုင်သည်။ Facebook သည် ထိုအများပြည်သူ မှတ်တမ်းအတွက် ဖြစ်သည်။ လာရောက်ရန် တောင်းဆိုမှုကို ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှသာ ဆက်လုပ်သည် — Facebook စုံစမ်းမှု မဟုတ်၊ အရေးပေါ်ကုသမှုလည်း မဟုတ်ပါ။",
  },
] as const;

export const ABOUT_FACEBOOK_URL = HOSPITAL_PROFILE.facebookUrl;
