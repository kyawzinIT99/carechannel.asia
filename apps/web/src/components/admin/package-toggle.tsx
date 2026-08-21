"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PackageToggle({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [on, setOn] = useState(published);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    const next = !on;
    setOn(next);
    const res = await fetch(`/api/v1/admin/packages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    if (!res.ok) setOn(!next);
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={on ? "Hide package" : "Show package"}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${on ? "bg-[#1a2330]" : "bg-slate-300"}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : "translate-x-1"}`} />
    </button>
  );
}
