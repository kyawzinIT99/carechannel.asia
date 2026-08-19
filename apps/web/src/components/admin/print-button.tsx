"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-[#0b4f9c] px-4 py-2 text-sm font-semibold text-white print:hidden"
    >
      Print / Save PDF
    </button>
  );
}
