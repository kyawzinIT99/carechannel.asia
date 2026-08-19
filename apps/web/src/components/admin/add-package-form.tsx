"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddPackageForm({ catalogId }: { catalogId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const field = "mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await fetch("/api/v1/admin/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catalogId,
        code: fd.get("code"),
        nameEn: fd.get("nameEn"),
        nameMy: fd.get("nameMy"),
        gender: fd.get("gender"),
        listPrice: fd.get("listPrice"),
        salePrice: fd.get("salePrice"),
        featuresEn: String(fd.get("featuresEn") ?? ""),
        featuresMy: String(fd.get("featuresMy") ?? ""),
      }),
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setErr(typeof payload.error === "string" ? payload.error : "Could not add package.");
      setBusy(false);
      return;
    }
    form.reset();
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-dashed border-slate-200 p-4 md:grid-cols-2">
      <p className="md:col-span-2 text-xs font-bold uppercase tracking-widest text-slate-400">Add a package to this catalog</p>
      <label className="text-xs font-semibold">Code<input required name="code" placeholder="STANDARD_ANY" className={field} /></label>
      <label className="text-xs font-semibold">Gender
        <select name="gender" defaultValue="ANY" className={field}>
          <option value="ANY">Any</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      </label>
      <label className="text-xs font-semibold">Name EN<input required name="nameEn" className={field} /></label>
      <label className="text-xs font-semibold">Name MY<input required name="nameMy" className={field} /></label>
      <label className="text-xs font-semibold">List price<input required name="listPrice" placeholder="4265" className={field} /></label>
      <label className="text-xs font-semibold">Sale price<input required name="salePrice" placeholder="3300" className={field} /></label>
      <label className="text-xs font-semibold">Tests EN (one per line)
        <textarea name="featuresEn" rows={4} className={field} />
      </label>
      <label className="text-xs font-semibold">Tests MY (one per line)
        <textarea name="featuresMy" rows={4} className={field} />
      </label>
      {err ? <p className="md:col-span-2 text-xs text-red-600">{err}</p> : null}
      <button disabled={busy} className="md:col-span-2 rounded-lg bg-[#0b4f9c] px-3 py-2 text-xs font-bold text-white">
        {busy ? "Adding…" : "Add package"}
      </button>
    </form>
  );
}
