"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { PageContainer } from "@/components/page-container";

export default function StaffLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [error, setError] = useState<"invalid" | "patient" | null>(null);
  const [busy, setBusy] = useState(false);
  const my = locale === "my";

  const field = "mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-[#0b4f9c] focus:outline-none";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
        portal: "staff",
      }),
    });
    if (res.status === 403) {
      setError("patient");
      setBusy(false);
      return;
    }
    if (!res.ok) {
      setError("invalid");
      setBusy(false);
      return;
    }
    const data = (await res.json()) as { destination?: string };
    router.push(data.destination === "admin" ? "/admin" : "/staff");
  }

  return (
    <PageContainer>
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {my ? "အတွင်းပိုင်း" : "Internal"}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {my ? "ဝန်ထမ်း ဝင်ရောက်ရန်" : "Staff sign in"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {my
              ? "ညှိနှိုင်းရေးမှူးနှင့် အက်ဒမင်အတွက်သာ။ လူနာများ ဤနေရာမှ မဝင်ပါ။"
              : "For coordinators and hospital admin only. Patients do not sign in here."}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input required name="email" type="email" className={field} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input required name="password" type="password" className={field} />
            </label>
            {error === "invalid" && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                Sign-in was not accepted.
              </p>
            )}
            {error === "patient" && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {my
                  ? "ဤအကောင့်သည် လူနာအကောင့်ဖြစ်သည်။ လူနာဝင်ရောက်ရန် စာမျက်နှာကို သုံးပါ။"
                  : "This is a patient account. Use the patient sign-in page instead."}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {busy ? "…" : my ? "ဝန်ထမ်း ဝင်မည်" : "Staff sign in"}
            </button>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
