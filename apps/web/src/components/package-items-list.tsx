"use client";

import { useState } from "react";

type Item = { en: string; my: string };

export function PackageItemsList({
  items,
  locale,
  label,
}: {
  items: readonly Item[];
  locale: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const my = locale === "my";
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-semibold text-sky-300 hover:text-white"
      >
        <span className="text-lg leading-none">{open ? "−" : "+"}</span>
        {open
          ? my ? "ပိတ်မည်" : "Hide"
          : label}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-sky-100">
              <span className="mt-0.5 text-sky-400">✓</span>
              <span>{my ? item.my : item.en}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PackageItemsListLight({
  items,
  locale,
  label,
}: {
  items: readonly Item[];
  locale: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const my = locale === "my";
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <span className="text-lg leading-none">{open ? "−" : "+"}</span>
        {open
          ? my ? "ပိတ်မည်" : "Hide"
          : label}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
              <span className="mt-0.5 text-emerald-500">✓</span>
              <span>{my ? item.my : item.en}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
