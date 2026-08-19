import { Link } from "@/i18n/routing";
import { listBranches } from "@/server/db/branches";

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
  let rows: Awaited<ReturnType<typeof listBranches>> = [];
  let loadError = "";
  try {
    rows = await listBranches();
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load branches.";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Branches</h1>
          <p className="mt-1 text-sm text-slate-500">
            Both campuses belong to Chiangmai Ram Hospital. Published branches appear on the contact form and contact sidebar.
          </p>
        </div>
        <Link href="/admin/branches/new" className="rounded-full bg-[#0b4f9c] px-4 py-2 text-sm font-semibold text-white">
          + Add branch
        </Link>
      </div>

      {loadError ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">{loadError}</p>
      ) : null}

      {rows.length === 0 && !loadError ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500">No branches yet. Add the Sripoom campus and the Charoen Mueang site.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <div key={b.id} className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${b.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {b.published ? "Published" : "Hidden"}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${b.status === "open" ? "bg-sky-100 text-sky-800" : "bg-amber-100 text-amber-800"}`}>
                    {b.status === "open" ? "Open" : "Opening soon"}
                  </span>
                  <span className="font-mono text-xs text-slate-400">{b.code}</span>
                </div>
                <p className="mt-2 font-semibold text-slate-900">{b.nameEn}</p>
                <p className="text-sm text-slate-500">{b.nameMy}</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{b.detailEn}</p>
              </div>
              <Link
                href={`/admin/branches/${b.id}/edit`}
                className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
