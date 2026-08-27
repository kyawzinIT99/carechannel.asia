/**
 * Hospital-published catalog only.
 * Source: Chiangmai Ram Hospital official website (partner).
 * Do not add departments, prices, or clinical claims that are not on these URLs.
 */

export const HOSPITAL_PROFILE = {
  legalNameTh: "บริษัท โรงพยาบาลเชียงใหม่ ราม จำกัด",
  nameEn: "Chiangmai Ram Hospital Myanmar",
  nameMy: "ချင်းမိုင်ရမ်ဆေးရုံ",
  addressEn: "8 Boonruengrit Road, Tambon Sripoom, Mueang, Chiang Mai 50200, Thailand",
  addressMy: "အမှတ် ၈၊ ဘွန်းရွမ်ရစ်လမ်း၊ တမ်ဘွန်စရီဖူမ်၊ မြို့နယ်မောင်း၊ ချင်းမိုင် ၅၀၂၀၀၊ ထိုင်းနိုင်ငံ",
  mainPhone: "052-004-699",
  emergencyPhone: "052-004601",
  cardiacPhone: "052-004602",
  email: "chiangmairam@chiangmairam.com",
  website: "https://www.chiangmairam.com",
  facebookUrl: "https://www.facebook.com/ChiangmaiRam.myanmar",
  /** Partner LINE / Telegram number. Official incentive-visit chat — not a hospital emergency line. */
  chatPhoneDisplay: "082-567-4570",
  chatPhoneE164: "66825674570",
  lineUrl: "https://line.me/R/ti/p/~0825674570",
  /** Phone chat uses tg://resolve?phone= — t.me/+<phone> is an invite link and will fail. */
  telegramUrl: "",
  viberDisplay: "+95 9504 3252",
  viberE164: "9595043252",
  viberUrl: "viber://chat?number=%2B9595043252",
  logoPath: "/brand/logo-ramhosp.png",
  mapPath: "/photos/map.jpg",
  heroPath: "/photos/health.jpg",
  locationNoteEn:
    "Main campus: 8 Boonruengrit Road, Tambon Sripoom, Mueang, Chiang Mai 50200, Thailand. Chiangmai Ram Health Center uses separate buildings on this campus, with parking. A new branch is opening soon near ARISE Charoen Mueang Condo, Charoen Mueang Road, Tha Sala, Mueang Chiang Mai. Coordinators confirm which site to visit by email and Telegram.",
  locationNoteMy:
    "ပင်မနယ်မြေ - အမှတ် ၈၊ ဘွန်းရွမ်ရစ်လမ်း၊ တမ်ဘွန်စရီဖူမ်၊ မြို့နယ်မောင်း၊ ချင်းမိုင် ၅၀၂၀၀၊ ထိုင်းနိုင်ငံ။ ချင်းမိုင်ရမ် ကျန်းမာရေးစင်တာသည် ဤနယ်မြေတွင် အဆောက်အအုံခွဲများနှင့် ကားရပ်ရန်နေရာ ရှိသည်။ ဌာနခွဲအသစ်ကို ARISE Charoen Mueang ကွန်ဒို အနီး (လမ်း ချရိုအန်မောင်း၊ တမ်ဘွန်သာစလာ၊ မြို့နယ်မောင်း၊ ချင်းမိုင်) တွင် မကြာမီ ဖွင့်မည်။ မည်သည့်နေရာသို့ လာရမည်ကို ညှိနှိုင်းရေးမှူးက အီးမေးလ်နှင့် Telegram ဖြင့် အတည်ပြုသည်။",
  sourceNote:
    "Contact and identity copied from chiangmairam.com/contactus and Facebook page ChiangmaiRam.myanmar About. Legal partner use.",
} as const;

export const PARTNER_CHANNEL = {
  en: "We are the official partner for Myanmar visitors on the incentive visit plan. The published incentive amount is confirmed only through this website, LINE, Telegram, or Viber. A coordinator stays with you until the visit plan is clear. This is not Facebook contact, and it is not an emergency line.",
  my: "ကျွန်ုပ်တို့သည် မြန်မာဧည့်သည်များအတွက် တရားဝင် incentive ခရီးစဉ် မိတ်ဖက်ဖြစ်သည်။ ထုတ်ပြန်သည့် incentive ပမာဏကို ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှသာ အတည်ပြုသည်။ ညှိနှိုင်းရေးမှူးက ခရီးစဉ်ရှင်းသည်အထိ ဆက်လက်ကူညီသည်။ Facebook မှ ဆက်သွယ်ခြင်း မဟုတ်၊ အရေးပေါ်လိုင်းလည်း မဟုတ်ပါ။",
} as const;

export const VISIT_SITES = [
  {
    code: "SRIPOOM",
    status: "open" as const,
    nameEn: "Main campus — Sripoom",
    nameMy: "ပင်မနယ်မြေ — စရီဖူမ်",
    detailEn:
      "8 Boonruengrit Road, Tambon Sripoom, Mueang, Chiang Mai 50200. Health Center buildings and parking are on this campus.",
    detailMy:
      "အမှတ် ၈၊ ဘွန်းရွမ်ရစ်လမ်း၊ တမ်ဘွန်စရီဖူမ်၊ မြို့နယ်မောင်း၊ ချင်းမိုင် ၅၀၂၀၀။ ကျန်းမာရေးစင်တာ အဆောက်အအုံများနှင့် ကားရပ်ရန်နေရာ ဤနယ်မြေတွင် ရှိသည်။",
    mapQuery: "Chiangmai Ram Hospital, 8 Boonruengrit Road, Sripoom, Chiang Mai",
  },
  {
    code: "CHAROEN_MUEANG",
    status: "opening_soon" as const,
    nameEn: "New branch — near ARISE Charoen Mueang Condo",
    nameMy: "ဌာနခွဲအသစ် — ARISE Charoen Mueang ကွန်ဒို အနီး",
    detailEn:
      "Opening soon near ARISE Charoen Mueang Condo, Charoen Mueang Road, Tha Sala, Mueang Chiang Mai. We will confirm the exact visit point by email and Telegram. No unpublished medical services are listed for this site yet.",
    detailMy:
      "ARISE Charoen Mueang ကွန်ဒို အနီး၊ လမ်း ချရိုအန်မောင်း၊ တမ်ဘွန်သာစလာ၊ မြို့နယ်မောင်း၊ ချင်းမိုင်တွင် မကြာမီ ဖွင့်မည်။ လာရောက်မည့် အတိအကျနေရာကို အီးမေးလ်နှင့် Telegram ဖြင့် အတည်ပြုပါမည်။ ဤနေရာအတွက် မထုတ်ပြန်သေးသော ဆေးဝန်ဆောင်မှုကို မဖော်ပြပါ။",
    mapQuery: "ARISE Charoen Mueang Condo, Charoen Mueang Road, Tha Sala, Chiang Mai",
  },
] as const;

