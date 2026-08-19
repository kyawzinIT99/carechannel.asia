"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

type Row = { key: string; label: string; valueEn: string; valueMy: string; multiline?: boolean };

export function HomeContentForm({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const payload = rows.map((row) => ({
      key: row.key,
      valueEn: String(fd.get(`${row.key}.en`) ?? ""),
      valueMy: String(fd.get(`${row.key}.my`) ?? ""),
    }));
    const res = await fetch("/api/v1/admin/site-content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: payload }),
    });
    setBusy(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setErr(typeof payload.error === "string" ? payload.error : "Could not save homepage copy.");
      return;
    }
    setOk(true);
    router.refresh();
  }

  const field = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {rows.map((row) => (
        <div key={row.key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-bold text-slate-800">{row.label}</p>
          <p className="mb-3 font-mono text-[11px] text-slate-400">{row.key}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-600">
              English
              {row.multiline ? (
                <textarea name={`${row.key}.en`} rows={4} defaultValue={row.valueEn} className={field} />
              ) : (
                <input name={`${row.key}.en`} defaultValue={row.valueEn} className={field} />
              )}
            </label>
            <label className="text-sm font-medium text-slate-600">
              Myanmar
              {row.multiline ? (
                <textarea name={`${row.key}.my`} rows={4} defaultValue={row.valueMy} className={field} />
              ) : (
                <input name={`${row.key}.my`} defaultValue={row.valueMy} className={field} />
              )}
            </label>
          </div>
        </div>
      ))}
      <button
        disabled={busy}
        className="rounded-full bg-[#0b4f9c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#083a73] disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save homepage copy"}
      </button>
      {ok && <p className="text-sm font-semibold text-emerald-700">Saved. The public homepage now shows this copy.</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
