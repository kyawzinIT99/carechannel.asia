"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { VISIT_SITES } from "@/catalog/hospital-source";
import { googleMapsEmbedSrc, googleMapsSearchHref } from "@/server/security/urls";
import { ContactChannels } from "@/components/contact-channels";
import { usePartnerChrome } from "@/components/partner-chrome";

export function SiteChrome({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const hospital = usePartnerChrome();
  const pathname = usePathname();
  const other = locale === "en" ? "my" : "en";
  const [open, setOpen] = useState(false);

  const isInternal =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/staff" ||
    pathname.startsWith("/staff/");

  const menuLinks = [
    { href: "/",            label: locale === "my" ? "မူလစာမျက်နှာ"      : "Home" },
    { href: "/about",       label: locale === "my" ? "အကြောင်း"           : "About" },
    { href: "/specialties", label: locale === "my" ? "ဌာနများ"             : "Specialty centres" },
    { href: "/packages",    label: locale === "my" ? "ပက်ကေ့ချ်များ"       : "Packages" },
    { href: "/visit",       label: locale === "my" ? "လေဆိပ်ကားနှင့် နေထိုင်ရန်" : "Pickup & stay" },
    { href: "/contact",     label: locale === "my" ? "ဆက်သွယ်ရန်"          : "Request a visit" },
  ];

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (isInternal) {
    return <div className="min-h-screen bg-[#f4f1ea]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f9]">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">

          {/* Logo + wordmark */}
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <Image
              src={hospital.logoPath}
              alt="Chiangmai Ram Hospital"
              width={180} height={40}
              className="h-8 w-auto shrink-0"
              priority
            />
            <span className="hidden sm:block">
              <span className="block text-sm font-bold leading-5 text-[#1a2330]">
                {locale === "my" ? hospital.nameMy : hospital.nameEn}
              </span>
              <span className="block text-xs leading-4 text-slate-400">
                {hospital.legalNameTh}
              </span>
            </span>
          </Link>

          {/* Right: primary CTA + lang + burger */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Primary CTA — visible on md+ */}
            <Link
              href="/contact"
              className="hidden rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820] md:block"
            >
              {locale === "my" ? "ဆက်သွယ်ရန်" : "Request a visit"}
            </Link>

            {/* Language toggle */}
            <Link
              href={pathname}
              locale={other}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              {locale === "en" ? "မြန်မာ" : "EN"}
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              aria-label={open ? t("nav.close") : t("nav.menu")}
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              {open
                ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              }
            </button>
          </div>
        </div>

        {/* Dropdown menu */}
        {open && (
          <nav className="absolute inset-x-0 top-16 z-50 border-t border-slate-100 bg-white shadow-lg">
            <div className="mx-auto max-w-6xl px-4 py-3">
              {menuLinks.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center border-b border-slate-50 py-3 text-[15px]",
                    pathname === item.href
                      ? "font-bold text-[#1a2330]"
                      : "text-slate-700 hover:text-[#1a2330]",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Pages control their own max-width and padding */}
      <main className="min-h-[60vh]">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <Image
                src={hospital.logoPath}
                alt="Chiangmai Ram Hospital"
                width={140} height={30}
                className="h-7 w-auto"
              />
              <p className="mt-3 text-sm font-semibold text-[#1a2330]">
                {locale === "my" ? hospital.nameMy : hospital.nameEn}
              </p>
              <p className="text-xs text-slate-400">{hospital.legalNameTh}</p>
              <Link href="/about" className="mt-2 inline-flex text-sm font-semibold text-[#1a2330] hover:underline">
                {locale === "my" ? "အကြောင်း" : "About"} →
              </Link>
            </div>

            <div className="text-sm leading-7 text-slate-600">
              <p className="font-semibold text-slate-800">
                {locale === "my" ? "လိပ်စာ" : "Address"}
              </p>
              <p>{locale === "my" ? hospital.addressMy : hospital.addressEn}</p>
              <p className="mt-3 font-semibold text-slate-800">
                {locale === "my" ? "ဆက်သွယ်ရန်" : "Contact"}
              </p>
              <ContactChannels locale={locale} variant="footer" />
            </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800">
                {locale === "my" ? "မြေပုံ" : "Map"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {locale === "my" ? "ပင်မနယ်မြေ — စရီဖူမ်၊ ချင်းမိုင်" : "Main campus — Sripoom, Chiang Mai"}
              </p>
              <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <iframe
                  title={locale === "my" ? "ချင်းမိုင်ရမ်ဆေးရုံ မြေပုံ" : "Chiangmai Ram Hospital map"}
                  src={googleMapsEmbedSrc(VISIT_SITES[0].mapQuery, locale === "my" ? "my" : "en")}
                  className="h-[220px] w-full border-0 md:h-[260px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={googleMapsSearchHref(VISIT_SITES[0].mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-[#1a2330] hover:underline"
              >
                {locale === "my" ? "Google Maps တွင် ဖွင့်ရန်" : "Open in Google Maps"} →
              </a>
            </div>
          </div>

          <p className="mt-8 border-t border-slate-100 pt-5 text-xs text-slate-400">
            {t("footer.legal")}
          </p>
        </div>
      </footer>
    </div>
  );
}