/** Partner visit extras — not part of hospital checkup package SKUs. */
export const VISIT_ASSIST = [
  {
    code: "AIRPORT_PICKUP",
    titleEn: "Airport pickup",
    titleMy: "လေဆိပ်ကား ကြိုဆိုခြင်း",
    bodyEn:
      "A coordinator can arrange pickup from Chiang Mai Airport to the hospital campus or your stay. This is a partner visit service — it is not included in STANDARD, ADVANCE, or PREMIUM checkup prices.",
    bodyMy:
      "ချင်းမိုင်လေဆိပ်မှ ဆေးရုံ သို့မဟုတ် နေထိုင်မည့်နေရာသို့ ကြိုဆိုကား စီစဉ်ပေးနိုင်သည်။ ဤသည် မိတ်ဖက်ခရီးစဉ် အကူအညီဖြစ်ပြီး STANDARD၊ ADVANCE၊ PREMIUM စစ်ဆေးပက်ကေ့ချ် စျေးနှုန်းတွင် မပါဝင်ပါ။",
  },
  {
    code: "ACCOMMODATION",
    titleEn: "Rental apartment nearby",
    titleMy: "အနီးအနား အငှားတိုက်ခန်း",
    apartmentUrl: "https://sddp-apartment.onrender.com",
    bodyEn:
      "If you wish, a coordinator can help you find a simple rental apartment near the visit. This is not a hotel, and it is not a hospital or checkup package. Typical rates on the partner apartment site are 3,500 or 4,000 THB. Only if you want it — tell us on the request form, LINE, Telegram, or Viber.",
    bodyMy:
      "လိုပါက ညှိနှိုင်းရေးမှူးက ခရီးစဉ်အနီး ရိုးရိုး အငှားတိုက်ခန်း ရှာပေးနိုင်သည်။ ဟိုတယ် မဟုတ်၊ ဆေးရုံ သို့မဟုတ် စစ်ဆေးပက်ကေ့ချ်လည်း မဟုတ်ပါ။ မိတ်ဖက်တိုက်ခန်းဝက်ဘ်ဆိုက်တွင် ပုံမှန်အားဖြင့် ၃,၅၀၀ သို့မဟုတ် ၄,၀၀၀ ဘတ်။ လိုမှသာ တောင်းဆိုဖောင်၊ LINE၊ Telegram သို့မဟုတ် Viber တွင် ပြောပါ။",
  },
  {
    code: "VISA_SUPPORT",
    titleEn: "Long-stay visa help",
    titleMy: "ကြာရှည် ဗီဇာ အကူအညီ",
    bodyEn:
      "Long-stay visa help in Chiang Mai is announced only if the visitor wants it. Ask on this website, LINE, Telegram, or Viber. We do not publish a visa office phone or email. This is not a checkup package.",
    bodyMy:
      "ချင်းမိုင် ကြာရှည် ဗီဇာ အကူအညီကို ဧည့်သည် လိုမှသာ ကြေညာပါသည်။ ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှ တောင်းပါ။ ဗီဇာရုံး ဖုန်း သို့မဟုတ် အီးမေးလ်ကို မဖော်ပြပါ။ စစ်ဆေးပက်ကေ့ချ်တွင် မပါဝင်ပါ။",
  },
] as const;

export const PACKAGE_NOTES = {
  en: "",
  my: "",
};

/**
 * Full checkup item lists sourced from the hospital 2026 comparison flyer
 * (LINE album 27 Aug 2026). Do not add tests that are not on that sheet.
 */

export type PkgGroup = {
  key: string;
  icon: string;
  labelEn: string;
  labelMy: string;
  items: { en: string; my: string; noteEn?: string; noteMy?: string }[];
};

/** Groups present in ALL tiers (STANDARD, ADVANCE, PREMIUM) */
export const PKG_GROUPS_STANDARD: PkgGroup[] = [
  {
    key: "physical",
    icon: "🏥",
    labelEn: "Physical Assessment",
    labelMy: "ကိုယ်ခန္ဓာ စစ်ဆေးမှု",
    items: [
      { en: "Physical examination by doctor", my: "ဆရာဝန် ကိုယ်ခန္ဓာစစ်ဆေးခြင်း" },
      { en: "BMI (body mass index) calculation", my: "BMI ကိုယ်အလေးချိန် ညွှန်းကိန်း" },
      { en: "Body fat mass measurement", my: "ကိုယ်ဆီချောဆုံး တိုင်းတာခြင်း" },
      { en: "Vital signs — weight, height, blood pressure", my: "အရေးကြီးသော လက္ခဏာများ — ကိုယ်အလေး၊ အရပ်၊ သွေးဖိအား" },
    ],
  },
  {
    key: "blood_chem",
    icon: "🩸",
    labelEn: "Blood Chemistry",
    labelMy: "သွေးဓာတ်စစ်ဆေးမှု",
    items: [
      { en: "Blood glucose", my: "သွေးတွင်းသကြား", noteEn: "Diabetes screening", noteMy: "ဆီးချိုရောဂါ စစ်ဆေး" },
      { en: "Kidney function — BUN (blood urea nitrogen)", my: "ကျောက်ကပ် — BUN", noteEn: "Kidney health", noteMy: "ကျောက်ကပ်ကျန်းမာရေး" },
      { en: "Kidney function — Creatinine", my: "ကျောက်ကပ် — Creatinine", noteEn: "Kidney filtration rate", noteMy: "ကျောက်ကပ် စစ်ထုတ်မှုနှုန်း" },
      { en: "Uric acid", my: "ယူရစ်အက်ဆစ်", noteEn: "Gout risk", noteMy: "ကင်ဆာဆီဆာ အန္တရာယ်" },
      { en: "Cholesterol (total)", my: "ကိုလက်စထရော (စုစုပေါင်း)", noteEn: "Heart disease risk", noteMy: "နှလုံးရောဂါ အန္တရာယ်" },
      { en: "Triglyceride", my: "ထရိုက်လိုဆာရိုက်", noteEn: "Fat in blood", noteMy: "သွေးတွင်း အဆီ" },
      { en: "HDL cholesterol", my: "HDL ကိုလက်စထရော", noteEn: "'Good' cholesterol", noteMy: "ကောင်းသော ကိုလက်စထရော" },
      { en: "LDL-Direct cholesterol", my: "LDL-Direct ကိုလက်စထရော", noteEn: "'Bad' cholesterol", noteMy: "မကောင်းသော ကိုလက်စထရော" },
      { en: "Liver function — SGOT (AST)", my: "အသဲ — SGOT (AST)", noteEn: "Liver cell damage", noteMy: "အသဲဆဲလ် ပျက်စီးမှု" },
      { en: "Liver function — SGPT (ALT)", my: "အသဲ — SGPT (ALT)", noteEn: "Liver inflammation", noteMy: "အသဲ ရောင်ရမ်းမှု" },
    ],
  },
  {
    key: "lab",
    icon: "🔬",
    labelEn: "Haematology & Urology",
    labelMy: "သွေးရောဂါ & ဆီးလမ်းကြောင်း",
    items: [
      { en: "Complete Blood Count (CBC)", my: "သွေးပြည့်စစ်ဆေးမှု (CBC)", noteEn: "Red cells, white cells, platelets", noteMy: "နီဥ၊ ဖြူဥ၊ သွေးခဲဆဲလ်" },
      { en: "Urinalysis (Urine exam)", my: "ဆီးစစ်ဆေးမှု", noteEn: "Kidney, bladder, diabetes markers", noteMy: "ကျောက်ကပ်၊ ဆီးအိမ်၊ ဆီးချို" },
    ],
  },
  {
    key: "cardiac_imaging",
    icon: "❤️",
    labelEn: "Cardiac & Imaging",
    labelMy: "နှလုံးနှင့် ဓာတ်မှန်",
    items: [
      { en: "Electrocardiogram (EKG / ECG)", my: "နှလုံးလျှပ်စစ်ဓာတ်မှတ် (EKG)", noteEn: "Heart rhythm and electrical activity", noteMy: "နှလုံးခုန်မှုနှင့် လျှပ်စစ်လှုပ်ရှားမှု" },
      { en: "Digital chest X-ray (heart & lungs)", my: "ဒစ်ဂျစ်တယ် ရင်ဘတ် X-ray", noteEn: "Lungs, heart size, chest abnormalities", noteMy: "အဆုတ်၊ နှလုံးအရွယ်၊ ရင်ဘတ်ပြဿနာ" },
    ],
  },
];

