import { Link } from "@/i18n/routing";
import { VISIT_ASSIST } from "@/catalog/hospital-source";
import { loadPublicChrome } from "@/server/content/public";
import { listSiteContent } from "@/server/db/site-content";

async function copy(key: string, locale: string, fallbackEn: string, fallbackMy: string) {
  try {
    const rows = await listSiteContent();
    const row = rows.find((r) => r.key === key);
    if (!row) return locale === "my" ? fallbackMy : fallbackEn;
    return locale === "my" ? row.valueMy : row.valueEn;
  } catch {
    return locale === "my" ? fallbackMy : fallbackEn;
  }
}

export async function VisitAssistSection({
  locale,
  compact = false,
}: {
  locale: string;
  compact?: boolean;
}) {
  const my = locale === "my";
  const pickup = VISIT_ASSIST[0];
  const stay = VISIT_ASSIST[1];
  const visa = VISIT_ASSIST[2];
  const chrome = await loadPublicChrome();
  const apartmentUrl = chrome.apartmentUrl || stay.apartmentUrl;
  const [pickupTitle, pickupBody, stayTitle, stayBody, visaTitle, visaBody] = await Promise.all([
    copy("visit.pickupTitle", locale, pickup.titleEn, pickup.titleMy),
    copy("visit.pickupBody", locale, pickup.bodyEn, pickup.bodyMy),
    copy("visit.stayTitle", locale, stay.titleEn, stay.titleMy),
    copy("visit.stayBody", locale, stay.bodyEn, stay.bodyMy),
    copy("visit.visaTitle", locale, visa.titleEn, visa.titleMy),
    copy("visit.visaBody", locale, visa.bodyEn, visa.bodyMy),
  ]);

  const cards = [
    { code: pickup.code, kind: my ? "သယ်ယူပို့ဆောင်ရေး" : "Transport", title: pickupTitle, body: pickupBody },
    { code: stay.code, kind: my ? "နေထိုင်ရန်" : "Stay", title: stayTitle, body: stayBody },
    { code: visa.code, kind: my ? "ဗီဇာ" : "Visa", title: visaTitle, body: visaBody },
  ];

  return (
    <section className={compact ? "" : "py-4"}>
      <div className={compact ? "" : "mx-auto max-w-6xl"}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {my ? "ခရီးစဉ် အကူအညီ" : "Visit support"}
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[#1a2330] md:text-3xl">
          {my ? "လေဆိပ်ကား၊ နေထိုင်ရန်နှင့် ဗီဇာ" : "Pickup, stay, and optional visa help"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
          {my
            ? "ဤအကူအညီများသည် စစ်ဆေးပက်ကေ့ချ်တွင် မပါဝင်ပါ။ ဗီဇာကို ဧည့်သည် လိုမှသာ ကြေညာပါသည်။ ဤဝက်ဘ်ဆိုက် သို့မဟုတ် LINE မှ တောင်းပါ။"
            : "This is optional help only — not part of a checkup package. Visa help is announced only if the visitor wants it, via this website or LINE."}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((item) => (
            <article key={item.code} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
                {item.kind}
              </p>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              {item.code === stay.code && apartmentUrl ? (
                <a
                  href={apartmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-[#1a2330] hover:underline"
                >
                  {my ? "အငှားတိုက်ခန်း ဝက်ဘ်ဆိုက်" : "Open the rental apartment site"} →
                </a>
              ) : null}
            </article>
          ))}
        </div>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-full bg-[#1a2330] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#111820]"
        >
          {my ? "လိုပါက ကြိုဆိုကား / နေထိုင်ရန် / ဗီဇာ ပြောမည်" : "Ask for pickup, a stay, or visa help if you want"}
        </Link>
      </div>
    </section>
  );
}
