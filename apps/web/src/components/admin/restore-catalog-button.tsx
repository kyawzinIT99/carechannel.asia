"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RestoreCatalogButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function restore() {
    if (!confirm("Publish all five 2026 check-up packages on the public website with hospital list prices?")) return;
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/v1/admin/packages/restore", { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      setMsg("Could not restore packages.");
      return;
    }
    const data = (await res.json()) as { count?: number };
    setMsg(`Live: ${data.count ?? 5} packages on the public site.`);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={restore}
        disabled={busy}
        className="rounded-full border border-[#c4a35a]/40 bg-[#fbf8f1] px-4 py-2 text-sm font-semibold text-[#1a2330] hover:bg-[#f3ead4] disabled:opacity-50"
      >
        {busy ? "Restoring…" : "Restore 2026 packages"}
      </button>
      {msg ? <p className="text-xs font-medium text-emerald-800">{msg}</p> : null}
    </div>
  );
}
