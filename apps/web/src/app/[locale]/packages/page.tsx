import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageContainer } from "@/components/page-container";
import { loadPublicPackages, loadPublicPromotions } from "@/server/content/public";
import { VisitAssistSection } from "@/components/visit-assist-section";

export const dynamic = "force-dynamic";

const TIER_STYLE: Record<string, {
  frame: string;
  rail: string;
  badge: string;
  name: string;
  price: string;
  muted: string;
  btn: string;
  recommended?: boolean;
}> = {
  STANDARD: {
    frame: "bg-white ring-1 ring-slate-200/90",
    rail: "bg-slate-300",
    badge: "text-slate-500",
    name: "text-[#1a2330]",
    price: "text-[#1a2330]",
    muted: "text-slate-500",
    btn: "bg-[#1a2330] text-white hover:bg-[#111820]",
  },
  ADVANCE: {
    frame: "bg-white ring-1 ring-[#0b4f9c]/25 shadow-[0_18px_40px_rgba(11,79,156,0.08)]",
    rail: "bg-[#0b4f9c]",
    badge: "text-[#0b4f9c]",
    name: "text-[#1a2330]",
    price: "text-[#0b4f9c]",
    muted: "text-slate-500",
    btn: "bg-[#0b4f9c] text-white hover:bg-[#083a73]",
    recommended: true,
  },
  PREMIUM: {
    frame: "bg-[#fbf8f1] ring-1 ring-[#d4af37]/40",
    rail: "bg-[#d4af37]",
    badge: "text-[#b8860b]",
    name: "text-[#1a2330]",
    price: "text-[#9a7b12]",
    muted: "text-slate-500",
    btn: "bg-[#d4af37] text-[#1a2330] hover:bg-[#c9a227]",
  },
  MORE: {
    frame: "bg-white ring-1 ring-slate-200",
    rail: "bg-slate-200",
    badge: "text-slate-500",
    name: "text-[#1a2330]",
    price: "text-[#0b4f9c]",
    muted: "text-slate-500",
    btn: "bg-[#1a2330] text-white hover:bg-[#111820]",
  },
};

