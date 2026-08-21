"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Promo = { id: string; titleEn: string };

const InquirySelectContext = createContext<{
  selected: string[];
  toggle: (id: string) => void;
} | null>(null);

export function useInquirySelect() {
  return useContext(InquirySelectContext);
}

export function InquirySelectBox({ id, hasEmail }: { id: string; hasEmail: boolean }) {
  const ctx = useInquirySelect();
  if (!ctx) return null;
  return (
    <input
      type="checkbox"
      checked={ctx.selected.includes(id)}
      disabled={!hasEmail}
      title={hasEmail ? "Select for promotion mail" : "No email on this inquiry"}
      onChange={() => ctx.toggle(id)}
      className="mt-1"
    />
  );
}

export function InquiryReportBoard({
  status,
  promotions,
  visitorIds,
  children,
}: {
  status?: string;
  promotions: Promo[];
  visitorIds: { id: string; hasEmail: boolean }[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const [selected, setSelected] = useState<string[]>([]);
  const [promotionId, setPromotionId] = useState(promotions[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const query = status === "NEW" ? "?status=NEW" : "";
  const withEmail = useMemo(() => visitorIds.filter((row) => row.hasEmail).map((row) => row.id), [visitorIds]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id]));
  }

  async function sendPromo() {
    if (!selected.length || !promotionId) {
      setNote("Select visitors and a published promotion.");
      return;
    }
    setBusy(true);
    setNote("");
    const response = await fetch("/api/v1/admin/inquiries/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inquiryIds: selected, promotionId }),
    });
    const data = (await response.json()) as {
      sent?: number;
      skipped?: number;
      failed?: number;
      noEmail?: number;
      error?: string;
    };
    setBusy(false);
    if (!response.ok) {
      setNote(
        data.error === "promotion_not_published"
          ? "Publish the promotion first."
          : data.error === "smtp_not_configured" || data.skipped
            ? "Could not send. Check SMTP in .env."
            : "Could not send.",
      );
      return;
    }
    setNote(
      `Sent ${data.sent ?? 0} via n8n (or SMTP fallback). Skipped ${data.skipped ?? 0}. Failed ${data.failed ?? 0}. No email ${data.noEmail ?? 0}. See Outbox.`,
    );
  }

  return (
    <InquirySelectContext.Provider value={{ selected, toggle }}>
      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-sm font-semibold text-slate-800">Visitor report & promotion follow-up</p>
        <p className="text-xs text-slate-500">
          Fetch and edit public promotions under{" "}
          <a href={`/${locale}/admin/promotions`} className="font-semibold text-[#0b4f9c] underline">
            Admin → Public promotions
          </a>
          . Tick Published so they show on the website. Pressing Send here does not publish — it tells n8n Inquiry Alert to mail the selected visitors (same Gmail automation as the inquiry reply). Staff get a copy in Gmail. Check Outbox after send.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`/api/v1/admin/inquiries/export${query}`}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Download Excel (CSV)
          </a>
          <a
            href={`/${locale}/admin/inquiries/print${query}`}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Print / PDF report
          </a>
          <a
            href={`/${locale}/admin/inquiries/passports${query}`}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Passport list
          </a>
          <button
            type="button"
            onClick={() => setSelected(withEmail)}
            className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Select all with email
          </button>
          <button type="button" onClick={() => setSelected([])} className="rounded-full px-3 py-1.5 text-xs text-slate-500">
            Clear
          </button>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-slate-600">
            Published promotion
            <select
              value={promotionId}
              onChange={(e) => setPromotionId(e.target.value)}
              className="mt-1 block rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
            >
              {promotions.length === 0 ? <option value="">None published</option> : null}
              {promotions.map((promo) => (
                <option key={promo.id} value={promo.id}>
                  {promo.titleEn}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={busy || !promotions.length}
            onClick={sendPromo}
            className="rounded-full bg-[#0b4f9c] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Sending…" : `Send to ${selected.length} selected`}
          </button>
        </div>
        {note ? <p className="text-xs text-slate-600">{note}</p> : null}
      </div>
      {children}
    </InquirySelectContext.Provider>
  );
}
