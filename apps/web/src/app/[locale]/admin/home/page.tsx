import { Link } from "@/i18n/routing";
import { HomeContentForm } from "@/components/admin/home-content-form";
import { countPublishedPromotions, listSiteContent } from "@/server/db/site-content";
import { VISIT_ASSIST } from "@/catalog/hospital-source";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const dynamic = "force-dynamic";

const FIELDS = [
  { key: "home.heroEyebrow", label: "Hero eyebrow (small line above title)", multiline: false, fallbackEn: "Official Myanmar Partner Channel", fallbackMy: "တရားဝင် မြန်မာ မိတ်ဖက်လမ်းကြောင်း" },
  { key: "home.heroTitle", label: "Hero title", multiline: false, fallbackEn: "A calm start to your Chiangmai Ram visit", fallbackMy: "ချင်းမိုင်ရမ် ခရီးစဉ်ကို အေးချမ်းစွာ စတင်ပါ" },
  { key: "home.heroHighlight", label: "Hero highlight", multiline: false, fallbackEn: "We help you plan the visit first — then a coordinator stays with you by email and Telegram.", fallbackMy: "ခရီးစဉ်ကို ဦးစွာ စီစဉ်ပေးသည်။ ညှိနှိုင်းရေးမှူးက အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက်ကူညီမည်။" },
  { key: "home.heroBody", label: "Hero body paragraph", multiline: true, fallbackEn: "This is a partner channel for Myanmar and international guests. Read hospital-published centres and 2026 check-up packages, then send one request. Nothing here is emergency care.", fallbackMy: "ဤသည် မြန်မာနှင့် နိုင်ငံတကာ ဧည့်သည်များအတွက် မိတ်ဖက်လမ်းကြောင်းဖြစ်သည်။ ဆေးရုံထုတ်ပြန်သည့် ဌာနနှင့် ၂၀၂၆ စစ်ဆေးပက်ကေ့ချ်ကို ဖတ်ပြီး တောင်းဆိုမှုတစ်ခု ပို့ပါ။ ဤနေရာသည် အရေးပေါ်ကုသမှု မဟုတ်ပါ။" },
  { key: "home.ctaPrimary", label: "Primary button", multiline: false, fallbackEn: "Request a visit", fallbackMy: "လာရောက်ရန် တောင်းဆိုမည်" },
  { key: "home.ctaSecondary", label: "Secondary button", multiline: false, fallbackEn: "See 2026 packages", fallbackMy: "၂၀၂၆ ပက်ကေ့ချ်များ" },
  { key: "partner.linePhone", label: "LINE number (public)", multiline: false, fallbackEn: "082-567-4570", fallbackMy: "082-567-4570" },
  { key: "partner.telegramUrl", label: "Telegram username link only (https://t.me/yourname). Leave blank to open Telegram chat with the LINE phone. Do not use t.me/+66… — that is an invite link and will fail.", multiline: false, fallbackEn: "", fallbackMy: "" },
  { key: "partner.viberPhone", label: "Viber number (public)", multiline: false, fallbackEn: "+95 9504 3252", fallbackMy: "+95 9504 3252" },
  { key: "partner.googleFormUrl", label: "Public Google Form shown next to the website request.", multiline: false, fallbackEn: "https://docs.google.com/forms/d/e/1FAIpQLSfV14CMMEqKiKkALBxB0JKc740JKPiAIrY-ykNQUqTjKsJbKw/viewform", fallbackMy: "https://docs.google.com/forms/d/e/1FAIpQLSfV14CMMEqKiKkALBxB0JKc740JKPiAIrY-ykNQUqTjKsJbKw/viewform" },
  { key: "visit.pickupTitle", label: "Airport pickup title", multiline: false, fallbackEn: VISIT_ASSIST[0].titleEn, fallbackMy: VISIT_ASSIST[0].titleMy },
  { key: "visit.pickupBody", label: "Airport pickup body", multiline: true, fallbackEn: VISIT_ASSIST[0].bodyEn, fallbackMy: VISIT_ASSIST[0].bodyMy },
  { key: "visit.stayTitle", label: "Rental apartment title", multiline: false, fallbackEn: VISIT_ASSIST[1].titleEn, fallbackMy: VISIT_ASSIST[1].titleMy },
  { key: "visit.stayBody", label: "Rental apartment body", multiline: true, fallbackEn: VISIT_ASSIST[1].bodyEn, fallbackMy: VISIT_ASSIST[1].bodyMy },
  { key: "visit.visaTitle", label: "Visa help title", multiline: false, fallbackEn: VISIT_ASSIST[2].titleEn, fallbackMy: VISIT_ASSIST[2].titleMy },
  { key: "visit.visaBody", label: "Visa help body", multiline: true, fallbackEn: VISIT_ASSIST[2].bodyEn, fallbackMy: VISIT_ASSIST[2].bodyMy },
];

export default async function AdminHomeContentPage() {
  let stored: { key: string; valueEn: string; valueMy: string }[] = [];
  let promoCount = 0;
  try {
    stored = await listSiteContent();
    promoCount = await countPublishedPromotions();
  } catch {
    stored = [];
  }
  const map = Object.fromEntries(stored.map((r) => [r.key, r]));

  const rows = FIELDS.map((f) => ({
    key: f.key,
    label: f.label,
    multiline: f.multiline,
    valueEn: map[f.key]?.valueEn || f.fallbackEn,
    valueMy: map[f.key]?.valueMy || f.fallbackMy,
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Homepage"
        hint="Hero copy, LINE / Telegram / Viber, pickup and stay text. Announcements come from Promotions. Package prices come from Packages. Centres come from Specialties."
        liveHref="/en"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/promotions" className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <p className="text-2xl font-semibold text-[#1a2330]">{promoCount}</p>
          <p className="mt-1 text-sm font-semibold text-[#1a2330]">Published announcements</p>
          <p className="mt-1 text-xs text-slate-500">These cards appear on the public homepage.</p>
        </Link>
        <Link href="/admin/packages" className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
          <p className="text-sm font-semibold text-[#1a2330]">Package prices</p>
          <p className="mt-1 text-xs text-slate-500">The homepage price row and /packages use published packages from this catalog.</p>
        </Link>
      </div>

      <HomeContentForm rows={rows} />
    </div>
  );
}