function tierOf(code: string) {
  if (code.startsWith("PREMIUM")) return "PREMIUM";
  if (code.startsWith("ADVANCE")) return "ADVANCE";
  if (code.startsWith("STANDARD")) return "STANDARD";
  return "MORE";
}

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const my = locale === "my";

  const [promotions, packages] = await Promise.all([
    loadPublicPromotions(),
    loadPublicPackages(),
  ]);

  const groups = (["STANDARD", "ADVANCE", "PREMIUM", "MORE"] as const)
    .map((tier) => ({
      tier,
      pkgs: packages.filter((p) => tierOf(p.code) === tier),
      style: TIER_STYLE[tier],
    }))
    .filter((g) => g.pkgs.length > 0);

  return (
    <>
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {my ? "ဆေးရုံ ၂၀၂၆ ထုတ်ပြန်ချက်" : "Hospital-published · 2026"}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-[#1a2330] md:text-5xl">
            {my ? "ကျန်းမာရေး စစ်ဆေး ပက်ကေ့ချ်" : "Health check-up packages"}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
            {my
              ? "ပက်ကေ့ချ်နှင့် စျေးနှုန်းကို အက်ဒမင်က ထိန်းချုပ်သည်။ ညှိနှိုင်းရေးမှူးက အီးမေးလ်နှင့် Telegram ဖြင့် ရှင်းပြမည်။"
              : "Prices are managed in the admin panel. A coordinator walks you through the right package by email and Telegram."}
          </p>
        </div>
      </section>

      <PageContainer>
        {promotions.map((promo) => (
          <div key={promo.id} className="mb-8 overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-slate-200/90">
            <div className="h-1.5 w-full bg-[#d4af37]" />
            <div className="p-6 md:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
                {my ? "ဆေးရုံထုတ်ပြန်ချက်" : "Hospital-published"}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#1a2330] md:text-2xl">
                {my ? promo.titleMy : promo.titleEn}
              </h2>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
                {my ? promo.bodyMy : promo.bodyEn}
              </p>
            </div>
          </div>
        ))}

        {groups.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-center text-slate-500">
            {my ? "လက်ရှိ ပြသရန် ပက်ကေ့ချ် မရှိသေးပါ" : "No published packages yet. An admin can publish them from the panel."}
          </p>
        ) : (
          <div className={`grid items-stretch gap-5 ${groups.length > 1 ? "lg:grid-cols-3" : ""}`}>
            {groups.map((t) => {
              const s = t.style;
              return (
                <article
                  key={t.tier}
                  className={`relative flex flex-col overflow-hidden rounded-[1.75rem] ${s.frame}`}
                >
                  <div className={`h-1.5 w-full ${s.rail}`} />
                  <div className="flex flex-1 flex-col p-7">
                    <div className="flex items-center justify-between gap-3">
                      <p className={`text-[11px] font-bold uppercase tracking-[0.2em] ${s.badge}`}>
                        {t.tier}
                      </p>
                      {s.recommended ? (
                        <span className="rounded-full bg-[#0b4f9c]/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0b4f9c]">
                          {my ? "အကြံပြု" : "Recommended"}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-6 flex-1 space-y-6">
                      {t.pkgs.map((pkg) => {
                        const list = Number(pkg.listPrice);
                        const sale = Number(pkg.salePrice);
                        const saving = list - sale;
                        const savePct = list > 0 ? Math.round((saving / list) * 100) : 0;
                        const features = my ? pkg.featuresMy : pkg.featuresEn;
                        return (
                          <div key={pkg.code} className="border-t border-slate-100 pt-5 first:border-t-0 first:pt-0">
                            {pkg.highlight ? (
                              <p className="mb-2 text-[11px] font-medium text-slate-400">{pkg.highlight}</p>
                            ) : null}
                            <p className={`text-[15px] font-medium leading-6 ${s.name}`}>
                              {my ? pkg.nameMy : pkg.nameEn}
                            </p>
                            <div className="mt-3 flex items-baseline gap-3">
                              <p className={`text-[2rem] font-semibold leading-none tracking-tight ${s.price}`}>
                                {sale.toLocaleString()}
                                <span className={`ml-1.5 text-sm font-medium ${s.muted}`}>THB</span>
                              </p>
                              {list > sale ? (
                                <p className={`text-sm ${s.muted}`}>
                                  <span className="line-through">{list.toLocaleString()}</span>
                                  <span className="ml-2 font-medium text-[#1a2330]">
                                    {my ? `${savePct}%` : `−${savePct}%`}
                                  </span>
                                </p>
                              ) : null}
                            </div>
                            {features.length > 0 ? (
                              <details className="mt-4 group">
                                <summary className={`cursor-pointer list-none text-sm font-medium ${s.badge} marker:content-none`}>
                                  <span className="underline-offset-4 group-open:underline">
                                    {my ? `${features.length} စစ်ဆေးမှု` : `${features.length} included tests`}
                                  </span>
                                </summary>
                                <ul className={`mt-3 max-h-44 space-y-1.5 overflow-auto text-[13px] leading-6 ${s.muted}`}>
                                  {features.map((line, idx) => (
                                    <li key={`${pkg.code}-${idx}`}>{line}</li>
                                  ))}
                                </ul>
                              </details>
                            ) : null}
                            <Link
                              href={`/contact?package=${pkg.code}`}
                              className={`mt-5 block rounded-full py-2.5 text-center text-sm font-semibold transition ${s.btn}`}
                            >
                              {my ? `${pkg.nameMy} တောင်းဆိုမည်` : `Request ${pkg.nameEn}`}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-slate-100">
          <VisitAssistSection locale={locale} compact />
        </div>

        <div className="mt-10 rounded-3xl bg-[#1a2330] p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">
            {my ? "မည်သည့် ပက်ကေ့ချ်ကို ရွေးရမည်မသိပါ?" : "Not sure which package?"}
          </h2>
          <p className="mt-3 text-white/70">
            {my
              ? "ညှိနှိုင်းရေးမှူးသည် သင့်အတွက် အသင့်တော်ဆုံးကို အီးမေးလ်နှင့် Telegram ဖြင့် ညွှန်ပြပေးပါမည်"
              : "A coordinator recommends the right one for you by email and Telegram — before you book"}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#1a2330]"
          >
            {my ? "ညှိနှိုင်းရန် တောင်းဆိုမည်" : "Ask a coordinator"}
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
