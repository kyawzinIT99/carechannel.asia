"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";

export function MessengerOpen({
  locale,
  name,
  appUrl,
  httpUrl,
  number,
}: {
  locale: string;
  name: string;
  appUrl: string;
  httpUrl: string;
  number?: string;
}) {
  const my = locale === "my";

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = appUrl;
    }, 250);
    return () => window.clearTimeout(timer);
  }, [appUrl]);

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#d4af37]">
        {my ? "တရားဝင် မိတ်ဖက် စကားပြော" : "Official partner chat"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-[#1a2330]">
        {my ? `${name} ကို ဖွင့်နေသည်` : `Opening ${name}`}
      </h1>
      <p className="mt-4 text-[15px] leading-8 text-slate-600">
        {my
          ? "အက်ပ် မပွင့်ပါက အောက်ပါ ခလုတ်ကို နှိပ်ပါ။ ဖုန်းတွင် LINE ထည့်သွင်းထားရန် လိုသည်။"
          : "If the app does not open, tap the button below. LINE must be installed on the phone."}
      </p>
      {number ? (
        <p className="mt-2 text-sm font-semibold text-slate-800">{number}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a
          href={appUrl}
          className="rounded-full bg-[#1a2330] px-6 py-3 text-sm font-semibold text-white hover:bg-[#111820]"
        >
          {my ? `${name} အက်ပ် ဖွင့်ရန်` : `Open ${name} app`}
        </a>
        {httpUrl.startsWith("https://") ? (
          <a
            href={httpUrl}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {my ? "ဘရောက်ဇာတွင် ဖွင့်ရန်" : "Open in browser"}
          </a>
        ) : (
          <a
            href={httpUrl}
            className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            {my ? `${name} ထည့်ရန်` : `Add on ${name}`}
          </a>
        )}
      </div>
      <Link href="/contact" className="mt-8 inline-flex text-sm font-semibold text-[#0b4f9c] hover:underline">
        {my ? "ဝက်ဘ်ဆိုက်မှ တောင်းဆိုမည်" : "Or send a website request"} →
      </Link>
    </div>
  );
}
