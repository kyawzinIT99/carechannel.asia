import { PrintButton } from "@/components/admin/print-button";
import { listInquiryReports } from "@/server/inquiries/report";

export const dynamic = "force-dynamic";

export default async function InquiryPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const rows = await listInquiryReports(status === "NEW" ? "NEW" : undefined);
  const stamp = new Date().toISOString().slice(0, 16).replace("T", " ");

  return (
    <div className="print-report space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold">Visitor inquiry report</h1>
          <p className="text-sm text-slate-500">Use Print → Save as PDF. Excel download is on the inquiries list.</p>
        </div>
        <PrintButton />
      </div>

      <header className="hidden border-b border-slate-300 pb-3 print:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c4a35a]">Chiangmai Ram Hospital Myanmar</p>
        <h1 className="text-xl font-bold">Visitor inquiry report</h1>
        <p className="text-xs text-slate-500">Generated {stamp} · {rows.length} visitors</p>
      </header>

      <table className="min-w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-slate-300 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3">Date</th>
            <th className="py-2 pr-3">Visitor</th>
            <th className="py-2 pr-3">Phone</th>
            <th className="py-2 pr-3">Email</th>
            <th className="py-2 pr-3">Interest</th>
            <th className="py-2 pr-3">Status</th>
            <th className="py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100 align-top">
              <td className="whitespace-nowrap py-2 pr-3 text-slate-500">{row.createdAt.slice(0, 16).replace("T", " ")}</td>
              <td className="py-2 pr-3">
                <p className="font-semibold">{row.fullName}</p>
                <p className="text-[11px] text-slate-500">
                  {row.locale}
                  {row.country ? ` · ${row.country}` : ""}
                  {row.returningPatient === "yes" ? " · returning" : ""}
                </p>
              </td>
              <td className="py-2 pr-3">{row.phone}</td>
              <td className="py-2 pr-3">{row.email || "—"}</td>
              <td className="py-2 pr-3">
                {row.packageName || row.specialty || "—"}
                {row.airportPickup === "yes" ? " · pickup" : ""}
                {row.accommodationHelp === "yes" ? " · apartment" : ""}
              </td>
              <td className="py-2 pr-3">{row.status}</td>
              <td className="max-w-xs py-2">{row.message.slice(0, 180)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
