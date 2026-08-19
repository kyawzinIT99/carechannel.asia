"use client";

import { useState, useTransition } from "react";

export function PackageHighlightEditor({
  id,
  current,
}: {
  id: string;
  current: string;
}) {
  const [value, setValue] = useState(current);
  const [saved, setSaved] = useState(false);
  const [pending, start] = useTransition();

  async function save() {
    start(async () => {
      await fetch(`/api/v1/admin/packages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ highlight: value }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); setSaved(false); }}
        onKeyDown={(e) => e.key === "Enter" && save()}
        placeholder="e.g. Most popular"
        className="w-44 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-200"
      />
      <button
        onClick={save}
        disabled={pending}
        className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50"
      >
        {saved ? "✓" : "Save"}
      </button>
    </div>
  );
}
