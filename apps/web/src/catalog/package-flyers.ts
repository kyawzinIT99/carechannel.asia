/**
 * Hospital-published 2026 package flyers (LINE album 27 Aug 2026).
 * Shown full-size on the public homepage and packages page so visitors can read every item.
 */

export type FlyerGroup = "checkup" | "specialty" | "hospital";

export type PackageFlyer = {
  id: string;
  src: string;
  group: FlyerGroup;
  width: number;
  height: number;
  titleEn: string;
  titleMy: string;
  summaryEn: string;
  summaryMy: string;
};

export const PACKAGE_FLYERS: PackageFlyer[] = [
  {
    id: "checkup-comparison",
    src: "/photos/packages/checkup-2026-comparison.jpg",
    group: "checkup",
    width: 1555,
    height: 2200,
    titleEn: "2026 health check-up — full comparison",
    titleMy: "၂၀၂၆ ကျန်းမာရေးစစ်ဆေး — အပြည့်အစုံ နှိုင်းယှဉ်ဇယား",
    summaryEn: "STANDARD, ADVANCE, and PREMIUM tests side by side, with hospital list and sale prices.",
    summaryMy: "STANDARD၊ ADVANCE၊ PREMIUM စစ်ဆေးမှုများကို ဆေးရုံစာရင်းနှင့် လျှော့ဈေးအတူ ယှဉ်ကြည့်ပါ။",
  },
  {
    id: "checkup-prices",
    src: "/photos/packages/checkup-2026-prices.jpg",
    group: "checkup",
    width: 1555,
    height: 2200,
    titleEn: "2026 health check-up — price list",
    titleMy: "၂၀၂၆ ကျန်းမာရေးစစ်ဆေး — စျေးနှုန်း",
    summaryEn: "Under 39, ages 40–49, and 50+ — male, female, and Female Plus.",
    summaryMy: "၃၉ နှစ်အောက်၊ ၄၀–၄၉၊ ၅၀ နှင့်အထက် — ကျား၊ မ၊ Female Plus။",
  },
  {
    id: "premium-anc",
    src: "/photos/packages/premium-anc.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Premium ANC (antenatal care)",
    titleMy: "Premium ANC (ကိုယ်ဝန်စောင့်ရှောက်မှု)",
    summaryEn: "Special price 70,000 THB (list 80,000 THB).",
    summaryMy: "အထူးဈေး ၇၀,၀၀၀ ဘတ် (စာရင်းဈေး ၈၀,၀၀၀ ဘတ်)။",
  },
  {
    id: "endoscopy-opd",
    src: "/photos/packages/endoscopy-opd.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Gastroscopy & colonoscopy (OPD)",
    titleMy: "အစာအိမ်နှင့် အူမကြီးမှန်ပြောင်း (OPD)",
    summaryEn: "Gastroscopy 18,000 · Colonoscopy 28,000 · Both 38,000 THB.",
    summaryMy: "အစာအိမ် ၁၈,၀၀၀ · အူမကြီး ၂၈,၀၀၀ · နှစ်ခုလုံး ၃၈,၀၀၀ ဘတ်။",
  },
  {
    id: "thyroid",
    src: "/photos/packages/thyroid.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Thyroid check-up",
    titleMy: "သိုင်းရွိုက် စစ်ဆေး ပက်ကေ့ချ်",
    summaryEn: "P1 2,999 · P3 3,999 · P4 6,799 THB.",
    summaryMy: "P1 ၂,၉၉၉ · P3 ၃,၉၉၉ · P4 ၆,၇၉၉ ဘတ်။",
  },
  {
    id: "heart",
    src: "/photos/packages/heart.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Heart check-up",
    titleMy: "နှလုံး စစ်ဆေး ပက်ကေ့ချ်",
    summaryEn: "P.1 6,999 · P.2 11,999 · P.3 24,999 THB.",
    summaryMy: "P.1 ၆,၉၉၉ · P.2 ၁၁,၉၉၉ · P.3 ၂၄,၉၉၉ ဘတ်။",
  },
  {
    id: "ct-chest",
    src: "/photos/packages/ct-chest-low-dose.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "CT Chest Low Dose",
    titleMy: "CT Chest Low Dose",
    summaryEn: "Pulmonary exam + low-dose CT chest · 4,000 THB.",
    summaryMy: "အဆုတ်အထူးကု စစ်ဆေးမှု + low-dose CT · ၄,၀၀၀ ဘတ်။",
  },
  {
    id: "circumcision",
    src: "/photos/packages/circumcision.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Circumcision packages",
    titleMy: "အရေပြားလှီး ပက်ကေ့ချ်",
    summaryEn: "Infant 11,500 · Child local 22,000 · Child general 30,000 THB.",
    summaryMy: "မွေးကင်းစ ၁၁,၅၀၀ · ကလေး မေ့ဆေးเฉพาะနေရာ ၂၂,၀၀၀ · အထွေထွေမေ့ဆေး ၃၀,၀၀၀ ဘတ်။",
  },
  {
    id: "shingles",
    src: "/photos/packages/shingles-vaccine.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Shingles vaccine",
    titleMy: "ရေယုန်ခါးပတ် ကာကွယ်ဆေး",
    summaryEn: "1 dose 6,000 THB · 2 doses 11,000 THB.",
    summaryMy: "၁ ကြိမ် ၆,၀၀၀ ဘတ် · ၂ ကြိမ် ၁၁,၀၀၀ ဘတ်။",
  },
  {
    id: "cesarean",
    src: "/photos/packages/cesarean.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Cesarean section",
    titleMy: "ခွဲစိတ် မီးဖွားမှု",
    summaryEn: "Standard 71,000 · Premium 120,000 THB (3 days 4 nights).",
    summaryMy: "Standard ၇၁,၀၀၀ · Premium ၁၂၀,၀၀၀ ဘတ် (၃ ရက် ၄ ည)။",
  },
  {
    id: "liver-scan",
    src: "/photos/packages/liver-scan.jpg",
    group: "specialty",
    width: 1555,
    height: 2200,
    titleEn: "Liver Scan",
    titleMy: "အသဲ စကင်",
    summaryEn: "Transient elastography · 2,500 THB.",
    summaryMy: "Transient Elastography · ၂,၅၀၀ ဘတ်။",
  },
  {
    id: "maesai-office",
    src: "/photos/profile/maesai-office.jpg",
    group: "hospital",
    width: 1550,
    height: 2200,
    titleEn: "Mae Sai office & Chiang Mai map",
    titleMy: "မယ်ဆိုင် ရုံးနှင့် ချင်းမိုင် မြေပုံ",
    summaryEn: "Appointments at the Mae Sai office, 3.7 km from Mae Sai Customs House.",
    summaryMy: "မယ်ဆိုင် အကောက်ရုံးမှ ၃.၇ ကီလိုမီတာရှိ ရုံးတွင် ချိန်းဆိုနိုင်သည်။",
  },
  {
    id: "neurovascular",
    src: "/photos/profile/neurovascular.jpg",
    group: "hospital",
    width: 1550,
    height: 2200,
    titleEn: "Neurovascular centre",
    titleMy: "ဦးနှောက်သွေးကြောဆိုင်ရာ အထူးကုဌာန",
    summaryEn: "Stroke and brain-vessel care at Chiangmai Ram.",
    summaryMy: "ချင်းမိုင်ရမ်တွင် လေဖြတ်နှင့် ဦးနှောက်သွေးကြော စောင့်ရှောက်မှု။",
  },
  {
    id: "dermatology",
    src: "/photos/profile/dermatology.jpg",
    group: "hospital",
    width: 1550,
    height: 2200,
    titleEn: "Dermatology and beauty centre",
    titleMy: "အရေပြားနှင့် အလှအပ ဌာန",
    summaryEn: "Skin, laser, and plastic-surgery rooms on the hospital campus.",
    summaryMy: "ဆေးရုံနယ်မြေရှိ အရေပြား၊ လေဆာနှင့် ပလပ်စတစ်ခွဲစိတ် ခန်းများ။",
  },
  {
    id: "obstetrics",
    src: "/photos/profile/obstetrics.jpg",
    group: "hospital",
    width: 1550,
    height: 2200,
    titleEn: "Obstetrics and delivery",
    titleMy: "သားဖွားမီးယပ် ဌာန",
    summaryEn: "Antenatal care, screening, and delivery with obstetric specialists.",
    summaryMy: "ကိုယ်ဝန်စောင့်ရှောက်မှု၊ စစ်ဆေးမှုနှင့် မီးဖွားမှုကို အထူးကုများက ပေးသည်။",
  },
  {
    id: "cardiac-oncology",
    src: "/photos/profile/cardiac-oncology.jpg",
    group: "hospital",
    width: 1550,
    height: 2200,
    titleEn: "Heart centre & cancer care",
    titleMy: "နှလုံးဌာနနှင့် ကင်ဆာစောင့်ရှောက်မှု",
    summaryEn: "Cath lab, cardiac tests, and day-case chemotherapy.",
    summaryMy: "Cath lab၊ နှလုံးစစ်ဆေးမှုနှင့် တစ်ရက်တာ ဆေးသွင်းကုသမှု။",
  },
  {
    id: "hospital-campus",
    src: "/photos/profile/hospital-campus.jpg",
    group: "hospital",
    width: 1550,
    height: 2200,
    titleEn: "Chiangmai Ram Hospital campus",
    titleMy: "ချင်းမိုင်ရမ်ဆေးရုံ နယ်မြေ",
    summaryEn: "JCI-accredited campus in Chiang Mai city.",
    summaryMy: "ချင်းမိုင်မြို့ရှိ JCI အသိအမှတ်ပြု ဆေးရုံနယ်မြေ။",
  },
];

