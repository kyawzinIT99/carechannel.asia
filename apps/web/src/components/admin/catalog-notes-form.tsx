"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CatalogNotesForm({
  id,
  notesEn,
  notesMy,
}: {
  id: string;
  notesEn: string;
  notesMy: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const field = "mt-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    await fetch(`/api/v1/admin/package-catalogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notesEn: fd.get("notesEn"),
        notesMy: fd.get("notesMy"),
      }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
      <label className="text-xs font-semibold">Public notes EN
        <textarea name="notesEn" rows={3} defaultValue={notesEn} className={field} />
      </label>
      <label className="text-xs font-semibold">Public notes MY
        <textarea name="notesMy" rows={3} defaultValue={notesMy} className={field} />
      </label>
      <button disabled={busy} className="md:col-span-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold">
        {busy ? "Saving…" : "Save catalog notes"}
      </button>
    </form>
  );
}
