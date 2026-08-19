import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { visitorHours } from "@/catalog/hospital-source";
import { loadPublicSpecialtyTree } from "@/server/content/public";

// Visual accent per top-level centre
const ACCENT: Record<string, { bar: string; badge: string; dot: string }> = {
  "cardiac-balloon-center":  { bar: "bg-red-600",     badge: "bg-red-50 text-red-700 ring-red-200",      dot: "bg-red-500"    },
  "stroke-center":           { bar: "bg-violet-600",  badge: "bg-violet-50 text-violet-700 ring-violet-200", dot: "bg-violet-500" },
  "childrens-hospital":      { bar: "bg-emerald-600", badge: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  "health-center":           { bar: "bg-[#0b4f9c]",  badge: "bg-sky-50 text-sky-700 ring-sky-200",       dot: "bg-sky-600"    },
};

// Sub-centre accent colours
const SUB_ACCENT: Record<string, string> = {
  "dental-center":          "bg-teal-50  text-teal-700  ring-teal-200",
  "skin-aesthetic-center":  "bg-pink-50  text-pink-700  ring-pink-200",
  "checkup-center":         "bg-sky-50   text-sky-700   ring-sky-200",
  "physical-therapy-center":"bg-amber-50 text-amber-700 ring-amber-200",
  "chiangmai-ram-pharma":   "bg-lime-50  text-lime-700  ring-lime-200",
};

export const dynamic = "force-dynamic";

export default async function SpecialtiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const my = locale === "my";
  const tree = await loadPublicSpecialtyTree();

  return (
    <>
      {/* ── HERO ── */}
      <section className="border-b border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {my ? "ဆေးရုံ ထုတ်ပြန်ချက်" : "Hospital-published centres"}
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-[#1a2330] md:text-5xl">
            {my ? "ကျွမ်းကျင်ဆေးဌာနများ" : "Specialty centres"}
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
            {my
              ? "ချင်းမိုင်ရမ်ဆေးရုံ ထုတ်ပြန်သည့် ဌာနများသာ ဖော်ပြသည်။ ထုတ်ပြန်မထားသော ဝန်ဆောင်မှုများ မထည့်ပါ။"
              : "Every centre listed here is published by Chiangmai Ram Hospital. Unpublished services are not added."}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">

        {/* ── TOP-LEVEL CENTRES ── */}
        {tree.filter(c => !c.children?.length || c.slug !== "health-center").map((centre) => {
          const accent = ACCENT[centre.slug] ?? ACCENT["health-center"];
          const services = my ? centre.servicesMy : centre.servicesEn;
          const hours = visitorHours((my ? centre.hoursMy : centre.hoursEn) ?? undefined);

          return (
            <div key={centre.slug} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
              {/* Colour bar top */}
              <div className={`h-1.5 w-full ${accent.bar}`} />

              <div className="grid md:grid-cols-[340px_1fr]">
                {/* Image */}
                {centre.imagePath && (
                  <div className="relative h-64 md:h-auto min-h-[220px]">
                    <Image
                      src={centre.imagePath}
                      alt={centre.nameEn}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 340px, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:bg-gradient-to-l" />
                    {/* Thai label */}
                    <span className="absolute bottom-3 left-4 rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                      {centre.nameTh}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                        {my ? centre.nameMy : centre.nameEn}
                      </h2>
                      {my && (
                        <p className="mt-0.5 text-sm text-slate-400">{centre.nameEn}</p>
                      )}
                    </div>
                    {hours && (
                      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${accent.badge}`}>
                        {hours.split(",")[0].split(".")[0]}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 leading-8 text-slate-600">
                    {my ? centre.summaryMy : centre.summaryEn}
                  </p>

                  {/* Service pills */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {services.slice(0, 8).map((s) => (
                      <span
                        key={s}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${accent.badge}`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent.dot}`} />
                        {s}
                      </span>
                    ))}
                    {services.length > 8 && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        +{services.length - 8} {my ? "ပိုမိုပါဝင်သည်" : "more"}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex flex-wrap gap-3 pt-6">
                    <Link
                      href={`/contact?specialty=${centre.slug}`}
                      className={`rounded-full px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 ${accent.bar}`}
                    >
                      {my ? "ဤဌာနအတွက် တောင်းဆိုမည်" : "Request this centre"}
                    </Link>
                    <Link
                      href={`/specialties/${centre.slug}`}
                      className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      {my ? "အသေးစိတ်ကြည့်ရန်" : "Full details"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── HEALTH CENTER + SUB-CENTRES ── */}
        {tree.filter(c => c.slug === "health-center").map((hc) => {
          return (
            <div key={hc.slug}>
              {/* Parent card */}
              <div className="overflow-hidden rounded-3xl bg-[#062244] text-white shadow-md">
                <div className="grid md:grid-cols-[340px_1fr]">
                  {hc.imagePath && (
                    <div className="relative h-56 md:h-auto min-h-[200px]">
                      <Image
                        src={hc.imagePath}
                        alt={hc.nameEn}
                        fill
                        className="object-cover opacity-60"
                        sizes="(min-width: 768px) 340px, 100vw"
                      />
                    </div>
                  )}
                  <div className="flex flex-col p-6 md:p-8">
                    <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-300">
                      {my ? "ကျန်းမာရေးဌာနစု" : "Health Centre Complex"}
                    </span>
                    <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                      {my ? hc.nameMy : hc.nameEn}
                    </h2>
                    {my && <p className="mt-0.5 text-sm text-sky-300/80">{hc.nameEn}</p>}
                    <p className="mt-4 leading-8 text-sky-100">
                      {my ? hc.summaryMy : hc.summaryEn}
                    </p>
                    <Link
                      href={`/specialties/${hc.slug}`}
                      className="mt-6 w-fit rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      {my ? "ဌာနစု အသေးစိတ်" : "Centre details"}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Sub-centres grid */}
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {hc.children?.map((sub) => {
                  const subServices = my ? sub.servicesMy : sub.servicesEn;
                  const subHours = visitorHours((my ? sub.hoursMy : sub.hoursEn) ?? undefined);
                  const subBadge = SUB_ACCENT[sub.slug] ?? "bg-slate-50 text-slate-700 ring-slate-200";

                  return (
                    <Link
                      key={sub.slug}
                      href={`/specialties/${sub.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:shadow-md hover:ring-2 hover:-translate-y-0.5 hover:ring-[#0b4f9c]/20"
                    >
                      {/* Sub image */}
                      {sub.imagePath && (
                        <div className="relative -mx-5 -mt-5 mb-4 h-32 overflow-hidden rounded-t-2xl">
                          <Image
                            src={sub.imagePath}
                            alt={sub.nameEn}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 50vw, 100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <span className="absolute bottom-2 left-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                            {sub.nameTh}
                          </span>
                        </div>
                      )}

                      <h3 className="font-bold text-slate-900 leading-snug">
                        {my ? sub.nameMy : sub.nameEn}
                      </h3>
                      {my && <p className="mt-0.5 text-[11px] text-slate-400">{sub.nameEn}</p>}

                      {subHours && (
                        <p className={`mt-2 w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${subBadge}`}>
                          {subHours.split(",")[0].split("Also")[0].trim()}
                        </p>
                      )}

                      {/* Top 3 services */}
                      <ul className="mt-3 space-y-1.5 flex-1">
                        {subServices.slice(0, 4).map((s) => (
                          <li key={s} className="flex items-start gap-1.5 text-xs leading-relaxed text-slate-600">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#0b4f9c]" />
                            {s}
                          </li>
                        ))}
                        {subServices.length > 4 && (
                          <li className="text-xs text-slate-400">+{subServices.length - 4} more</li>
                        )}
                      </ul>

                      <span className="mt-4 text-xs font-bold text-[#0b4f9c]">
                        {my ? "ပိုမိုသိရှိရန် →" : "Details →"}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Request any health-centre service */}
              <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 px-5 py-4">
                <p className="text-sm text-sky-800">
                  {my
                    ? "ဤ ကျန်းမာရေးဌာနစု ထဲမှ မည်သည့်ဝန်ဆောင်မှုကိုမဆို ညှိနှိုင်းရေးမှူးမှ ကူညီပေးနိုင်ပါသည်"
                    : "A coordinator can help you book any service across this Health Centre complex."}
                  {" "}
                  <Link href="/contact?specialty=health-center" className="font-bold text-sky-700 hover:underline">
                    {my ? "တောင်းဆိုမည် →" : "Send a request →"}
                  </Link>
                </p>
              </div>
            </div>
          );
        })}

        {/* ── CTA BAND ── */}
        <div className="rounded-3xl bg-[#1a2330] p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">
            {my ? "ကြည့်ရှုလိုသော ဌာနကို ရွေးပြီးပြီလား?" : "Found the centre you need?"}
          </h2>
          <p className="mt-3 text-white/70">
            {my
              ? "ညှိနှိုင်းရေးမှူးသည် ခရီးမထွက်မီ အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက်ကူညီပါမည်"
              : "A coordinator follows up by email and Telegram before you travel — no guesswork on arrival"}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#1a2330]"
          >
            {my ? "ဆက်သွယ်ရန်" : "Request a visit"}
          </Link>
        </div>
      </div>
    </>
  );
}
