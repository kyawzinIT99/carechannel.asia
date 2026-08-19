"use client";

import { useLocale, useTranslations } from "next-intl";
import { VISIT_SITES } from "@/catalog/hospital-source";

export function GoogleMapsBanner() {
  const locale = useLocale();
  const t = useTranslations("home");
  const hl = locale === "my" ? "my" : "en";

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <p className="mb-3 text-center text-sm font-semibold text-[#0b4f9c]">{t("mapsTitle")}</p>
        <div className="grid overflow-hidden rounded-2xl border border-slate-200 md:grid-cols-2">
          {VISIT_SITES.map((site) => (
            <div key={site.code} className="min-h-[240px] md:min-h-[320px]">
              <div className="flex items-center justify-between gap-2 bg-[#0b4f9c] px-3 py-2 text-xs text-white md:text-sm">
                <span>{locale === "my" ? site.nameMy : site.nameEn}</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5">
                  {site.status === "opening_soon" ? t("openingSoon") : t("openNow")}
                </span>
              </div>
              <iframe
                title={locale === "my" ? site.nameMy : site.nameEn}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&hl=${hl}&z=16&output=embed`}
                className="h-[220px] w-full border-0 md:h-[280px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
