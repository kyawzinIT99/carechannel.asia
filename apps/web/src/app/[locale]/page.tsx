import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { loadPublicChrome, loadPublicCopy, loadPublicPromotions, loadPublicSpecialties } from "@/server/content/public";
import { VisitAssistSection } from "@/components/visit-assist-section";
import { ContactChannels } from "@/components/contact-channels";
import { ShwedagonMark } from "@/components/shwedagon-mark";
import { HospitalFilm } from "@/components/hospital-film";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const my = locale === "my";

  const [copy, promotions, featuredCentres, chrome] = await Promise.all([
    loadPublicCopy(locale),
    loadPublicPromotions(),
    loadPublicSpecialties(),
    loadPublicChrome(),
  ]);
  const pick = (key: string, fallbackEn: string, fallbackMy: string) =>
    copy[key] || (locale === "my" ? fallbackMy : fallbackEn);

  const heroEyebrow = pick(
    "home.heroEyebrow",
    "Official Myanmar Partner Channel",
    "တရားဝင် မြန်မာ မိတ်ဖက်လမ်းကြောင်း",
  );
  const heroTitle = pick("home.heroTitle", "A calm start to your Chiangmai Ram visit", "ချင်းမိုင်ရမ် ခရီးစဉ်ကို အေးချမ်းစွာ စတင်ပါ");
  const heroHighlight = pick(
    "home.heroHighlight",
    "We help you plan the visit first — then a coordinator stays with you by email and Telegram.",
    "ခရီးစဉ်ကို ဦးစွာ စီစဉ်ပေးသည်။ ညှိနှိုင်းရေးမှူးက အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက်ကူညီမည်။",
  );
  const heroBody = pick(
    "home.heroBody",
    "This is a partner channel for Myanmar and international guests. Read hospital-published centres and 2026 check-up packages, then send one request. Nothing here is emergency care.",
    "ဤသည် မြန်မာနှင့် နိုင်ငံတကာ ဧည့်သည်များအတွက် မိတ်ဖက်လမ်းကြောင်းဖြစ်သည်။ ဆေးရုံထုတ်ပြန်သည့် ဌာနနှင့် ၂၀၂၆ စစ်ဆေးပက်ကေ့ချ်ကို ဖတ်ပြီး တောင်းဆိုမှုတစ်ခု ပို့ပါ။ ဤနေရာသည် အရေးပေါ်ကုသမှု မဟုတ်ပါ။",
  );
  const ctaPrimary = pick("home.ctaPrimary", "Request a visit", "လာရောက်ရန် တောင်းဆိုမည်");
  const ctaSecondary = pick("home.ctaSecondary", "See 2026 packages", "၂၀၂၆ ပက်ကေ့ချ်များ");
  const centres = featuredCentres.slice(0, 8);

  return (
    <>
      <section className="border-b border-[#e4ebe4] bg-[#f6f3ec]">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:py-20">
          <div>
            <p
              className={
                my
                  ? "inline-flex items-center gap-2 text-base font-bold"
                  : "inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em]"
              }
              style={{ color: "#D4AF37" }}
            >
              <ShwedagonMark />
              {heroEyebrow}
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.15] text-[#1a2330] md:text-5xl">
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-lg text-lg font-medium leading-8 text-[#3f5c48]">
              {heroHighlight}
            </p>
            <p className="mt-3 max-w-lg text-[15px] leading-8 text-slate-600">
              {heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-[#1a2330] px-7 py-3 text-sm font-semibold text-white hover:bg-[#111820]"
              >
                {ctaPrimary}
              </Link>
              <a
                href={chrome.googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#1a2330]/15 bg-white px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white/80"
              >
                {my ? "Google Form" : "Google Form"}
              </a>
              <Link
                href="/packages"
                className="rounded-full border border-[#1a2330]/15 bg-white px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white/80"
              >
                {ctaSecondary}
              </Link>
            </div>
          </div>

          <figure className="relative">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_50px_rgba(26,35,48,0.12)] ring-1 ring-black/5">
              <div className="relative aspect-[4/5] min-h-[280px] sm:aspect-[5/4] md:min-h-[420px]">
                <Image
                  src={chrome.heroPath}
                  alt={my ? "ချင်းမိုင်ရမ် ကျန်းမာရေးစင်တာ ဥယျာဉ်" : "Garden at Chiangmai Ram Health Center"}
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1a2330]/75 to-transparent px-5 pb-5 pt-16">
                  <p className="text-sm font-semibold leading-6 text-white md:text-base">
                    {my
                      ? "ကျန်းမာရေးစင်တာ ဥယျာဉ် — ခရီးစဉ်ကို ဤနေရာမှ စီစဉ်ပါ။"
                      : "Health Center garden — a quieter first view of the campus."}
                  </p>
                </div>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section className="border-b border-[#e4ebe4] bg-[#1a2330]">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
          <HospitalFilm locale={locale} />
        </div>
      </section>

      {promotions.length > 0 && (
        <section className="bg-[#f7f4ee] py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a3b]">
                  {my ? "ကြေညာချက်" : "Announcements"}
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1a2330] md:text-4xl">
                  {my ? "လက်ရှိ ပရိုမိုးရှင်း" : "Latest from the partner channel"}
                </h2>
              </div>
              <Link href="/contact" className="inline-flex w-fit text-sm font-semibold text-[#1a2330] underline-offset-4 hover:underline">
                {my ? "ညှိနှိုင်းရန်" : "Ask a coordinator"}
              </Link>
            </div>

            <div className="mt-10 space-y-5">
              {promotions.map((promo, i) => (
                <article
                  key={promo.id}
                  className="overflow-hidden rounded-[1.5rem] bg-white shadow-[0_10px_30px_rgba(26,35,48,0.06)] ring-1 ring-black/5 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
                >
                  {promo.imagePath ? (
                    <div className="relative h-44 md:h-full md:min-h-[220px]">
                      <Image src={promo.imagePath} alt="" fill className="object-cover" sizes="40vw" />
                    </div>
                  ) : (
                    <div className="flex h-32 items-center bg-[#1a2330] px-6 md:h-full md:min-h-[220px]">
                      <p className="text-sm font-semibold text-[#d7dde3]">Chiangmai Ram Myanmar</p>
                    </div>
                  )}
                  <div className="p-6 md:p-8">
                    {i === 0 ? (
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#8a6a3b]">
                        {my ? "အထူးသတင်း" : "Now showing"}
                      </p>
                    ) : null}
                    <h3 className="mt-1 text-xl font-bold leading-snug text-[#1a2330] md:text-2xl">
                      {my ? promo.titleMy : promo.titleEn}
                    </h3>
                    <p className="mt-3 line-clamp-4 leading-7 text-slate-600">
                      {my ? promo.bodyMy : promo.bodyEn}
                    </p>
                    <Link href="/contact" className="mt-5 inline-flex text-sm font-bold text-[#1a2330]">
                      {my ? "ဆက်လက်ဖတ်ရန်" : "Read with a coordinator"} →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {my ? "ဌာနများ" : "Centres"}
            </p>
            <h2 className="mt-1 text-3xl font-semibold text-[#1a2330]">
              {my ? "ကြည့်ရှုနိုင်သော ဌာနများ" : "Choose a centre to visit"}
            </h2>
          </div>
          <Link href="/specialties" className="text-sm font-semibold text-[#1a2330] hover:underline">
            {my ? "အားလုံး →" : "View all →"}
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {centres.map((c) => (
            <Link
              key={c.slug}
              href={`/specialties/${c.slug}`}
              className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {c.imagePath && (
                <div className="relative h-36">
                  <Image src={c.imagePath} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-sm font-bold text-white">
                    {my ? c.nameMy : c.nameEn}
                  </span>
                </div>
              )}
              {!c.imagePath && (
                <div className="p-4">
                  <p className="font-bold text-slate-900">{my ? c.nameMy : c.nameEn}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <VisitAssistSection locale={locale} compact />
        </div>
      </section>

      <section className="border-t border-[#e4ebe4] bg-white py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-[#1a2330]">{my ? "အဆင်သင့်ဖြစ်သောအခါ တောင်းဆိုပါ" : "Ask when you are ready"}</h2>
          <p className="mt-4 leading-8 text-slate-600">
            {my
              ? "တရားဝင် incentive ပမာဏကို ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှသာ အတည်ပြုပါ။"
              : "The official incentive amount is confirmed only on this website, LINE, Telegram, or Viber."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="rounded-full bg-[#1a2330] px-7 py-3 text-sm font-semibold text-white hover:bg-[#111820]">
              {ctaPrimary}
            </Link>
          </div>
          <div className="mx-auto mt-6 max-w-md">
            <ContactChannels locale={locale} variant="pills" />
          </div>
        </div>
      </section>
    </>
  );
}
