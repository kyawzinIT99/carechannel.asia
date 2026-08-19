import { Prisma } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import { PackageToggle } from "@/components/admin/package-toggle";
import { PackageHighlightEditor } from "@/components/admin/package-highlight-editor";
import { AddPackageForm } from "@/components/admin/add-package-form";
import { CatalogNotesForm } from "@/components/admin/catalog-notes-form";

export const dynamic = "force-dynamic";

type CatalogRow = Prisma.PackageCatalogGetPayload<{
  include: { packages: true };
}>;

export default async function AdminPackagesPage() {
  let catalogs: CatalogRow[] = [];
  try {
    catalogs = await prisma.packageCatalog.findMany({
      include: { packages: { orderBy: { code: "asc" } } },
      orderBy: { validFrom: "desc" },
    });
  } catch {
    return (
      <div className="rounded-2xl bg-amber-50 p-6 text-sm text-amber-900">
        Packages could not load. Restart the Next.js server so Prisma can load the latest schema, then refresh this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Packages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Published packages appear on the homepage price strip, the public packages page, and the contact form.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/packages/new"
            className="rounded-full bg-[#0b4f9c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083a73]"
          >
            + New catalog
          </Link>
        </div>
      </div>

      {/* How highlights work */}
      <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-800">
        <strong>Admin tip:</strong> Names, prices, included tests, highlight badges, and the Visible toggle all go live on the public site as soon as you save. Unpublished packages stay hidden from visitors.
      </div>

      {catalogs.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500">No catalogs seeded yet. Run <code>npm run db:seed</code>.</p>
      ) : (
        catalogs.map((cat) => (
          <div key={cat.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
              <div>
                <p className="font-semibold">{cat.nameEn}</p>
                <p className="text-xs text-slate-400">
                  Valid {cat.validFrom.toISOString().slice(0, 10)} – {cat.validTo.toISOString().slice(0, 10)}
                </p>
              </div>
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                {cat.packages.filter((p) => p.published).length}/{cat.packages.length} visible
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Package</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-right">List price</th>
                    <th className="px-4 py-3 text-right">Sale price</th>
                    <th className="px-4 py-3 text-left">Highlight label</th>
                    <th className="px-4 py-3 text-center">Visible</th>
                    <th className="px-4 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cat.packages.map((pkg) => (
                    <tr key={pkg.id} className={`align-middle ${pkg.published ? "" : "opacity-50"}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold">{pkg.nameEn}</p>
                        <p className="text-xs text-slate-400 font-mono">{pkg.code}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          pkg.gender === "MALE"
                            ? "bg-blue-100 text-blue-700"
                            : pkg.gender === "FEMALE"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {pkg.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 line-through">
                        {Number(pkg.listPrice).toLocaleString()} {pkg.currency}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#0b4f9c]">
                        {Number(pkg.salePrice).toLocaleString()} {pkg.currency}
                      </td>
                      <td className="px-4 py-3">
                        <PackageHighlightEditor id={pkg.id} current={pkg.highlight ?? ""} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <PackageToggle id={pkg.id} published={pkg.published} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/packages/${pkg.id}/edit`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-4 border-t border-slate-100 p-4">
              <CatalogNotesForm id={cat.id} notesEn={cat.notesEn} notesMy={cat.notesMy} />
              <AddPackageForm catalogId={cat.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
