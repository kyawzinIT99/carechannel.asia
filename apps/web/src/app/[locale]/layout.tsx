import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteChrome } from "@/components/site-chrome";
import { PartnerChromeProvider } from "@/components/partner-chrome";
import { loadPublicChrome } from "@/server/content/public";

export const dynamicParams = true;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const chrome = await loadPublicChrome();

  return (
    <NextIntlClientProvider messages={messages}>
      <PartnerChromeProvider value={chrome}>
        <SiteChrome>{children}</SiteChrome>
      </PartnerChromeProvider>
    </NextIntlClientProvider>
  );
}
