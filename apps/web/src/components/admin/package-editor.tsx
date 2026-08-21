"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

export function PackageEditor({
  id,
  code,
  nameEn,
  nameMy,
  gender,
  listPrice,
  salePrice,
  highlight,
  published,
  featuresEn,
  featuresMy,
}: {
  id: string;
  code: string;
  nameEn: string;
  nameMy: string;
  gender: string;
  listPrice: string;
  salePrice: string;
  highlight: string;
  published: boolean;
  featuresEn?: string[] | null;
  featuresMy?: string[] | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");
  const field = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";
  const en = Array.isArray(featuresEn) ? featuresEn : [];
  const my = Array.isArray(featuresMy) ? featuresMy : [];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setOk(false);
    const fd = new FormData(e.currentTarget);
    const res = await fetch(`/api/v1/admin/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nameEn: String(fd.get("nameEn") ?? ""),
        nameMy: String(fd.get("nameMy") ?? ""),
        gender: String(fd.get("gender") ?? "ANY"),
        listPrice: String(fd.get("listPrice") ?? ""),
        salePrice: String(fd.get("salePrice") ?? ""),
        highlight: String(fd.get("highlight") ?? ""),
        published: fd.get("published") === "on",
        featuresEn: String(fd.get("featuresEn") ?? ""),
        featuresMy: String(fd.get("featuresMy") ?? ""),
      }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setErr(typeof payload.error === "string" ? payload.error : "Could not save this package.");
      setBusy(false);
      return;
    }
    setOk(true);
    setBusy(false);
    router.push("/admin/packages");
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this package from the catalog?")) return;
    setBusy(true);
    const res = await fetch(`/api/v1/admin/packages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setErr("Could not delete this package.");
      setBusy(false);
      return;
    }
    router.push("/admin/packages");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs font-mono text-slate-400">{code}</p>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">Name (English)
          <input required name="nameEn" defaultValue={nameEn} className={field} />
        </label>
        <label className="text-sm font-medium">Name (Myanmar)
          <input required name="nameMy" defaultValue={nameMy} className={field} />
        </label>
        <label className="text-sm font-medium">List price (THB)
          <input required name="listPrice" defaultValue={listPrice} className={field} />
        </label>
        <label className="text-sm font-medium">Sale price (THB)
          <input required name="salePrice" defaultValue={salePrice} className={field} />
        </label>
        <label className="text-sm font-medium">Gender
          <select name="gender" defaultValue={gender} className={field}>
            <option value="ANY">Any</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
        </label>
        <label className="text-sm font-medium">Highlight badge
          <input name="highlight" defaultValue={highlight} placeholder="Most popular" className={field} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={published} className="h-4 w-4" />
        Visible on the public website
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">Included tests (English, one per line)
          <textarea name="featuresEn" rows={12} defaultValue={en.join("\n")} className={field} />
        </label>
        <label className="text-sm font-medium">Included tests (Myanmar, one per line)
          <textarea name="featuresMy" rows={12} defaultValue={my.join("\n")} className={field} />
        </label>
      </div>
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      {ok ? <p className="text-sm text-emerald-700">Saved.</p> : null}
      <div className="flex flex-wrap gap-3">
        <button disabled={busy} className="rounded-full bg-[#1a2330] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Saving…" : "Save package"}
        </button>
        <button type="button" onClick={() => router.push("/admin/packages")} className="rounded-full border border-slate-300 px-5 py-2 text-sm">
          Cancel
        </button>
        <button type="button" onClick={remove} disabled={busy} className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600">
          Delete
        </button>
      </div>
    </form>
  );
}