/** STANDARD Female Plus (under 39) — on top of STANDARD */
export const PKG_GROUPS_STANDARD_FEMALE_PLUS: PkgGroup[] = [
  {
    key: "female_plus",
    icon: "👩",
    labelEn: "Female Plus Screening",
    labelMy: "Female Plus စစ်ဆေးမှု",
    items: [
      { en: "HR HPV DNA Test + Liquid Based Cytology", my: "HR HPV DNA + Liquid Based Cytology", noteEn: "Cervical cancer screening", noteMy: "သားအိမ်ခေါင်းကင်ဆာ စစ်ဆေး" },
      { en: "Ultrasound — breast", my: "အာလ်ထရာဆောင်း — ရင်သား", noteEn: "Breast ultrasound", noteMy: "ရင်သား အာလ်ထရာဆောင်း" },
    ],
  },
];

/** Groups added in ADVANCE tier (both male and female), on top of STANDARD */
export const PKG_GROUPS_ADVANCE_SHARED: PkgGroup[] = [
  {
    key: "advance_exam",
    icon: "👁",
    labelEn: "Advance Screening",
    labelMy: "ADVANCE စစ်ဆေးမှု",
    items: [
      { en: "Eye exam with fundus", my: "မျက်စိနှင့် fundus စစ်ဆေးမှု", noteEn: "Retina / fundus examination", noteMy: "မြင်လွှာ / fundus စစ်ဆေး" },
      { en: "HbA1c", my: "HbA-1C", noteEn: "Average blood sugar", noteMy: "ပျမ်းမျှ သွေးတွင်းသကြား" },
      { en: "Gastrointestinal bleeding & inflammation screening", my: "အစာလမ်းကြောင်း သွေးထွက်နှင့် ရောင်ရမ်းမှု စစ်ဆေး", noteEn: "GI bleeding / inflammation", noteMy: "အစာလမ်းကြောင်း သွေးထွက် / ရောင်ရမ်း" },
      { en: "Stool exam including occult blood", my: "မစင်စစ်ဆေးမှု + သွေးခိုပါဝင်မှု", noteEn: "Colorectal screening", noteMy: "အူမကြီးကင်ဆာ စစ်ဆေး" },
      { en: "AFP — liver cancer marker", my: "AFP — အသဲကင်ဆာ မားကာ", noteEn: "Liver cancer marker", noteMy: "အသဲကင်ဆာ မားကာ" },
      { en: "ABI — ankle-brachial index", my: "ABI — သွေးကြောစီးဆင်းမှု", noteEn: "Vascular blood flow", noteMy: "သွေးကြော စီးဆင်းမှု" },
      { en: "Ultrasound — whole abdomen", my: "အာလ်ထရာဆောင်း — ဗိုက်တစ်ခုလုံး", noteEn: "Liver, gallbladder, kidneys, spleen, pancreas", noteMy: "အသဲ၊ သည်းခြေ၊ ကျောက်ကပ်၊ ဗိုက်ကျင်" },
    ],
  },
];

/** ADVANCE Male only */
export const PKG_GROUPS_ADVANCE_MALE: PkgGroup[] = [
  {
    key: "mens_health",
    icon: "👨",
    labelEn: "Men's Health Screening",
    labelMy: "ကျားသားကျန်းမာရေး စစ်ဆေးမှု",
    items: [
      { en: "Anti HCV — Hepatitis C antibody", my: "Anti HCV — အသဲရောင် C ဆန့်ကျင်ဓာတ်", noteEn: "Hepatitis C infection status", noteMy: "အသဲရောင် C ကူးစက်မှု" },
    ],
  },
];

/** ADVANCE Female and PREMIUM Female */
export const PKG_GROUPS_ADVANCE_FEMALE: PkgGroup[] = [
  {
    key: "womens_health",
    icon: "👩",
    labelEn: "Women's Health Screening",
    labelMy: "မိန်းမကျန်းမာရေး စစ်ဆေးမှု",
    items: [
      { en: "HR HPV DNA Test + Liquid Based Cytology", my: "HR HPV DNA + Liquid Based Cytology", noteEn: "Cervical cancer screening", noteMy: "သားအိမ်ခေါင်းကင်ဆာ စစ်ဆေး" },
      { en: "Mammogram — digital breast X-ray", my: "မမ်မိုဂရမ် — ဒစ်ဂျစ်တယ် ရင်သား X-ray", noteEn: "Early breast cancer detection", noteMy: "ရင်သားကင်ဆာ စောစောရှာဖွေ" },
    ],
  },
];

