import { prisma } from "@/server/db/prisma";
import { InquiryActions } from "@/components/admin/inquiry-actions";
import { InquiryReportBoard, InquirySelectBox } from "@/components/admin/inquiry-report-bar";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const where = status === "NEW" ? { status: "NEW" as const } : undefined;

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { package: true, appointments: true, assignedTo: true },
  });

  const staff = await prisma.user.findMany({
    where: { isActive: true },
    include: { roles: true },
  });
  const coordinators = staff.filter((u) =>
    u.roles.some((r) =>
      ["SUPER_ADMIN", "HOSPITAL_ADMIN", "INTERNATIONAL_COORDINATOR", "RECEPTION"].includes(r.role)
    )
  );
  let promotions: { id: string; titleEn: string }[] = [];
  try {
    promotions = await prisma.promotion.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, titleEn: true },
    });
  } catch {
    promotions = [];
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <div className="flex gap-2 text-sm">
          <a href="?" className={`rounded-full px-3 py-1 ${!status ? "bg-[#0b4f9c] text-white" : "border border-slate-300 text-slate-600"}`}>All</a>
          <a href="?status=NEW" className={`rounded-full px-3 py-1 ${status === "NEW" ? "bg-amber-500 text-white" : "border border-slate-300 text-slate-600"}`}>New only</a>
        </div>
      </div>
      <p className="text-sm text-slate-500">
        Each row is one visit request from the website, LINE / Telegram / Viber, or Google Form via n8n. Assign to a coordinator. Do not keep a second customer list.
      </p>

      <InquiryReportBoard
        status={status}
        promotions={promotions}
        visitorIds={inquiries.map((row) => ({ id: row.id, hasEmail: Boolean(row.email) }))}
      >
      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Visitor</th>
              <th className="px-4 py-3">Phone / Email</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned to</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">No inquiries yet.</td>
              </tr>
            ) : null}
            {inquiries.map((row) => {
              const appt = row.appointments[0];
              const statusBadge =
                row.status === "NEW" ? "bg-amber-100 text-amber-700"
                : row.status === "CONTACTED" ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-500";
              return (
                <tr key={row.id} className="align-top hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <InquirySelectBox id={row.id} hasEmail={Boolean(row.email)} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {row.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.fullName}</p>
                    <p className="text-xs text-slate-500">
                      {row.locale.toUpperCase()}
                      {row.country ? ` · ${row.country}` : ""}
                      {row.returningPatient ? " · returning patient" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <p>{row.phone}</p>
                    {row.email ? <p className="text-xs">{row.email}</p> : <p className="text-xs text-slate-300">No email</p>}
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="text-xs text-slate-500">{row.specialtySlug ?? (row.package?.nameEn ?? "—")}</p>
                    {appt?.airportPickup ? <p className="mt-1 text-[11px] font-semibold text-sky-700">Airport pickup</p> : null}
                    {appt?.accommodationHelp ? <p className="text-[11px] font-semibold text-sky-700">Stay nearby</p> : null}
                    {appt?.visaHelp ? <p className="text-[11px] font-semibold text-sky-700">Visa help</p> : null}
                    <p className="mt-1 line-clamp-2 text-xs text-slate-700">{row.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge}`}>
                      {appt?.status ?? row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {row.assignedTo?.name ?? <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <InquiryActions
                      id={row.id}
                      status={row.status}
                      coordinators={coordinators.map((c) => ({ id: c.id, name: c.name }))}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </InquiryReportBoard>
    </div>
  );
}
