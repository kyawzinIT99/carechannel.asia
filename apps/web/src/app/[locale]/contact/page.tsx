import { getTranslations, setRequestLocale } from "next-intl/server";
import { InquiryForm } from "@/components/inquiry-form";
import { ContactChannels } from "@/components/contact-channels";
import { SPECIALTIES } from "@/catalog/hospital-source";
import {
  loadPublicBranches,
  loadPublicChrome,
  loadPublicPackages,
  loadPublicSpecialtyTree,
} from "@/server/content/public";

export const dynamic = "force-dynamic";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ specialty?: string; package?: string }>;
}) {
  const { locale } = await params;
  const { specialty, package: pkg } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const my = locale === "my";
  const [branches, packages, tree, chrome] = await Promise.all([
    loadPublicBranches(),
    loadPublicPackages(),
    loadPublicSpecialtyTree(),
    loadPublicChrome(),
  ]);

  const steps = my
    ? [
        ["1", "တောင်းဆိုမှု ပို့ပါ"],
        ["2", "ညှိနှိုင်းရေးမှူး ဆက်သွယ်မည်"],
        ["3", "ခရီးစဉ် အတည်ပြုမည်"],
      ]
    : [
        ["1", "Send this request"],
        ["2", "Coordinator replies"],
        ["3", "Visit is confirmed"],
      ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <header className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {my ? "ချင်းမိုင်ရမ်ဆေးရုံ · မိတ်ဖက်လမ်းကြောင်း" : "Chiangmai Ram Hospital · partner channel"}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1a2330] md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-7 text-slate-600">{t("intro")}</p>
        <ol className="mt-6 flex flex-wrap gap-2">
          {steps.map(([n, label]) => (
            <li
              key={n}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1a2330] text-[10px] font-bold text-white">
                {n}
              </span>
              {label}
            </li>
          ))}
        </ol>
      </header>

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <InquiryForm
          preselectedSlug={specialty}
          preselectedPkg={pkg}
          packages={packages}
          specialties={(tree.length ? tree : SPECIALTIES) as typeof SPECIALTIES}
        />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {my ? "ဆေးရုံ တစ်ရုံ" : "One hospital"}
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1a2330]">
                {my ? "နယ်မြေ နှစ်ခု၊ ချင်းမိုင်" : "Two campuses in Chiang Mai"}
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {branches.map((site) => (
                <div key={site.code} className="px-5 py-4">
                  <p className="text-[11px] font-medium text-slate-400">
                    {site.status === "open"
                      ? (my ? "ပင်မနယ်မြေ" : "Main campus")
                      : (my ? "နယ်မြေအသစ်" : "Additional campus")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {my ? site.nameMy : site.nameEn}
                  </p>
                  <p className="mt-1.5 text-xs leading-6 text-slate-500">
                    {my ? site.detailMy : site.detailEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 ring-1 ring-slate-200/80">
            <p className="text-sm font-semibold text-[#1a2330]">
              {my ? "စာပို့ရန်" : "Message us"}
            </p>
            <div className="mt-2">
              <ContactChannels locale={locale} variant="stack" />
            </div>
          </div>
          <div className="rounded-2xl bg-[#f7f1e4] px-5 py-4 ring-1 ring-[#e8dcc0]">
            <p className="text-sm font-semibold text-[#1a2330]">Google Form</p>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              {my
                ? "လာရောက်ရန် တောင်းဆိုမှုကို ပြင်ဆင်ထားသော Google Form မှလည်း ပို့နိုင်ပါသည်။"
                : "You can also send your visit request through the revised Google Form."}
            </p>
            <a
              href={chrome.googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820]"
            >
              {my ? "Google Form ဖွင့်ရန်" : "Open Google Form"}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
