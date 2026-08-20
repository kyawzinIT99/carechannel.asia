import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasRole, readSession, STAFF_ROLES } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { ConfirmAppointmentButton } from "@/components/confirm-appointment-button";
import { PageContainer } from "@/components/page-container";

export const dynamic = "force-dynamic";

export default async function StaffPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await readSession();
  if (!hasRole(session, STAFF_ROLES)) redirect(`/${locale}/staff/login`);

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { package: true, appointments: true },
  });

  return (
    <PageContainer>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0b4f9c]">Coordinator</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Inbox</h1>
        </div>
        <a href={`/${locale}/admin`} className="rounded-full border border-[#0b4f9c] px-4 py-2 text-sm font-semibold text-[#0b4f9c] hover:bg-[#0b4f9c] hover:text-white transition">
          Admin panel →
        </a>
      </div>

      {inquiries.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center text-slate-400 shadow-sm">No inquiries yet.</div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Visitor</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Centre / Package</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inquiries.map((row) => {
                const appt = row.appointments[0];
                return (
                  <tr key={row.id} className="align-top hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-400">
                      {row.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{row.fullName}</p>
                      <p className="text-xs text-slate-400">
                        {row.country ?? ""}
                        {row.returningPatient ? " · returning patient" : ""}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{row.phone}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      <p>{row.specialtySlug ?? row.package?.nameEn ?? "—"}</p>
                      {appt?.airportPickup ? <p className="mt-1 font-semibold text-sky-700">Airport pickup</p> : null}
                      {appt?.accommodationHelp ? <p className="font-semibold text-sky-700">Stay nearby</p> : null}
                      {appt?.visaHelp ? <p className="font-semibold text-sky-700">Visa help</p> : null}
                    </td>
                    <td className="px-5 py-3">
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                        {appt?.status ?? row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {appt?.status === "REQUESTED" ? <ConfirmAppointmentButton id={appt.id} /> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </PageContainer>
  );
}
