"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PromotionActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/v1/admin/promotions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
    setBusy(false);
  }

  async function remove() {
    if (!confirm("Delete this promotion?")) return;
    setBusy(true);
    await fetch(`/api/v1/admin/promotions/${id}`, { method: "DELETE" });
    router.refresh();
    setBusy(false);
  }

  return (
    <>
      <button
        onClick={toggle}
        disabled={busy}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        Delete
      </button>
    </>
  );
}