/** PREMIUM extras on top of ADVANCE */
export const PKG_GROUPS_PREMIUM_SHARED: PkgGroup[] = [
  {
    key: "premium_shared",
    icon: "⭐",
    labelEn: "Premium Screening",
    labelMy: "PREMIUM စစ်ဆေးမှု",
    items: [
      { en: "Vitamin D 25 OH total", my: "Vitamin D 25 OH total", noteEn: "Vitamin D level", noteMy: "ဗီတာမင် D ပမာဏ" },
      { en: "Advanced BMD", my: "Advanced BMD", noteEn: "Bone mineral density", noteMy: "အရိုးသိပ်သည်းဆ" },
      { en: "EST or Echo (physician’s discretion)", my: "EST သို့မဟုတ် Echo (ဆရာဝန် ဆုံးဖြတ်ချက်)", noteEn: "Exercise stress test or echocardiogram", noteMy: "လေ့ကျင့်ခန်း နှလုံးစစ် သို့မဟုတ် Echo" },
    ],
  },
];

export const PKG_GROUPS_PREMIUM_MALE: PkgGroup[] = [
  {
    key: "premium_male",
    icon: "👨",
    labelEn: "Premium Men's Health",
    labelMy: "PREMIUM ကျားသားကျန်းမာရေး",
    items: [
      { en: "PSA — prostate-specific antigen", my: "PSA — ပရိုစတိတ်အထူးသတ် ပရိုတင်း", noteEn: "Prostate cancer marker", noteMy: "ပရိုစတိတ်ကင်ဆာ မားကာ" },
    ],
  },
];

export const PKG_GROUPS_PREMIUM_FEMALE: PkgGroup[] = [
  {
    key: "premium_female_hepc",
    icon: "🦠",
    labelEn: "Hepatitis Screening",
    labelMy: "အသဲရောင် စစ်ဆေးမှု",
    items: [
      { en: "Anti HCV — Hepatitis C antibody", my: "Anti HCV — အသဲရောင် C ဆန့်ကျင်ဓာတ်", noteEn: "Hepatitis C infection status", noteMy: "အသဲရောင် C ကူးစက်မှု" },
    ],
  },
];

/** Included in all tiers (service items, not clinical tests) */
export const PKG_INCLUDED_ALL = [
  { en: "Coffee break", my: "ကော်ဖီ အနားယူချိန်" },
  { en: "Medical supplies", my: "ဆေးပစ္စည်း" },
  { en: "Report book", my: "အစီရင်ခံစာ စာအုပ်" },
  { en: "Hospital service and nursing service", my: "ဆေးရုံ ဝန်ဆောင်မှုနှင့် သူနာပြု ဝန်ဆောင်မှု" },
];

/** Premium note — flyer on this website is the published item list */
export const PKG_PREMIUM_NOTE = {
  en: "PREMIUM includes everything in ADVANCE plus Vitamin D, Advanced BMD, and EST or Echo at the physician’s discretion. Open the 2026 comparison flyer on this page for the full hospital sheet.",
  my: "PREMIUM တွင် ADVANCE အားလုံးအပြင် Vitamin D၊ Advanced BMD နှင့် ဆရာဝန်ဆုံးဖြတ်သည့် EST သို့မဟုတ် Echo ပါဝင်သည်။ အပြည့်အစုံကို ဤစာမျက်နှာရှိ ၂၀၂၆ နှိုင်းယှဉ်ဇယားတွင် ဖတ်ပါ။",
};

/** Legacy flat export kept for backward-compatibility with packages/page.tsx */
export const PACKAGE_ITEMS = {
  CORE: PKG_GROUPS_STANDARD.flatMap((g) => g.items),
  ADVANCE_SHARED: PKG_GROUPS_ADVANCE_SHARED.flatMap((g) => g.items),
  ADVANCE_MALE_ONLY: PKG_GROUPS_ADVANCE_MALE.flatMap((g) => g.items),
  ADVANCE_FEMALE_ONLY: PKG_GROUPS_ADVANCE_FEMALE.flatMap((g) => g.items),
  INCLUDED_ALL: PKG_INCLUDED_ALL,
  PREMIUM_NOTE: PKG_PREMIUM_NOTE,
} as const;

/** Source: hospital 2026 comparison flyer (LINE album 27 Aug 2026). */
export const CHECKUP_PACKAGES_2026 = [
  {
    code: "STANDARD_ANY",
    nameEn: "STANDARD (under 39, male / female)",
    nameMy: "STANDARD (၃၉ နှစ်အောက် ကျား / မ)",
    gender: "ANY" as const,
    listPrice: "4308.00",
    salePrice: "3300.00",
    highlight: "Under 39",
  },
  {
    code: "STANDARD_FEMALE_PLUS",
    nameEn: "STANDARD Female Plus (under 39)",
    nameMy: "STANDARD Female Plus (၃၉ နှစ်အောက်)",
    gender: "FEMALE" as const,
    listPrice: "11861.00",
    salePrice: "9500.00",
    highlight: "Under 39 · Female Plus",
  },
  {
    code: "ADVANCE_MALE",
    nameEn: "ADVANCE male (40–49)",
    nameMy: "ADVANCE ကျား (၄၀–၄၉)",
    gender: "MALE" as const,
    listPrice: "10054.00",
    salePrice: "8000.00",
    highlight: "Ages 40–49",
  },
  {
    code: "ADVANCE_FEMALE",
    nameEn: "ADVANCE female (40–49)",
    nameMy: "ADVANCE မ (၄၀–၄၉)",
    gender: "FEMALE" as const,
    listPrice: "15947.00",
    salePrice: "12500.00",
    highlight: "Ages 40–49",
  },
  {
    code: "PREMIUM_MALE",
    nameEn: "PREMIUM male (50+)",
    nameMy: "PREMIUM ကျား (၅၀+)",
    gender: "MALE" as const,
    listPrice: "22447.00",
    salePrice: "17500.00",
    highlight: "Ages 50+",
  },
  {
    code: "PREMIUM_FEMALE",
    nameEn: "PREMIUM female (50+)",
    nameMy: "PREMIUM မ (၅၀+)",
    gender: "FEMALE" as const,
    listPrice: "27584.00",
    salePrice: "21500.00",
    highlight: "Ages 50+",
  },
];

export function packageGroupsForCode(code: string): { group: PkgGroup; isNew: boolean }[] {
  const base = PKG_GROUPS_STANDARD.map((group) => ({ group, isNew: false }));
  if (code === "STANDARD_ANY") return base;
  if (code === "STANDARD_FEMALE_PLUS") {
    return [...base, ...PKG_GROUPS_STANDARD_FEMALE_PLUS.map((group) => ({ group, isNew: true }))];
  }
  const groups = [
    ...base,
    ...PKG_GROUPS_ADVANCE_SHARED.map((group) => ({ group, isNew: true })),
  ];
  const female = code.includes("FEMALE");
  const male = !female && code.includes("MALE");
  if (male) groups.push(...PKG_GROUPS_ADVANCE_MALE.map((group) => ({ group, isNew: true })));
  if (female) groups.push(...PKG_GROUPS_ADVANCE_FEMALE.map((group) => ({ group, isNew: true })));
  if (code.startsWith("PREMIUM")) {
    groups.push(...PKG_GROUPS_PREMIUM_SHARED.map((group) => ({ group, isNew: true })));
    if (male) groups.push(...PKG_GROUPS_PREMIUM_MALE.map((group) => ({ group, isNew: true })));
    if (female) groups.push(...PKG_GROUPS_PREMIUM_FEMALE.map((group) => ({ group, isNew: true })));
  }
  return groups;
}

