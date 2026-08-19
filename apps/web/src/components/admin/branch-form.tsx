"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

export function BranchForm({
  initial,
}: {
  initial?: {
    id?: string;
    code?: string;
    nameEn: string;
    nameMy: string;
    detailEn: string;
    detailMy: string;
    mapQuery: string;
    status: string;
    sortOrder: number;
    published: boolean;
  };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const field = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const body = {
      code: String(fd.get("code") ?? ""),
      nameEn: String(fd.get("nameEn") ?? ""),
      nameMy: String(fd.get("nameMy") ?? ""),
      detailEn: String(fd.get("detailEn") ?? ""),
      detailMy: String(fd.get("detailMy") ?? ""),
      mapQuery: String(fd.get("mapQuery") ?? ""),
      status: String(fd.get("status") ?? "open"),
      sortOrder: Number(fd.get("sortOrder") ?? 100),
      published: fd.get("published") === "on",
    };
    const res = await fetch(initial?.id ? `/api/v1/admin/branches/${initial.id}` : "/api/v1/admin/branches", {
      method: initial?.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setErr(typeof payload.error === "string" ? payload.error : "Could not save branch.");
      setBusy(false);
      return;
    }
    router.push("/admin/branches");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {!initial?.id && (
        <label className="block text-sm font-medium">Code<input required name="code" placeholder="SRIPOOM" className={field} /></label>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Name EN<input required name="nameEn" defaultValue={initial?.nameEn} className={field} /></label>
        <label className="text-sm font-medium">Name MY<input required name="nameMy" defaultValue={initial?.nameMy} className={field} /></label>
      </div>
      <label className="block text-sm font-medium">Address / detail EN<textarea required name="detailEn" rows={3} defaultValue={initial?.detailEn} className={field} /></label>
      <label className="block text-sm font-medium">Address / detail MY<textarea required name="detailMy" rows={3} defaultValue={initial?.detailMy} className={field} /></label>
      <label className="block text-sm font-medium">Google Maps query<input name="mapQuery" defaultValue={initial?.mapQuery} className={field} /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">
          Status
          <select name="status" defaultValue={initial?.status ?? "open"} className={field}>
            <option value="open">Open</option>
            <option value="opening_soon">Opening soon</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Sort order
          <input type="number" name="sortOrder" defaultValue={initial?.sortOrder ?? 100} className={field} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} /> Show on public website
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex gap-3">
        <button disabled={busy} className="rounded-full bg-[#0b4f9c] px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : "Save branch"}</button>
        <button type="button" onClick={() => router.push("/admin/branches")} className="rounded-full border border-slate-300 px-5 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}
