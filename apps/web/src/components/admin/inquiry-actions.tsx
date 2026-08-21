"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Coordinator = { id: string; name: string };

export function InquiryActions({
  id,
  status,
  coordinators,
}: {
  id: string;
  status: string;
  coordinators: Coordinator[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function patch(data: Record<string, unknown>) {
    setBusy(true);
    await fetch(`/api/v1/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {status !== "CONTACTED" && (
        <button
          disabled={busy}
          onClick={() => patch({ status: "CONTACTED" })}
          className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
        >
          Mark contacted
        </button>
      )}
      {status !== "CLOSED" && (
        <button
          disabled={busy}
          onClick={() => patch({ status: "CLOSED" })}
          className="rounded-lg bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
        >
          Close
        </button>
      )}
      <select
        disabled={busy}
        defaultValue=""
        onChange={(e) => { if (e.target.value) patch({ assignedToId: e.target.value }); }}
        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 focus:outline-none"
      >
        <option value="" disabled>Assign to…</option>
        {coordinators.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <button
        disabled={busy}
        onClick={async () => {
          if (!window.confirm("Delete this inquiry? This cannot be undone.")) return;
          setBusy(true);
          await fetch(`/api/v1/admin/inquiries/${id}`, { method: "DELETE" });
          router.refresh();
          setBusy(false);
        }}
        className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
