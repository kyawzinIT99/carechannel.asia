import { notFound } from "next/navigation";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { visitorHours } from "@/catalog/hospital-source";
import { loadPublicSpecialties } from "@/server/content/public";
import { Link } from "@/i18n/routing";
import { PageContainer } from "@/components/page-container";

export const dynamic = "force-dynamic";

export default async function SpecialtyDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const all = await loadPublicSpecialties();
  const centre = all.find((item) => item.slug === slug);
  if (!centre) notFound();

  const my = locale === "my";
  const services = my ? centre.servicesMy : centre.servicesEn;
  const hours = visitorHours((my ? centre.hoursMy : centre.hoursEn) ?? undefined);
  const name = my ? centre.nameMy : centre.nameEn;
  const summary = my ? centre.summaryMy : centre.summaryEn;

  return (
    <PageContainer>
      {/* Back */}
      <Link href="/specialties" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-[#1a2330] hover:underline">
        ← {my ? "ဌာနအားလုံး" : "All centres"}
      </Link>

      <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
        {centre.imagePath && (
          <div className="relative h-64 md:h-80">
            <Image src={centre.imagePath} alt="" fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:p-10">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {centre.nameTh}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{name}</h1>
          {my && <p className="mt-1 text-sm text-slate-400">{centre.nameEn}</p>}

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">{summary}</p>

          {/* Hours (non-24h only) */}
          {hours && (
            <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4">
              <p className="text-sm font-semibold text-slate-700">
                {my ? "ဖွင့်ချိန်" : "Hours"}
              </p>
              <p className="mt-1 text-sm text-slate-600">{hours}</p>
            </div>
          )}

          {/* Published services */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900">
              {my ? "ဖော်ပြထားသော ဝန်ဆောင်မှုများ" : "Published services"}
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {services.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0b4f9c]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/contact?specialty=${centre.slug}`}
              className="rounded-full bg-[#0b4f9c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#083a73]"
            >
              {my ? "ဤဌာနအတွက် တောင်းဆိုမည်" : "Request this centre"}
            </Link>
            <Link
              href="/specialties"
              className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              {my ? "ဌာနများသို့ ပြန်သွားရန်" : "Back to centres"}
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-400">
            {my
              ? "ဤသည် ဆေးရုံ စာမျက်နှာတွင် ဖော်ပြထားသော အချက်အလက်သာ ဖြစ်သည်။ ဤပေါ်တယ်မှ ရောဂါမရှာပေး။"
              : "This information is published by the hospital. This portal does not diagnose or give medical advice."}
          </p>
        </div>
      </article>
    </PageContainer>
  );
}
