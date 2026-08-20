"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { COUNTRIES } from "@/catalog/countries";
import {
  CHECKUP_PACKAGES_2026,
  INTERPRETER_LANGUAGES,
  PKG_GROUPS_STANDARD,
  PKG_GROUPS_ADVANCE_SHARED,
  PKG_GROUPS_ADVANCE_MALE,
  PKG_GROUPS_ADVANCE_FEMALE,
  PKG_INCLUDED_ALL,
  PKG_PREMIUM_NOTE,
  SPECIALTIES,
  flattenSpecialties,
  type PkgGroup,
} from "@/catalog/hospital-source";

type PackageDetail = {
  groups: { group: PkgGroup; isNew: boolean }[];
  includedItems: string[];
  premiumNote: string | null;
  totalTests: number;
};

/** Returns categorised groups per package code. isNew=true marks groups added vs STANDARD. */
function buildPackageDetail(code: string, my: boolean): PackageDetail {
  const label = (g: PkgGroup) => ({ group: g, isNew: false });
  const added = (g: PkgGroup) => ({ group: g, isNew: true });
  const included = PKG_INCLUDED_ALL.map((i) => (my ? i.my : i.en));

  if (code === "STANDARD_ANY") {
    const groups = PKG_GROUPS_STANDARD.map(label);
    return {
      groups,
      includedItems: included,
      premiumNote: null,
      totalTests: PKG_GROUPS_STANDARD.reduce((n, g) => n + g.items.length, 0),
    };
  }

  const isMale = code === "ADVANCE_MALE" || code === "PREMIUM_MALE";
  const isPremium = code.startsWith("PREMIUM");
  const genderGroups = isMale ? PKG_GROUPS_ADVANCE_MALE : PKG_GROUPS_ADVANCE_FEMALE;

  const groups = [
    ...PKG_GROUPS_STANDARD.map(label),
    ...PKG_GROUPS_ADVANCE_SHARED.map(added),
    ...genderGroups.map(added),
  ];

  const totalTests = groups.reduce((n, g) => n + g.group.items.length, 0);

  return {
    groups,
    includedItems: included,
    premiumNote: isPremium ? (my ? PKG_PREMIUM_NOTE.my : PKG_PREMIUM_NOTE.en) : null,
    totalTests,
  };
}