export function packageFeatureLines(code: string): { featuresEn: string[]; featuresMy: string[] } {
  const groups = packageGroupsForCode(code).map((row) => row.group);
  const featuresEn = groups.flatMap((g) => g.items.map((i) => i.en));
  const featuresMy = groups.flatMap((g) => g.items.map((i) => i.my));
  if (code.startsWith("PREMIUM")) {
    featuresEn.push(PKG_PREMIUM_NOTE.en);
    featuresMy.push(PKG_PREMIUM_NOTE.my);
  }
  return { featuresEn, featuresMy };
}

export type SpecialtySeed = {
  slug: string;
  sourceUrl: string;
  imagePath?: string;
  phone?: string;
  hoursEn?: string;
  hoursMy?: string;
  nameEn: string;
  nameMy: string;
  nameTh: string;
  summaryEn: string;
  summaryMy: string;
  servicesEn: string[];
  servicesMy: string[];
  sortOrder: number;
  children?: SpecialtySeed[];
};

/**
 * Featured centers from https://www.chiangmairam.com/index.php/centeronly
 * Detail copy from the matching readcenter_clinic pages. No extra centers.
 */
export const SPECIALTIES: SpecialtySeed[] = [
  {
    slug: "cardiac-balloon-center",
    sourceUrl: "https://www.chiangmairam.com/index.php/readcenter_clinic/2",
    imagePath: "/photos/cardiac.jpg",
    nameEn: "Cardiac Balloon Center",
    nameMy: "နှလုံးသွေးကြော ဘလူးန်းဌာန",
    nameTh: "ศูนย์บอลลูนหลอดเลือดหัวใจ",
    summaryEn:
      "The Cardiac Balloon Center of Chiangmai Ram Hospital provides examination, diagnosis, treatment, and cardiac rehabilitation with specialist physicians and internationally standard technology. The hospital page states that coronary artery disease (CAD) is caused by narrowing or blockage of the arteries that supply the heart, which can lead to chest pain or myocardial infarction. Equipment listed on that page: CT 512 Slices, Electrocardiogram (EKG), Holter Monitor, Exercise Stress Test, Echocardiography, and Mobile ICU / CCU.",
    summaryMy:
      "ချင်းမိုင်ရမ်ဆေးရုံ၏ နှလုံးသွေးကြော ဘလူးန်းဌာနသည် စစ်ဆေးခြင်း၊ ရောဂါရှာဖွေခြင်း၊ ကုသခြင်းနှင့် နှလုံးပြန်လည်သန်စွမ်းရေးကို အထူးကုဆရာဝန်များနှင့် နိုင်ငံတကာစံနှုန်းနည်းပညာဖြင့် ပေးသည်။ ဆေးရုံစာမျက်နှာအရ Coronary Artery Disease (CAD) သည် နှလုံးသို့သွေးပို့သည့် သွေးကြောများ ကျဉ်းခြင်း သို့မဟုတ် ပိတ်ခြင်းကြောင့်ဖြစ်ပြီး ရင်ဘတ်အောင့်ခြင်း သို့မဟုတ် နှလုံးကြွက်သားသေခြင်းအထိ ဖြစ်နိုင်သည်။ ထိုစာမျက်နှာတွင် ဖော်ပြထားသော ကိရိယာများ - CT 512 Slices၊ EKG၊ Holter Monitor၊ Exercise Stress Test၊ Echocardiography နှင့် Mobile ICU / CCU။",
    servicesEn: [
      "CT 512 Slices",
      "Electrocardiogram (EKG)",
      "Holter Monitor (24-hour)",
      "Exercise Stress Test",
      "Echocardiography",
      "Mobile ICU / CCU",
    ],
    servicesMy: [
      "CT 512 Slices",
      "Electrocardiogram (EKG)",
      "Holter Monitor (၂၄ နာရီ)",
      "Exercise Stress Test",
      "Echocardiography",
      "Mobile ICU / CCU",
    ],
    sortOrder: 10,
  },
  {
    slug: "stroke-center",
    sourceUrl: "https://www.chiangmairam.com/index.php/readcenter_clinic/7",
    imagePath: "/photos/stroke.jpg",
    nameEn: "Stroke Center",
    nameMy: "လေဖြတ်ကုသရေးဌာန",
    nameTh: "ศูนย์รักษาอัมพาต",
    summaryEn:
      "The Stroke Center page of Chiangmai Ram Hospital describes ischaemic stroke as a condition that often starts suddenly because the brain is not receiving enough blood. The hospital states that correct and rapid first care can reduce death and disability. The same page says the treatment window it publishes is 4.5 hours, and it advises anyone with warning signs to see a physician quickly. This portal does not add symptoms, scores, or treatment advice beyond that published page.",
    summaryMy:
      "ချင်းမိုင်ရမ်ဆေးရုံ၏ လေဖြတ်ကုသရေးဌာန စာမျက်နှာတွင် သွေးကြောပိတ် လေဖြတ်ခြင်းသည် ဦးနှောက်သို့ သွေးမလုံလောက်သောကြောင့် ရုတ်တရက် စတင်တတ်ကြောင်း ဖော်ပြသည်။ ဆေးရုံက ပထမဆုံး ကုသမှု မှန်ကန်မြန်ဆန်ပါက သေဆုံးမှုနှင့် မသန်စွမ်းမှုကို လျှော့ချနိုင်သည်ဟု ဆိုသည်။ ထိုစာမျက်နှာတွင် ဖော်ပြသည့် ကုသချိန်သည် ၄.၅ နာရီဖြစ်ပြီး သတိပေးလက္ခဏာရှိပါက ဆရာဝန်ကို အမြန်ပြရန် တိုက်တွန်းသည်။ ဤပေါ်တယ်သည် ထိုစာမျက်နှာထက်ပိုသော လက္ခဏာ၊ အမှတ် သို့မဟုတ် ကုသနည်းကို မထည့်ပါ။",
    servicesEn: [
      "Hospital-published guidance: seek a physician quickly if stroke warning signs appear",
      "Published treatment window on the hospital page: 4.5 hours",
    ],
    servicesMy: [
      "ဆေးရုံထုတ်ပြန်ချက် - လေဖြတ် သတိပေးလက္ခဏာရှိပါက ဆရာဝန်ကို အမြန်ပြပါ",
      "ဆေးရုံစာမျက်နှာတွင် ဖော်ပြသည့် ကုသချိန် - ၄.၅ နာရီ",
    ],
    sortOrder: 20,
  },
  {
    slug: "childrens-hospital",
    sourceUrl: "https://www.chiangmairam.com/readcenter_clinic/8",
    imagePath: "/photos/children.jpg",
    nameEn: "Chiangmai Ram Children's Hospital",
    nameMy: "ချင်းမိုင်ရမ် ကလေးဆေးရုံ",
    nameTh: "โรงพยาบาลเด็ก เชียงใหม่ ราม",
    summaryEn:
      "Chiangmai Ram Hospital established a paediatric specialty centre for care from the newborn period through older children. The hospital page states that sick children and children coming for vaccination are separated to reduce infection risk. Medical services on that page cover children from 30 days after birth to 15 years of age, including childhood vaccination through age 15.",
    summaryMy:
      "ချင်းမိုင်ရမ်ဆေးရုံသည် မွေးကင်းစမှ ကလေးကြီးအထိ စောင့်ရှောက်ရန် ကလေးအထူးကုဌာနကို တည်ထောင်ထားသည်။ ဆေးရုံစာမျက်နှာအရ နာမကျန်းကလေးများနှင့် ကာကွယ်ဆေးလာထိုးသည့် ကလေးများကို ခွဲထား၍ ကူးစက်မှုအန္တရာယ် လျှော့ချသည်။ ထိုစာမျက်နှာပါ ဆေးဝန်ဆောင်မှုသည် မွေးပြီး ၃၀ ရက်မှ အသက် ၁၅ နှစ်အထိ ဖြစ်ပြီး အသက် ၁၅ နှစ်အထိ ကလေးကာကွယ်ဆေး ထိုးခြင်း ပါဝင်သည်။",
    servicesEn: [
      "Paediatricians",
      "Developmental and behavioural paediatrics",
      "Paediatric infectious disease",
      "Paediatric nephrology",
      "Paediatric gastroenterology",
      "Paediatric endocrinology and growth",
      "Paediatric neurology",
      "Paediatric haematology",
      "Paediatric respiratory disease",
      "Neonatology",
      "Paediatric cardiology",
      "Paediatric allergy",
      "Childhood vaccination (newborn to 15 years)",
      "Respiratory disease",
      "Gastrointestinal disease",
      "Allergy",
      "Child development",
      "Growth promotion centre",
      "Childhood obesity",
      "Paediatric infectious disease care",
    ],
    servicesMy: [
      "ကလေးအထူးကု",
      "ဖွံ့ဖြိုးမှုနှင့် အပြုအမူဆိုင်ရာ ကလေးအထူးကု",
      "ကလေးကူးစက်ရောဂါ",
      "ကလေးကျောက်ကပ်",
      "ကလေးအစာလမ်းကြောင်း",
      "ကလေးဟော်မုန်းနှင့် အရပ်",
      "ကလေးအာရုံကြော",
      "ကလေးသွေးရောဂါ",
      "ကလေးအသက်ရှူလမ်းကြောင်း",
      "မွေးကင်းစအထူးကု",
      "ကလေးနှလုံး",
      "ကလေးဓာတ်မတည့်မှု",
      "ကလေးကာကွယ်ဆေး (မွေးကင်းစမှ အသက် ၁၅ နှစ်)",
      "အသက်ရှူလမ်းကြောင်းရောဂါ",
      "အစာလမ်းကြောင်းရောဂါ",
      "ဓာတ်မတည့်မှု",
      "ကလေးဖွံ့ဖြိုးမှု",
      "အရပ်မြှင့်တင်ဌာန",
      "ကလေးအဝလွန်ခြင်း",
      "ကလေးကူးစက်ရောဂါ စောင့်ရှောက်မှု",
    ],
    sortOrder: 30,
  },
  {
    slug: "health-center",
    sourceUrl: "https://chiangmairam.com/readcenter_clinic/23",
    imagePath: "/photos/health.jpg",
    nameEn: "Chiangmai Ram Health Center",
    nameMy: "ချင်းမိုင်ရမ် ကျန်းမာရေးစင်တာ",
    nameTh: "ศูนย์การแพทย์เชียงใหม่ ราม",
    summaryEn:
      "Chiangmai Ram Health Center is published as four health-service centres: Dental Centre, Skin and Aesthetic Centre, Health Check-up Centre, and Physical Therapy Centre, plus Chiangmai Ram Pharma on the same page. The hospital describes a hybrid of specialist care and a wellness setting, with separate buildings and parking.",
    summaryMy:
      "Chiangmai Ram Health Center ကို ဆေးရုံက ကျန်းမာရေးဌာန လေးခုအဖြစ် ဖော်ပြသည် - သွားဌာန၊ အရေပြားနှင့် အလှအပဌာန၊ ကျန်းမာရေးစစ်ဆေးဌာန၊ နှင့် ပြန်လည်သန်စွမ်းကုထုံးဌာန။ ထိုစာမျက်နှာတွင် Chiangmai Ram Pharma လည်း ပါသည်။ ဆေးရုံက အထူးကုစောင့်ရှောက်မှုနှင့် ကျန်းမာရေးပတ်ဝန်းကျင် ပေါင်းစပ်မှု၊ အဆောက်အအုံခွဲခြင်းနှင့် ကားရပ်ရန်နေရာ ရှိကြောင်း ဖော်ပြသည်။",
    servicesEn: [
      "Dental Centre",
      "Skin and Aesthetic Centre",
      "Health Check-up Centre",
      "Physical Therapy Centre",
      "Chiangmai Ram Pharma",
    ],
    servicesMy: [
      "သွားဌာန",
      "အရေပြားနှင့် အလှအပဌာန",
      "ကျန်းမာရေးစစ်ဆေးဌာန",
      "ပြန်လည်သန်စွမ်းကုထုံးဌာန",
      "Chiangmai Ram Pharma",
    ],
    sortOrder: 40,
    children: [
      {
        slug: "dental-center",
        sourceUrl: "https://chiangmairam.com/readcenter_clinic/23",
        imagePath: "/photos/dental.jpg",
        phone: "052-004621",
        hoursEn: "Daily 08:00–20:00. Also 093-130-9922, 097-919-9797",
        hoursMy: "နေ့စဉ် ၀၈:၀၀–၂၀:၀၀။ ၀၉၃-၁၃၀-၉၉၂၂၊ ၀၉၇-၉၁၉-၉၇၉၇",
        nameEn: "Dental Centre",
        nameMy: "သွားဌာန",
        nameTh: "ศูนย์ทันตกรรม",
        summaryEn:
          "Chiangmai Ram dental clinic: specialist dentists and technology listed on the Health Center page, including oral and maxillofacial surgery, oral medicine, endodontics, restorative dentistry, paediatric dentistry, orthodontics and Invisalign, periodontics, general dentistry and emergency care, bleaching, dental treatment under general anaesthesia when required, and Social Security claim service for scaling, filling, and extraction as published. Imaging listed: Periapical, Panoramic, Cephalometric, Postero-anterior, Cone Beam CT, and intra-oral scanner.",
        summaryMy:
          "ချင်းမိုင်ရမ် သွားဆေးခန်း - ကျန်းမာရေးစင်တာ စာမျက်နှာတွင် ဖော်ပြသည့် အထူးကုသွားဆရာဝန်နှင့် နည်းပညာ။ ပါးစပ်နှင့် မက်စ်စီလိုဖေးရှယ် ခွဲစိတ်မှု၊ ပါးစပ်ရောဂါ၊ အာဟာရပြွန်ကုသမှု၊ ပြန်လည်ပြုပြင်သွား၊ ကလေးသွား၊ ညှိသွားနှင့် Invisalign၊ သွားဖုံး၊ အထွေထွေသွားနှင့် အရေးပေါ်၊ အရောင်ချွတ်၊ လိုအပ်ပါက မေ့ဆေးဖြင့် ကလေးသွားကုသမှု၊ လူမှုဖူလုံရေး တိုက်ရိုက်တောင်းခံ (ကျောက်ချွတ်၊ ပိုးပိတ်၊ နှုတ်)။ ပုံရိပ် - Periapical၊ Panoramic၊ Cephalometric၊ Postero-anterior၊ Cone Beam CT နှင့် intra-oral scanner။",
        servicesEn: [
          "Oral and maxillofacial surgery (extraction, wisdom tooth, implants)",
          "Oral medicine",
          "Endodontics",
          "Restorative dentistry",
          "Paediatric dentistry",
          "Orthodontics and Invisalign",
          "Periodontics",
          "General dentistry and emergency",
          "Tooth bleaching",
          "Treatment under general anaesthesia when required",
          "Social Security claim (scaling, filling, extraction) as published",
        ],
        servicesMy: [
          "ပါးစပ်နှင့် မက်စ်စီလိုဖေးရှယ် ခွဲစိတ်မှု",
          "ပါးစပ်ရောဂါ",
          "အာဟာရပြွန်ကုသမှု",
          "ပြန်လည်ပြုပြင်သွား",
          "ကလေးသွား",
          "ညှိသွားနှင့် Invisalign",
          "သွားဖုံး",
          "အထွေထွေသွားနှင့် အရေးပေါ်",
          "အရောင်ချွတ်",
          "လိုအပ်ပါက မေ့ဆေးဖြင့် ကုသမှု",
          "လူမှုဖူလုံရေး တိုက်ရိုက်တောင်းခံ (ကျောက်ချွတ်၊ ပိုးပိတ်၊ နှုတ်)",
        ],
        sortOrder: 41,
      },
      {
        slug: "skin-aesthetic-center",
        sourceUrl: "https://chiangmairam.com/readcenter_clinic/23",
        imagePath: "/photos/skin.jpg",
        phone: "052-004622",
        hoursEn: "Mon–Fri 08:00–20:00, Sat 08:00–17:00, Sun 08:00–16:00",
        hoursMy: "တနင်္လာ–သောကြာ ၀၈:၀၀–၂၀:၀၀၊ စနေ ၀၈:၀၀–၁၇:၀၀၊ တနင်္ဂနွေ ၀၈:၀၀–၁၆:၀၀",
        nameEn: "Skin and Aesthetic Centre",
        nameMy: "အရေပြားနှင့် အလှအပဌာန",
        nameTh: "ศูนย์ผิวหนังและความงาม",
        summaryEn:
          "The hospital lists dermatology and aesthetic services under specialist dermatologists, including skin disease care, moles and skin cancer assessment as published, scalp and hair, acne, melasma and freckles, cryotherapy for warts, phototherapy for psoriasis and vitiligo, nail disease, and devices named on the page: Picosecond laser, Ulthera, ELOS, CO2 laser, Sculptra, filler, and botulinum toxin.",
        summaryMy:
          "ဆေးရုံက အရေပြားအထူးကုများအောက်တွင် အရေပြားရောဂါနှင့် အလှအပဝန်ဆောင်မှုများကို ဖော်ပြသည်။ အရေပြားရောဂါ၊ မှဲ့နှင့် အရေပြားကင်ဆာ စစ်ဆေးမှု (ဆေးရုံဖော်ပြချက်အတိုင်း)၊ ဦးခေါင်းနှင့် ဆံပင်၊ ဝက်ခြံ၊ မှိုနှင့် မှဲ့ခြောက်၊ ကြွက်နို့ Cryotherapy၊ psoriasis နှင့် vitiligo အတွက် Phototherapy၊ လက်သည်းရောဂါ၊ နှင့် စာမျက်နှာပါ ကိရိယာများ - Picosecond laser၊ Ulthera၊ ELOS၊ CO2 laser၊ Sculptra၊ filler နှင့် botulinum toxin။",
        servicesEn: [
          "Skin disease, contact dermatitis",
          "Lumps, moles, birthmarks, and published skin-cancer assessment",
          "Scalp and hair loss",
          "Acne",
          "Melasma and freckles",
          "Wart cryotherapy",
          "Phototherapy for psoriasis and vitiligo",
          "Nail disease",
          "Picosecond laser, Ulthera, ELOS, CO2 laser",
          "Sculptra, filler, botulinum toxin",
        ],
        servicesMy: [
          "အရေပြားရောဂါ၊ ထိတွေ့ဓာတ်မတည့်မှု",
          "အဖု၊ မှဲ့၊ မွေးရာပါအစက်နှင့် အရေပြားကင်ဆာ စစ်ဆေးမှု (ဖော်ပြချက်အတိုင်း)",
          "ဦးခေါင်းနှင့် ဆံပင်ကျွတ်",
          "ဝက်ခြံ",
          "မှိုနှင့် မှဲ့ခြောက်",
          "ကြွက်နို့ Cryotherapy",
          "Phototherapy",
          "လက်သည်းရောဂါ",
          "Picosecond laser, Ulthera, ELOS, CO2 laser",
          "Sculptra, filler, botulinum toxin",
        ],
        sortOrder: 42,
      },
      {
        slug: "checkup-center",
        sourceUrl: "https://chiangmairam.com/readcenter_clinic/23",
        imagePath: "/photos/checkup.jpg",
        phone: "052-004623",
        hoursEn: "Daily 08:00–16:00",
        hoursMy: "နေ့စဉ် ၀၈:၀၀–၁၆:၀၀",
        nameEn: "Health Check-up Centre",
        nameMy: "ကျန်းမာရေးစစ်ဆေးဌာန",
        nameTh: "ศูนย์ตรวจสุขภาพ",
        summaryEn:
          "Health Check-up Center is published as a one-stop service with specialist programmes, adult vaccination, wellness, and visa medical examinations certified for Australia, Canada, and New Zealand as stated on the hospital page.",
        summaryMy:
          "ကျန်းမာရေးစစ်ဆေးဌာနကို One Stop Service အဖြစ် ဖော်ပြထားပြီး အထူးပရိုဂရမ်များ၊ အရွယ်ရောက်ပြီးသူ ကာကွယ်ဆေး၊ wellness နှင့် ဩစတြေးလျ၊ ကနေဒါ၊ နယူးဇီလန် ဗီဇာဆေးစစ် (ဆေးရုံစာမျက်နှာအရ သံရုံးအသိအမှတ်ပြု) ပါဝင်သည်။",
        servicesEn: [
          "Health check-up",
          "Adult vaccination",
          "Wellness",
          "Visa examination (Australia, Canada, New Zealand) as published",
        ],
        servicesMy: [
          "ကျန်းမာရေးစစ်ဆေးမှု",
          "အရွယ်ရောက်ပြီးသူ ကာကွယ်ဆေး",
          "Wellness",
          "ဗီဇာဆေးစစ် (ဩစတြေးလျ၊ ကနေဒါ၊ နယူးဇီလန်) ဆေးရုံဖော်ပြချက်အတိုင်း",
        ],
        sortOrder: 43,
      },
      {
        slug: "physical-therapy-center",
        sourceUrl: "https://chiangmairam.com/readcenter_clinic/23",
        imagePath: "/photos/physio.jpg",
        phone: "052-004624",
        hoursEn: "Daily 08:00–16:00",
        hoursMy: "နေ့စဉ် ၀၈:၀၀–၁၆:၀၀",
        nameEn: "Physical Therapy Centre",
        nameMy: "ပြန်လည်သန်စွမ်းကုထုံးဌာန",
        nameTh: "ศูนย์กายภาพบำบัด",
        summaryEn:
          "The physical therapy centre is published as a full-service unit with rehabilitation physicians and physiotherapists. Listed indications include bone and joint pain (neck, back, knee, shoulder), neurological conditions such as paresis, paralysis and muscle weakness, delayed child development, office syndrome, and cardiovascular conditions. Listed technology: shockwave therapy and a Free Walk Robot for stroke rehabilitation.",
        summaryMy:
          "ပြန်လည်သန်စွမ်းကုထုံးဌာနကို ပြန်လည်သန်စွမ်းဆရာဝန်နှင့် ကာယကုထုံးပညာရှင်များဖြင့် ပြည့်စုံသော ယူနစ်အဖြစ် ဖော်ပြသည်။ ဖော်ပြထားသော အချက်များ - အရိုးနှင့် အဆစ်နာ (လည်ပင်း၊ ကျော၊ ဒူး၊ ပခုံး)၊ အာရုံကြောအခြေအနေ (လေဖြတ်၊ ကြွက်သားအားနည်း)၊ ကလေးဖွံ့ဖြိုးမှုနှောင့်နှေး၊ ရုံးခန်းရောဂါစု၊ နှလုံးနှင့် သွေးကြော။ နည်းပညာ - shockwave နှင့် လေဖြတ်ပြန်လည်သန်စွမ်း Free Walk Robot။",
        servicesEn: [
          "Bone and joint physiotherapy",
          "Neurological rehabilitation as published",
          "Delayed child development physiotherapy",
          "Office syndrome",
          "Cardiovascular physiotherapy as published",
          "Shockwave therapy",
          "Free Walk Robot for stroke rehabilitation",
        ],
        servicesMy: [
          "အရိုးနှင့် အဆစ် ကာယကုထုံး",
          "အာရုံကြော ပြန်လည်သန်စွမ်း (ဖော်ပြချက်အတိုင်း)",
          "ကလေးဖွံ့ဖြိုးမှုနှောင့်နှေး ကာယကုထုံး",
          "ရုံးခန်းရောဂါစု",
          "နှလုံးသွေးကြော ကာယကုထုံး (ဖော်ပြချက်အတိုင်း)",
          "Shockwave therapy",
          "လေဖြတ် Free Walk Robot",
        ],
        sortOrder: 44,
      },
      {
        slug: "chiangmai-ram-pharma",
        sourceUrl: "https://chiangmairam.com/readcenter_clinic/23",
        imagePath: "/photos/pharma.jpg",
        phone: "052-004623",
        hoursEn: "Daily 09:00–20:00",
        hoursMy: "နေ့စဉ် ၀၉:၀၀–၂၀:၀၀",
        nameEn: "Chiangmai Ram Pharma",
        nameMy: "ချင်းမိုင်ရမ် ဆေးဆိုင်",
        nameTh: "ร้านยาเชียงใหม่ ราม ฟาร์ม่า",
        summaryEn:
          "Chiangmai Ram Pharma is published on the Health Center page: household medicines, general health products, external medicines, medical devices, pharmacist counselling, and free blood-pressure measurement.",
        summaryMy:
          "Chiangmai Ram Pharma ကို ကျန်းမာရေးစင်တာ စာမျက်နှာတွင် ဖော်ပြသည် - အိမ်သုံးဆေး၊ အထွေထွေကျန်းမာရေးပစ္စည်း၊ ပြင်ပသုံးဆေး၊ ဆေးကိရိယာ၊ ဆေးဝါးပညာရှင် အကြံပေးခြင်း၊ သွေးဖိအား အခမဲ့တိုင်းခြင်း။",
        servicesEn: [
          "Household medicines and health products",
          "External medicines and medical devices",
          "Pharmacist counselling",
          "Free blood-pressure measurement",
        ],
        servicesMy: [
          "အိမ်သုံးဆေးနှင့် ကျန်းမာရေးပစ္စည်း",
          "ပြင်ပသုံးဆေးနှင့် ဆေးကိရိယာ",
          "ဆေးဝါးပညာရှင် အကြံပေးခြင်း",
          "သွေးဖိအား အခမဲ့တိုင်းခြင်း",
        ],
        sortOrder: 45,
      },
    ],
  },
];

export const INTERPRETER_LANGUAGES = [
  "German",
  "French",
  "English",
  "Chinese",
  "Japanese",
  "Myanmar",
  "Korean",
] as const;

export const INTERPRETER_SOURCE =
  "https://chiangmairam.com/news_detail/208";

export function flattenSpecialties(items: SpecialtySeed[] = SPECIALTIES): SpecialtySeed[] {
  return items.flatMap((item) => [item, ...flattenSpecialties(item.children ?? [])]);
}

export function visitorHours(hours?: string) {
  if (!hours) return undefined;
  if (/24\s*h|24\s*hour|၂၄\s*နာရီ/i.test(hours)) return undefined;
  return hours;
}
