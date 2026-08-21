import { PrintButton } from "@/components/admin/print-button";
import { listInquiryReports } from "@/server/inquiries/report";

export const dynamic = "force-dynamic";

export default async function InquiryPassportListPage({
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
          <h1 className="text-2xl font-bold">Passport list</h1>
          <p className="text-sm text-slate-500">
            Incentive visitors from the website or app. Print or save as PDF for hospital registration.
          </p>
        </div>
        <PrintButton />
      </div>

      <header className="hidden border-b border-slate-300 pb-3 print:block">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c4a35a]">Chiangmai Ram Hospital Myanmar</p>
        <h1 className="text-xl font-bold">Passport list</h1>
        <p className="text-xs text-slate-500">Generated {stamp} · {rows.length} visitors</p>
      </header>

      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3">Code</th>
            <th className="py-2 pr-3">Visitor</th>
            <th className="py-2 pr-3">Country</th>
            <th className="py-2 pr-3">Passport</th>
            <th className="py-2 pr-3">Phone</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-100">
              <td className="whitespace-nowrap py-2 pr-3 font-mono font-bold text-[#8a6a3b]">{row.visitorCode || "—"}</td>
              <td className="py-2 pr-3 font-semibold">{row.fullName}</td>
              <td className="py-2 pr-3">{row.country || "—"}</td>
              <td className="whitespace-nowrap py-2 pr-3 font-mono font-semibold tracking-wide">
                {row.passportNo || "—"}
              </td>
              <td className="py-2 pr-3">{row.phone}</td>
              <td className="whitespace-nowrap py-2 text-slate-500">{row.createdAt.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
