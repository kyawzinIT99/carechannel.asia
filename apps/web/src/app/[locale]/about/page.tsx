import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { PageContainer } from "@/components/page-container";
import { ShwedagonMark } from "@/components/shwedagon-mark";
import { ABOUT_FACEBOOK_URL, ABOUT_FIELDS } from "@/catalog/about-copy";
import { loadPublicCopy } from "@/server/content/public";

export const dynamic = "force-dynamic";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const my = locale === "my";
  const copy = await loadPublicCopy(locale);
  const pick = (key: string, fallbackEn: string, fallbackMy: string) =>
    copy[key] || (locale === "my" ? fallbackMy : fallbackEn);

  const kicker = pick("about.kicker", ABOUT_FIELDS[0].fallbackEn, ABOUT_FIELDS[0].fallbackMy);
  const title = pick("about.title", ABOUT_FIELDS[1].fallbackEn, ABOUT_FIELDS[1].fallbackMy);
  const lead = pick("about.lead", ABOUT_FIELDS[2].fallbackEn, ABOUT_FIELDS[2].fallbackMy);
  const whoTitle = pick("about.whoTitle", ABOUT_FIELDS[3].fallbackEn, ABOUT_FIELDS[3].fallbackMy);
  const whoBody = pick("about.whoBody", ABOUT_FIELDS[4].fallbackEn, ABOUT_FIELDS[4].fallbackMy);
  const whyTitle = pick("about.whyTitle", ABOUT_FIELDS[5].fallbackEn, ABOUT_FIELDS[5].fallbackMy);
  const whyBody = pick("about.whyBody", ABOUT_FIELDS[6].fallbackEn, ABOUT_FIELDS[6].fallbackMy);
  const eventTitle = pick("about.eventTitle", ABOUT_FIELDS[7].fallbackEn, ABOUT_FIELDS[7].fallbackMy);
  const eventBody = pick("about.eventBody", ABOUT_FIELDS[8].fallbackEn, ABOUT_FIELDS[8].fallbackMy);

  return (
    <PageContainer>
      <p
        className={
          my
            ? "inline-flex items-center gap-2 text-base font-bold"
            : "inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.16em]"
        }
        style={{ color: "#D4AF37" }}
      >
        <ShwedagonMark />
        {kicker}
      </p>
      <h1 className="mt-4 max-w-2xl text-4xl font-semibold text-[#1a2330]">{title}</h1>
      <p className="mt-5 max-w-2xl text-[16px] leading-8 text-slate-700">{lead}</p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-bold text-[#1a2330]">{whoTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{whoBody}</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <h2 className="text-xl font-bold text-[#1a2330]">{whyTitle}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{whyBody}</p>
        </article>
      </div>

      <article className="mt-6 rounded-3xl bg-[#fbf8f1] p-6 ring-1 ring-[#d4af37]/30">
        <h2 className="text-xl font-bold text-[#1a2330]">{eventTitle}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{eventBody}</p>
        <a
          href={ABOUT_FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex text-sm font-semibold text-[#1a2330] hover:underline"
        >
          {my ? "Facebook ChiangmaiRam.myanmar တွင် ကြည့်ရန်" : "See the announcement on Facebook ChiangmaiRam.myanmar"} →
        </a>
      </article>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/contact"
          className="rounded-full bg-[#1a2330] px-7 py-3 text-sm font-semibold text-white hover:bg-[#111820]"
        >
          {my ? "ဤဝက်ဘ်ဆိုက်မှ တောင်းဆိုမည်" : "Inquire on this website"}
        </Link>
        <Link
          href="/packages"
          className="rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          {my ? "၂၀၂၆ ပက်ကေ့ချ်များ" : "See 2026 packages"}
        </Link>
      </div>
    </PageContainer>
  );
}
