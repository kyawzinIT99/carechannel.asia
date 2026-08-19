"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

const EMPTY_PKG = { code: "", nameEn: "", nameMy: "", gender: "ANY", listPrice: "", salePrice: "" };

export function PackageCatalogForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [pkgs, setPkgs] = useState([{ ...EMPTY_PKG }]);

  const field = "w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";

  function addPkg() {
    setPkgs((prev) => [...prev, { ...EMPTY_PKG }]);
  }
  function removePkg(i: number) {
    setPkgs((prev) => prev.filter((_, idx) => idx !== i));
  }
  function updatePkg(i: number, key: string, value: string) {
    setPkgs((prev) => prev.map((p, idx) => idx === i ? { ...p, [key]: value } : p));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const fd = new FormData(e.currentTarget);
    const body = {
      code: String(fd.get("code")),
      nameEn: String(fd.get("nameEn")),
      nameMy: String(fd.get("nameMy")),
      sourceUrl: String(fd.get("sourceUrl")),
      notesEn: String(fd.get("notesEn")),
      notesMy: String(fd.get("notesMy")),
      validFrom: String(fd.get("validFrom")),
      validTo: String(fd.get("validTo")),
      packages: pkgs,
    };
    const res = await fetch("/api/v1/admin/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) { setErr("Could not save. Check all fields."); setBusy(false); return; }
    router.push("/admin/packages");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium">
          Catalog code <input required name="code" placeholder="CHECKUP-2026" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Source URL <input name="sourceUrl" placeholder="https://chiangmairam.com/..." className={field} />
        </label>
        <label className="block text-sm font-medium">
          Name (EN) <input required name="nameEn" placeholder="2026 Health Check Packages" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Name (MY) <input required name="nameMy" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Valid from <input required type="date" name="validFrom" className={field} />
        </label>
        <label className="block text-sm font-medium">
          Valid to <input required type="date" name="validTo" className={field} />
        </label>
      </div>
      <label className="block text-sm font-medium">
        Notes (EN) <textarea name="notesEn" rows={3} className={field} />
      </label>
      <label className="block text-sm font-medium">
        Notes (MY) <textarea name="notesMy" rows={3} className={field} />
      </label>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-medium">Packages</p>
          <button type="button" onClick={addPkg} className="text-sm text-[#0b4f9c] hover:underline">+ Add row</button>
        </div>
        {pkgs.map((pkg, i) => (
          <div key={i} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-6">
            <input placeholder="Code" value={pkg.code} onChange={(e) => updatePkg(i, "code", e.target.value)} className={`${field} md:col-span-1`} />
            <input placeholder="Name EN" value={pkg.nameEn} onChange={(e) => updatePkg(i, "nameEn", e.target.value)} className={`${field} md:col-span-2`} />
            <input placeholder="Name MY" value={pkg.nameMy} onChange={(e) => updatePkg(i, "nameMy", e.target.value)} className={`${field} md:col-span-2`} />
            <select value={pkg.gender} onChange={(e) => updatePkg(i, "gender", e.target.value)} className={`${field} md:col-span-1`}>
              <option value="ANY">Any</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <input placeholder="List price" value={pkg.listPrice} onChange={(e) => updatePkg(i, "listPrice", e.target.value)} className={`${field} md:col-span-2`} />
            <input placeholder="Sale price" value={pkg.salePrice} onChange={(e) => updatePkg(i, "salePrice", e.target.value)} className={`${field} md:col-span-2`} />
            <button type="button" onClick={() => removePkg(i)} className="text-xs text-red-500 hover:underline md:col-span-2">Remove</button>
          </div>
        ))}
      </div>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="rounded-full bg-[#0b4f9c] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Saving…" : "Save catalog"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700">
          Cancel
        </button>
      </div>
    </form>
  );
}
