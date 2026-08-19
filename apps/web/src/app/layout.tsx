import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Noto_Sans, Noto_Sans_Myanmar } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-noto-sans",
});

const notoMyanmar = Noto_Sans_Myanmar({
  subsets: ["myanmar"],
  weight: ["400", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Myanmar Text", "Pyidaungsu", "Padauk", "sans-serif"],
  variable: "--font-noto-myanmar",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f4f7fb",
};

export const metadata: Metadata = {
  title: "Chiangmai Ram Hospital Myanmar | ချင်းမိုင်ရမ်ဆေးရုံ",
  description:
    "Official Myanmar portal for Chiangmai Ram Hospital. Contact, specialty centres, and published 2026 check-up packages.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${notoSans.variable} ${notoMyanmar.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
