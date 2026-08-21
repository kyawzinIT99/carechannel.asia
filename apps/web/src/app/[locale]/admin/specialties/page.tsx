import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import { SpecialtyForm } from "@/components/admin/specialty-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const dynamic = "force-dynamic";

export default async function AdminSpecialtiesPage() {
  const rows = await prisma.specialty.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Centres"
        hint="Published centres appear on the homepage, specialties page, and visit form."
        liveHref="/specialties"
        actions={
          <Link href="/admin/specialties/new" className="rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820]">
            + Add centre
          </Link>
        }
      />
      <div className="space-y-3">
        {rows.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
            <div>
              <p className="font-semibold">{s.nameEn} <span className="text-xs text-slate-400">{s.published ? "live" : "hidden"}</span></p>
              <p className="text-sm text-slate-500">{s.nameMy}</p>
            </div>
            <Link href={`/admin/specialties/${s.id}/edit`} className="text-sm font-bold text-[#0b4f9c]">Edit</Link>
          </div>
        ))}
      </div>
      <details className="rounded-2xl bg-slate-50 p-4">
        <summary className="cursor-pointer font-semibold">Quick add</summary>
        <div className="mt-4"><SpecialtyForm /></div>
      </details>
    </div>
  );
}
