"use client";

import { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { PageContainer } from "@/components/page-container";

export default function RegisterPage() {
  const t = useTranslations("register");
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const my = locale === "my";

  const field = "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0b4f9c] focus:outline-none";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.get("name"), email: form.get("email"), phone: form.get("phone"), password: form.get("password"), locale }),
    });
    if (!res.ok) { setError(true); setBusy(false); return; }
    router.push("/account");
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0b4f9c]">
            {my ? "လူနာပေါ်တယ်" : "Patient portal"}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {my ? "လူနာအကောင့် ဖန်တီးရန်" : "Create a patient account"}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              {t("name")}
              <input required name="name" className={field} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("email")}
              <input required name="email" type="email" className={field} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("phone")}
              <input name="phone" className={field} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("password")}
              <input required name="password" type="password" minLength={8} className={field} />
            </label>
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t("error")}</p>}
            <button type="submit" disabled={busy} className="w-full rounded-full bg-[#0b4f9c] py-2.5 text-sm font-bold text-white hover:bg-[#083a73] disabled:opacity-50">
              {busy ? "…" : t("submit")}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-500">
            <Link href="/login" className="font-semibold text-[#0b4f9c] hover:underline">{t("login")}</Link>
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
