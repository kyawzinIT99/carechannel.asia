"use client";

import { useState } from "react";

type Template = {
  id: string;
  key: string;
  locale: string;
  subject: string;
  body: string;
};

export function TemplateEditor({ template }: { template: Template }) {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  const field = "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";

  async function save() {
    setBusy(true);
    setSaved(false);
    setErr("");
    const res = await fetch(`/api/v1/admin/templates/${encodeURIComponent(template.key)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: template.locale, subject, body }),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else setErr("Save failed.");
    setBusy(false);
  }

  return (
    <div className="space-y-3 p-5">
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-500">
          {template.locale}
        </span>
        <span className="text-xs text-slate-400">
          Variables: {"{{name}}"}, {"{{email}}"}, {"{{email}}"} — replaced automatically
        </span>
      </div>
      <label className="block text-sm font-medium">
        Subject
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className={`mt-1 ${field}`} />
      </label>
      <label className="block text-sm font-medium">
        Body
        <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} className={`mt-1 ${field}`} />
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={busy}
          className="rounded-full bg-[#0b4f9c] px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save"}
        </button>
        {saved && <span className="text-sm text-emerald-600">Saved — active for the next inquiry</span>}
        {err && <span className="text-sm text-red-600">{err}</span>}
      </div>
      <p className="text-xs text-slate-400">
        n8n inquiry-alert handles actual delivery (Gmail + Telegram). This body is rendered and forwarded via the webhook.
      </p>
    </div>
  );
}
