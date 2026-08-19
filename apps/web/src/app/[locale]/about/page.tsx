import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ShwedagonMark } from "@/components/shwedagon-mark";
import { ABOUT_FACEBOOK_URL, ABOUT_FIELDS, aboutField } from "@/catalog/about-copy";
import { loadPublicChrome, loadPublicCopy } from "@/server/content/public";

export const dynamic = "force-dynamic";

function paragraphs(text: string) {
  return text.split(/\n+/).map((row) => row.trim()).filter(Boolean);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const my = locale === "my";
  const [copy, chrome] = await Promise.all([loadPublicCopy(locale), loadPublicChrome()]);
  const pick = (key: (typeof ABOUT_FIELDS)[number]["key"]) => {
    const field = aboutField(key);
    return copy[key] || (locale === "my" ? field.fallbackMy : field.fallbackEn);
  };

  const kicker = pick("about.kicker");
  const title = pick("about.title");
  const highlight = pick("about.highlight");
  const lead = pick("about.lead");
  const steps = [
    { n: "၁", en: "1", title: my ? "ဖတ်ရှုပါ" : "Read", body: pick("about.how1") },
    { n: "၂", en: "2", title: my ? "တောင်းဆိုပါ" : "Ask", body: pick("about.how2") },
    { n: "၃", en: "3", title: my ? "ညှိနှိုင်းပါ" : "Talk", body: pick("about.how3") },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#e8dcc0] bg-[linear-gradient(165deg,#f7f1e4_0%,#f3eee4_42%,#eef3f8_100%)]">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#d4af37]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#0b4f9c]/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
          <p
            className={
              my
                ? "inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-base font-bold ring-1 ring-[#d4af37]/35"
                : "inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[0.16em] ring-1 ring-[#d4af37]/35"
            }
            style={{ color: "#B8860B" }}
          >
            <ShwedagonMark />
            {kicker}
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.2] text-[#1a2330] md:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg font-medium leading-9 text-[#3f5c48]">{highlight}</p>
          <div className="mt-5 max-w-3xl space-y-4 text-[16px] leading-9 text-slate-700">
            {paragraphs(lead).map((row) => (
              <p key={row}>{row}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-[#1a2330] px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(26,35,48,0.18)] hover:bg-[#111820]"
            >
              {my ? "ဤဝက်ဘ်ဆိုက်မှ တောင်းဆိုမည်" : "Inquire on this website"}
            </Link>
            <a
              href={chrome.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#d4af37]/50 bg-white/80 px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white"
            >
              {my ? "ရိုးရှင်းသော ဖောင်" : "Simple form"}
            </a>
            <Link
              href="/packages"
              className="rounded-full border border-[#d4af37]/50 bg-white/80 px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white"
            >
              {my ? "၂၀၂၆ ပက်ကေ့ချ်များ" : "See 2026 packages"}
            </Link>
            <Link
              href="/connect/line"
              className="rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white"
            >
              LINE
            </Link>
            <Link
              href="/connect/telegram"
              className="rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white"
            >
              Telegram
            </Link>
            <Link
              href="/connect/viber"
              className="rounded-full border border-slate-300 bg-white/80 px-7 py-3 text-sm font-semibold text-[#1a2330] hover:bg-white"
            >
              Viber
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { title: pick("about.whoTitle"), body: pick("about.whoBody") },
            { title: pick("about.focusTitle"), body: pick("about.focusBody") },
            { title: pick("about.whyTitle"), body: pick("about.whyBody") },
          ].map((card) => (
            <article
              key={card.title}
              className="relative overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_18px_40px_rgba(26,35,48,0.06)] ring-1 ring-slate-100"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#d4af37,#0b4f9c)]" />
              <h2 className="text-xl font-bold leading-8 text-[#1a2330]">{card.title}</h2>
              <div className="mt-4 space-y-3 text-[15px] leading-8 text-slate-600">
                {paragraphs(card.body).map((row) => (
                  <p key={row}>{row}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#d4af37]">
            {my ? "အဆင့်သုံးဆင့်" : "Three steps"}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#1a2330]">{pick("about.howTitle")}</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.en}
                className="rounded-[28px] bg-[#f7f1e4] p-6 ring-1 ring-[#e8dcc0]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a2330] text-sm font-bold text-[#f3d56a]">
                  {my ? step.n : step.en}
                </span>
                <p className="mt-4 text-lg font-bold text-[#1a2330]">{step.title}</p>
                <p className="mt-2 text-[15px] leading-8 text-slate-700">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <article className="relative mt-12 overflow-hidden rounded-[32px] bg-[#1a2330] px-7 py-10 text-white md:px-12">
          <div className="pointer-events-none absolute -right-8 top-4 opacity-20">
            <ShwedagonMark className="h-28 w-20" />
          </div>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#f3d56a]">
            {my ? "အများပြည်သူ ကြေညာချက်" : "Public announcement"}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-snug">{pick("about.eventTitle")}</h2>
          <div className="mt-4 max-w-3xl space-y-3 text-[15px] leading-8 text-white/85">
            {paragraphs(pick("about.eventBody")).map((row) => (
              <p key={row}>{row}</p>
            ))}
          </div>
          <a
            href={ABOUT_FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-[#d4af37] px-5 py-2.5 text-sm font-semibold text-[#1a2330] hover:bg-[#e8c547]"
          >
            {my ? "Facebook · ChiangmaiRam.myanmar" : "Facebook · ChiangmaiRam.myanmar"} →
          </a>
        </article>

        <aside className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold text-[#1a2330]">{pick("about.noteTitle")}</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-8 text-slate-600">{pick("about.noteBody")}</p>
        </aside>
      </section>
    </>
  );
}
