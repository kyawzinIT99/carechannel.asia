"use client";

import { Link } from "@/i18n/routing";
import { usePartnerChrome } from "@/components/partner-chrome";

type Variant = "footer" | "stack" | "pills";

export function ContactChannels({
  locale,
  variant = "pills",
  showWebsite = true,
}: {
  locale: string;
  variant?: Variant;
  showWebsite?: boolean;
}) {
  const my = locale === "my";
  const chrome = usePartnerChrome();

  const linkClass =
    variant === "footer"
      ? "text-[#1a2330] hover:underline"
      : "inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-[#1a2330] hover:bg-slate-50";

  const website = showWebsite ? (
    <Link href="/contact" className={linkClass}>
      {my ? "ဝက်ဘ်ဆိုက် တောင်းဆိုမှု" : "This website"}
    </Link>
  ) : null;

  const messengers = [
    { key: "line", label: "LINE", href: "/connect/line" as const },
    { key: "telegram", label: "Telegram", href: "/connect/telegram" as const },
    { key: "viber", label: "Viber", href: "/connect/viber" as const },
  ].map((ch) => (
    <Link key={ch.key} href={ch.href} className={linkClass}>
      {ch.label}
    </Link>
  ));

  const note =
    my
      ? `တရားဝင် incentive ခရီးစဉ် — ဤဝက်ဘ်ဆိုက်၊ LINE (${chrome.linePhone})၊ Telegram သို့မဟုတ် Viber (${chrome.viberDisplay}) မှသာ ဆက်သွယ်ပါ။`
      : `Official incentive visit — contact us only on this website, LINE (${chrome.linePhone}), Telegram, or Viber (${chrome.viberDisplay}).`;

  if (variant === "footer") {
    return (
      <div className="space-y-1">
        <p>{note}</p>
        <p className="flex flex-wrap gap-x-3 gap-y-1">
          {website}
          {messengers}
        </p>
      </div>
    );
  }

  return (
    <div className={variant === "stack" ? "space-y-3" : ""}>
      <p className="text-xs leading-6 text-slate-500">{note}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {website}
        {messengers}
      </div>
    </div>
  );
}
