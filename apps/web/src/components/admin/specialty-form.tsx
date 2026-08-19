"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Initial = {
  id?: string;
  nameEn: string;
  nameMy: string;
  nameTh?: string;
  summaryEn: string;
  summaryMy: string;
  servicesEn: string;
  servicesMy: string;
  imagePath?: string;
  hoursEn?: string;
  hoursMy?: string;
  sortOrder: number;
  published: boolean;
  slug?: string;
};

export function SpecialtyForm({ initial }: { initial?: Initial }) {
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
      slug: String(fd.get("slug") ?? ""),
      nameEn: String(fd.get("nameEn") ?? ""),
      nameMy: String(fd.get("nameMy") ?? ""),
      nameTh: String(fd.get("nameTh") ?? ""),
      summaryEn: String(fd.get("summaryEn") ?? ""),
      summaryMy: String(fd.get("summaryMy") ?? ""),
      servicesEn: String(fd.get("servicesEn") ?? ""),
      servicesMy: String(fd.get("servicesMy") ?? ""),
      imagePath: String(fd.get("imagePath") ?? ""),
      hoursEn: String(fd.get("hoursEn") ?? ""),
      hoursMy: String(fd.get("hoursMy") ?? ""),
      sortOrder: Number(fd.get("sortOrder") ?? 100),
      published: fd.get("published") === "on",
    };
    const res = await fetch(initial?.id ? `/api/v1/admin/specialties/${initial.id}` : "/api/v1/admin/specialties", {
      method: initial?.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      setErr("Could not save specialty.");
      return;
    }
    router.push("/admin/specialties");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4 rounded-2xl bg-white p-6 shadow-sm">
      {!initial?.id && (
        <label className="block text-sm font-medium">
          URL slug
          <input required name="slug" placeholder="cardiac-balloon-center" className={field} />
        </label>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Name (EN)<input required name="nameEn" defaultValue={initial?.nameEn} className={field} /></label>
        <label className="text-sm font-medium">Name (MY)<input required name="nameMy" defaultValue={initial?.nameMy} className={field} /></label>
      </div>
      <label className="text-sm font-medium">Thai reference name<input name="nameTh" defaultValue={initial?.nameTh} className={field} /></label>
      <label className="block text-sm font-medium">Summary (EN)<textarea required name="summaryEn" rows={4} defaultValue={initial?.summaryEn} className={field} /></label>
      <label className="block text-sm font-medium">Summary (MY)<textarea required name="summaryMy" rows={4} defaultValue={initial?.summaryMy} className={field} /></label>
      <label className="block text-sm font-medium">Services EN (one per line)<textarea name="servicesEn" rows={6} defaultValue={initial?.servicesEn} className={field} /></label>
      <label className="block text-sm font-medium">Services MY (one per line)<textarea name="servicesMy" rows={6} defaultValue={initial?.servicesMy} className={field} /></label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium">Image path<input name="imagePath" defaultValue={initial?.imagePath} placeholder="/photos/cardiac.jpg" className={field} /></label>
        <label className="text-sm font-medium">Sort<input type="number" name="sortOrder" defaultValue={initial?.sortOrder ?? 100} className={field} /></label>
      </div>
      <label className="flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" name="published" defaultChecked={initial?.published ?? true} /> Show on public website
      </label>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button disabled={busy} className="rounded-full bg-[#0b4f9c] px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
        {busy ? "Saving…" : "Save specialty"}
      </button>
    </form>
  );
}
