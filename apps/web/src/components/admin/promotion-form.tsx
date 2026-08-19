"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

type Initial = {
  id?: string;
  titleEn: string;
  titleMy: string;
  bodyEn: string;
  bodyMy: string;
  sortOrder: number;
  published: boolean;
};

export function PromotionForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const body = {
      titleEn: String(fd.get("titleEn") ?? ""),
      titleMy: String(fd.get("titleMy") ?? ""),
      bodyEn: String(fd.get("bodyEn") ?? ""),
      bodyMy: String(fd.get("bodyMy") ?? ""),
      sortOrder: Number(fd.get("sortOrder") ?? 100),
      published: fd.get("published") === "on",
    };
    const url = initial?.id
      ? `/api/v1/admin/promotions/${initial.id}`
      : "/api/v1/admin/promotions";
    const method = initial?.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setErr("Could not save. Please check all fields and try again.");
      setBusy(false);
      return;
    }
    router.push("/admin/promotions");
    router.refresh();
  }

  const field = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Title (English)
          <input required name="titleEn" defaultValue={initial?.titleEn ?? ""} className={field} />
        </label>
        <label className="block text-sm font-medium">
          Title (Myanmar)
          <input required name="titleMy" defaultValue={initial?.titleMy ?? ""} className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Body (English)
        <textarea required name="bodyEn" rows={5} defaultValue={initial?.bodyEn ?? ""} className={field} />
      </label>
      <label className="block text-sm font-medium">
        Body (Myanmar)
        <textarea required name="bodyMy" rows={5} defaultValue={initial?.bodyMy ?? ""} className={field} />
      </label>
      <div className="flex items-center gap-6">
        <label className="block text-sm font-medium">
          Sort order
          <input type="number" name="sortOrder" defaultValue={initial?.sortOrder ?? 100} className={`${field} w-24`} />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked={initial?.published ?? false} className="h-4 w-4" />
          Publish immediately
        </label>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-[#0b4f9c] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save promotion"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
