"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RestoreFlyersButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function restore() {
    if (!confirm("Publish the hospital 2026 package flyers on the public homepage and packages page?")) return;
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/v1/admin/promotions/restore-flyers", { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      setMsg("Could not restore flyers. Run the latest database migration, then try again.");
      return;
    }
    const data = (await res.json()) as { count?: number };
    setMsg(`Live: ${data.count ?? 0} flyers on the public site.`);
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
        {busy ? "Publishing…" : "Publish hospital flyers"}
      </button>
      {msg ? <p className="text-xs font-medium text-emerald-800">{msg}</p> : null}
    </div>
  );
}
