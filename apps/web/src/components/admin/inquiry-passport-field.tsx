"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function InquiryPassportField({
  id,
  passportNo,
}: {
  id: string;
  passportNo: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(passportNo || "");
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    await fetch(`/api/v1/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passportNo: value }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <form onSubmit={save} className="flex min-w-[9rem] flex-col gap-1">
      {passportNo ? (
        <p className="font-mono text-sm font-semibold tracking-wide text-[#1a2330]">{passportNo}</p>
      ) : (
        <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">Missing</p>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        placeholder="Passport no."
        className="w-36 rounded-lg border border-slate-200 px-2 py-1 font-mono text-xs uppercase tracking-wide"
      />
      <button
        type="submit"
        disabled={busy}
        className="w-fit text-[11px] font-semibold text-[#0b4f9c] disabled:opacity-50"
      >
        {busy ? "Saving…" : passportNo ? "Update" : "Save"}
      </button>
    </form>
  );
}
