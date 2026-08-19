"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserActions({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/v1/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-lg px-3 py-1 text-xs font-semibold disabled:opacity-50 ${
        isActive
          ? "border border-red-200 text-red-600 hover:bg-red-50"
          : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
      }`}
    >
      {isActive ? "Disable" : "Enable"}
    </button>
  );
}