export function InquiryForm({
  preselectedSlug,
  preselectedPkg,
  packages = CHECKUP_PACKAGES_2026.map((p) => ({ ...p, featuresEn: [] as string[], featuresMy: [] as string[] })),
  specialties = SPECIALTIES,
}: {
  preselectedSlug?: string;
  preselectedPkg?: string;
  packages?: {
    code: string;
    nameEn: string;
    nameMy: string;
    listPrice: string;
    salePrice: string;
    featuresEn: string[];
    featuresMy: string[];
  }[];
  specialties?: typeof SPECIALTIES;
}) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const my = locale === "my";
  const [status, setStatus] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [selectedSlug, setSelectedSlug] = useState(preselectedSlug ?? "");
  const [selectedPkg, setSelectedPkg] = useState(preselectedPkg ?? "");
  const [needInterpreter, setNeedInterpreter] = useState(false);
  const [needPickup, setNeedPickup] = useState(false);
  const [needStay, setNeedStay] = useState(false);
  const [needVisa, setNeedVisa] = useState(false);
  const [pkgExpanded, setPkgExpanded] = useState(false);
  const [returning, setReturning] = useState<"yes" | "no" | "">("");

  const allCentres = flattenSpecialties(specialties as typeof SPECIALTIES);
  const selectedCentre = allCentres.find((c) => c.slug === selectedSlug);
  const selectedPackage = packages.find((p) => p.code === selectedPkg);
  const pkgDetail = selectedPkg ? buildPackageDetail(selectedPkg, my) : null;
  const liveFeatures = selectedPackage ? (my ? selectedPackage.featuresMy : selectedPackage.featuresEn) : [];
  const useLiveFeatures = liveFeatures.length > 0;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("busy");
    const form = new FormData(event.currentTarget);
    const payload = {
      locale,
      fullName: String(form.get("fullName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      country: String(form.get("country") ?? ""),
      returningPatient: String(form.get("returningPatient") ?? "") === "yes",
      message: String(form.get("message") ?? ""),
      specialtySlug: selectedPkg ? undefined : (selectedSlug || undefined),
      packageCode: selectedPkg || undefined,
      preferredDate: String(form.get("preferredDate") ?? "") || undefined,
      interpreterNeeded: needInterpreter,
      interpreterLang: String(form.get("interpreterLang") ?? "") || undefined,
      airportPickup: needPickup,
      accommodationHelp: needStay,
      visaHelp: needVisa,
      consent: true,
    };
    const res = await fetch("/api/v1/public/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setStatus(res.ok ? "ok" : "err");
  }

  const inputCls =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/80";
  const labelCls = "block text-[13px] font-medium text-slate-600";
  const sectionCls = "space-y-4 px-5 py-6 sm:px-7";
  const stepHeadCls = "flex items-center gap-2.5 text-[13px] font-semibold text-[#1a2330]";
  const stepNumCls =
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2330] text-[11px] font-bold text-white";
  const optionCls = (on: boolean) =>
    `w-full text-left rounded-xl border px-4 py-3 transition ${
      on ? "border-[#1a2330] bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300"
    }`;

  if (status === "ok") {
    return (
      <div className="rounded-2xl bg-white px-8 py-14 text-center ring-1 ring-slate-200/80">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-700">✓</div>
        <p className="mt-4 text-lg font-semibold text-[#1a2330]">{t("success")}</p>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          {my
            ? "ညှိနှိုင်းရေးမှူးသည် အီးမေးလ် သို့မဟုတ် Telegram ဖြင့် မကြာမီ ဆက်သွယ်ပါမည်"
            : "A coordinator will follow up by email and Telegram shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80">

      <section className={sectionCls}>
        <p className={stepHeadCls}>
          <span className={stepNumCls}>1</span>
          {my ? "သင့်အချက်အလက်" : "Your details"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {t("name")} *
            <input required name="fullName" autoComplete="name" className={inputCls} />
          </label>
          <label className={labelCls}>
            {t("phone")} *
            <input required name="phone" type="tel" autoComplete="tel" className={inputCls} />
          </label>
          <label className={labelCls}>
            {t("email")}
            <input name="email" type="email" autoComplete="email" className={inputCls} />
          </label>
          <label className={labelCls}>
            {t("country")} *
            <select required name="country" defaultValue="" className={inputCls}>
              <option value="" disabled>
                {my ? "နိုင်ငံ ရွေးပါ" : "Select country"}
              </option>
              {COUNTRIES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <fieldset>
          <legend className={labelCls}>{t("returningPatient")} *</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["no", "yes"] as const).map((value) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-sm ${
                  returning === value ? "border-[#1a2330] bg-slate-50 font-medium text-[#1a2330]" : "border-slate-200 text-slate-600"
                }`}
              >
                <input
                  required
                  type="radio"
                  name="returningPatient"
                  value={value}
                  className="sr-only"
                  onChange={() => setReturning(value)}
                />
                {value === "yes" ? t("returningYes") : t("returningNo")}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className={`${sectionCls} border-t border-slate-100`}>
        <p className={stepHeadCls}>
          <span className={stepNumCls}>2</span>
          {my ? "မိတ်ဖက် ပက်ကေ့ချ်" : "Partner package"}
          <span className="font-normal text-slate-400">{my ? "(ရွေးချယ်နိုင်)" : "(optional)"}</span>
        </p>
        <p className="text-xs leading-6 text-slate-500">
          {my
            ? "ပက်ကေ့ချ် မရွေးပါက ဌာနစာရင်း နောက်မှ ပေါ်မည်။"
            : "Skip the package if you want a specialty centre instead."}
        </p>
        <div className="space-y-2">
          <button type="button" onClick={() => { setSelectedPkg(""); setPkgExpanded(false); }} className={optionCls(!selectedPkg)}>
            <p className="text-sm font-medium text-slate-800">{my ? "အခြား စစ်ဆေးမှု / ဌာန" : "Other checkup / specialty"}</p>
            <p className="mt-0.5 text-xs text-slate-500">{my ? "ဌာနစာရင်းမှ ရွေးမည်" : "Choose from the specialty list next"}</p>
          </button>
          {packages.map((pkg) => {
            const isSelected = selectedPkg === pkg.code;
            const saving = Number(pkg.listPrice) - Number(pkg.salePrice);
            const savePct = Math.round((saving / Number(pkg.listPrice)) * 100);
            return (
              <button
                key={pkg.code}
                type="button"
                onClick={() => { setSelectedPkg(isSelected ? "" : pkg.code); setPkgExpanded(true); if (!isSelected) setSelectedSlug(""); }}
                className={optionCls(isSelected)}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-800">{my ? pkg.nameMy : pkg.nameEn}</p>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-[#1a2330]">
                      {Number(pkg.salePrice).toLocaleString()} <span className="text-[11px] font-medium text-slate-500">THB</span>
                    </p>
                    <p className="text-[11px] text-slate-400 line-through">{Number(pkg.listPrice).toLocaleString()}</p>
                    <p className="text-[11px] text-slate-500">{my ? `${savePct}% သက်သာ` : `Save ${savePct}%`}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <input type="hidden" name="packageCode" value={selectedPkg} />

        {selectedPackage && (useLiveFeatures || pkgDetail) && (
          <div key={selectedPkg} className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                {useLiveFeatures ? liveFeatures.length : pkgDetail?.totalTests}{" "}
                {my ? "စစ်ဆေးမှု ပါဝင်သည်" : "tests included"}
              </p>
              <button type="button" onClick={() => setPkgExpanded((v) => !v)} className="text-xs font-semibold text-[#1a2330] hover:underline">
                {pkgExpanded ? (my ? "ပိတ်မည်" : "Hide tests") : (my ? "စစ်ဆေးမှုများ" : "View tests")}
              </button>
            </div>
            {pkgExpanded && useLiveFeatures && (
              <ul className="mt-3 space-y-1">
                {liveFeatures.map((item, i) => (
                  <li key={i} className="text-xs leading-6 text-slate-600">· {item}</li>
                ))}
              </ul>
            )}
            {pkgExpanded && !useLiveFeatures && pkgDetail && (
              <div className="mt-3 space-y-3">
                {pkgDetail.groups.map(({ group }) => (
                  <div key={group.key}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {my ? group.labelMy : group.labelEn}
                    </p>
                    <ul className="mt-1">
                      {group.items.map((item, i) => (
                        <li key={i} className="text-xs leading-6 text-slate-600">· {my ? item.my : item.en}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {!selectedPkg && (
        <section className={`${sectionCls} border-t border-slate-100`}>
          <p className={stepHeadCls}>
            <span className={stepNumCls}>3</span>
            {my ? "ဌာနစာရင်း" : "Specialty list"}
            <span className="font-normal text-slate-400">{my ? "(ရွေးချယ်နိုင်)" : "(optional)"}</span>
          </p>
          <p className="text-xs leading-6 text-slate-500">
            {my ? "ဤစာရင်းကို ပေါ်တယ်ဌာနများမှ ယူထားသည်။" : "Same centres as on this portal."}
          </p>
          <button type="button" onClick={() => setSelectedSlug("")} className={optionCls(!selectedSlug)}>
            <p className="text-sm text-slate-700">{my ? "ဌာန မရွေးပါ" : "No specialty"}</p>
          </button>
          <div className="grid gap-2 sm:grid-cols-2">
            {specialties.map((c) => {
              const kids = c.children ?? [];
              return (
                <div key={c.slug} className={kids.length ? "sm:col-span-2 space-y-2" : ""}>
                  <button
                    type="button"
                    onClick={() => setSelectedSlug(selectedSlug === c.slug ? "" : c.slug)}
                    className={optionCls(selectedSlug === c.slug)}
                  >
                    <p className="text-sm font-medium text-slate-800">{my ? c.nameMy : c.nameEn}</p>
                    {c.nameTh ? <p className="mt-0.5 text-[11px] text-slate-400">{c.nameTh}</p> : null}
                  </button>
                  {kids.length > 0 && (
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {kids.map((child) => (
                        <button
                          key={child.slug}
                          type="button"
                          onClick={() => setSelectedSlug(selectedSlug === child.slug ? "" : child.slug)}
                          className={optionCls(selectedSlug === child.slug)}
                        >
                          <p className="text-sm text-slate-700">{my ? child.nameMy : child.nameEn}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <input type="hidden" name="specialtySlug" value={selectedSlug} />
          {selectedCentre && (
            <p className="text-xs leading-6 text-slate-500">
              {my ? selectedCentre.summaryMy : selectedCentre.summaryEn}
            </p>
          )}
        </section>
      )}

      <section className={`${sectionCls} border-t border-slate-100`}>
        <p className={stepHeadCls}>
          <span className={stepNumCls}>{selectedPkg ? "3" : "4"}</span>
          {my ? "လေဆိပ်ကား၊ နေထိုင်ရန်နှင့် ဗီဇာ" : "Pickup, stay, and visa"}
          <span className="font-normal text-slate-400">{my ? "(ရွေးချယ်နိုင်)" : "(optional)"}</span>
        </p>
        <p className="text-xs leading-6 text-slate-500">
          {my ? "ပက်ကေ့ချ်တွင် မပါဝင်ပါ။ လိုမှသာ ရွေးပါ။" : "Not a checkup package. Choose only if you want help."}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <label className={`flex cursor-pointer items-start gap-3 ${optionCls(needPickup)}`}>
            <input type="checkbox" checked={needPickup} onChange={(e) => setNeedPickup(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1a2330]" />
            <span>
              <span className="block text-sm font-medium text-slate-800">{my ? "လေဆိပ်ကား" : "Airport pickup"}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{my ? "လေဆိပ်မှ ဆေးရုံ သို့မဟုတ် နေထိုင်ရာ" : "Airport to hospital or stay"}</span>
            </span>
          </label>
          <label className={`flex cursor-pointer items-start gap-3 ${optionCls(needStay)}`}>
            <input type="checkbox" checked={needStay} onChange={(e) => setNeedStay(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1a2330]" />
            <span>
              <span className="block text-sm font-medium text-slate-800">{my ? "အငှားတိုက်ခန်း အကူအညီ" : "Rental apartment help"}</span>
              <span className="mt-0.5 block text-xs text-slate-500">{my ? "ဟိုတယ်ပက်ကေ့ချ် မဟုတ် — လိုမှသာ၊ ၃,၅၀၀ သို့မဟုတ် ၄,၀၀၀ ဘတ်" : "Not a hotel package — only if you want, typically 3,500 or 4,000 THB"}</span>
            </span>
          </label>
          <label className={`flex cursor-pointer items-start gap-3 sm:col-span-2 ${optionCls(needVisa)}`}>
            <input type="checkbox" checked={needVisa} onChange={(e) => setNeedVisa(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1a2330]" />
            <span>
              <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                {my ? "ကြာရှည် ဗီဇာ အကူအညီ" : "Long-stay visa help"}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {my
                  ? "ဧည့်သည် လိုမှသာ။ ဤဝက်ဘ်ဆိုက် သို့မဟုတ် LINE / Telegram / Viber မှ တောင်းပါ။"
                  : "Only if the visitor wants it. Ask on this website or LINE / Telegram / Viber."}
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className={`${sectionCls} border-t border-slate-100`}>
        <p className={stepHeadCls}>
          <span className={stepNumCls}>{selectedPkg ? "4" : "5"}</span>
          {my ? "ရက်စွဲနှင့် ဘာသာပြန်" : "Date and interpreter"}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={labelCls}>
            {t("date")}
            <input name="preferredDate" type="date" className={inputCls} />
          </label>
          <div className="flex flex-col justify-end">
            <label className={`flex cursor-pointer items-center gap-3 ${optionCls(needInterpreter)}`}>
              <input type="checkbox" checked={needInterpreter} onChange={(e) => setNeedInterpreter(e.target.checked)} className="h-4 w-4 accent-[#1a2330]" />
              <span className="text-sm text-slate-700">{t("interpreter")}</span>
            </label>
          </div>
        </div>
        {needInterpreter && (
          <label className={labelCls}>
            {t("lang")}
            <select name="interpreterLang" className={inputCls}>
              <option value=""></option>
              {INTERPRETER_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </label>
        )}
      </section>

      <section className={`${sectionCls} border-t border-slate-100`}>
        <p className={stepHeadCls}>
          <span className={stepNumCls}>{selectedPkg ? "5" : "6"}</span>
          {my ? "မက်ဆေ့ဂျ်" : "Your message"}
        </p>
        <label className={labelCls}>
          {t("message")} *
          <textarea
            required
            name="message"
            rows={4}
            className={`${inputCls} min-h-[108px] resize-y`}
            placeholder={
              my
                ? "လိုချင်သည့် ခရီးစဉ်ကို ရေးပါ"
                : "Write the visit you want. A package is not required."
            }
          />
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
          <input required type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[#1a2330]" />
          <span>{t("consent")}</span>
        </label>
        <button
          type="submit"
          disabled={status === "busy"}
          className="w-full rounded-full bg-[#1a2330] py-3.5 text-sm font-semibold text-white hover:bg-[#111820] disabled:opacity-50"
        >
          {status === "busy" ? (my ? "ပေးပို့နေသည်…" : "Sending…") : t("submit")}
        </button>
        {status === "err" && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t("error")}</p>
        )}
      </section>
    </form>
  );
}