export function flyersIn(groups: FlyerGroup[], source: PackageFlyer[] = PACKAGE_FLYERS) {
  return source.filter((f) => groups.includes(f.group));
}

export function flyerRecordCode(id: string) {
  return `flyer-${id}`;
}

export function flyerFromPromotion(row: {
  code?: string | null;
  imagePath?: string | null;
  titleEn: string;
  titleMy: string;
  bodyEn: string;
  bodyMy: string;
  flyerGroup?: string | null;
}): PackageFlyer | null {
  if (!row.imagePath) return null;
  const fromCode = row.code?.startsWith("flyer-") ? row.code.slice("flyer-".length) : row.code;
  const catalog =
    PACKAGE_FLYERS.find((f) => f.id === fromCode || f.src === row.imagePath) ?? null;
  const group: FlyerGroup =
    row.flyerGroup === "checkup" || row.flyerGroup === "specialty" || row.flyerGroup === "hospital"
      ? row.flyerGroup
      : catalog?.group ?? "specialty";
  return {
    id: catalog?.id ?? fromCode ?? row.imagePath,
    src: row.imagePath,
    group,
    width: catalog?.width ?? 1555,
    height: catalog?.height ?? 2200,
    titleEn: row.titleEn,
    titleMy: row.titleMy,
    summaryEn: row.bodyEn,
    summaryMy: row.bodyMy,
  };
}
