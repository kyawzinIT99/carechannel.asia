import { Prisma, Promotion } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { PackageToggle } from "@/components/admin/package-toggle";
import { PackageHighlightEditor } from "@/components/admin/package-highlight-editor";
import { AddPackageForm } from "@/components/admin/add-package-form";
import { CatalogNotesForm } from "@/components/admin/catalog-notes-form";
import { RestoreCatalogButton } from "@/components/admin/restore-catalog-button";
import { RestoreFlyersButton } from "@/components/admin/restore-flyers-button";
import { PromotionActions } from "@/components/admin/promotion-actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const dynamic = "force-dynamic";

type CatalogRow = Prisma.PackageCatalogGetPayload<{
  include: { packages: true };
}>;

export default async function AdminPackagesPage() {
  let catalogs: CatalogRow[] = [];
  let flyers: Promotion[] = [];
  try {
    catalogs = await prisma.packageCatalog.findMany({
      include: { packages: { orderBy: { salePrice: "asc" } } },
      orderBy: { validFrom: "desc" },
    });
  } catch {
    return (
      <div className="rounded-2xl bg-amber-50 p-6 text-sm text-amber-900">
        Packages could not load. Restart the Next.js server so Prisma can load the latest schema, then refresh this page.
      </div>
    );
  }
  try {
    flyers = await prisma.promotion.findMany({
      where: { kind: "flyer" },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    flyers = [];
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Packages"
        hint="Visible packages appear on the public packages page, the homepage, and the visit form. Hospital flyers are published from this page or Announcements. Hide a package or flyer only if visitors should not see it."
        liveHref="/packages"
        actions={
          <>
            <RestoreCatalogButton />
            <Link href="/admin/packages/new" className="rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820]">
              + New catalog
            </Link>
          </>
        }
      />

      {catalogs.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
          <p className="text-slate-600">No 2026 catalog in the database yet.</p>
          <div className="mt-4">
            <RestoreCatalogButton />
          </div>
        </div>
      ) : (
        catalogs.map((cat) => (
          <div key={cat.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#1a2330] px-5 py-4">
              <div>
                <p className="font-semibold text-white">{cat.nameEn}</p>
                <p className="text-xs text-white/50">
                  Valid {cat.validFrom.toISOString().slice(0, 10)} – {cat.validTo.toISOString().slice(0, 10)}
                </p>
              </div>
              <span className="rounded-full bg-[#c4a35a] px-3 py-1 text-xs font-semibold text-[#1a2330]">
                {cat.packages.filter((p) => p.published).length}/{cat.packages.length} live
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f7f4ee] text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Package</th>
                    <th className="px-4 py-3 text-left">Gender</th>
                    <th className="px-4 py-3 text-right">List</th>
                    <th className="px-4 py-3 text-right">Sale</th>
                    <th className="px-4 py-3 text-left">Highlight</th>
                    <th className="px-4 py-3 text-center">Live</th>
                    <th className="px-4 py-3 text-right">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cat.packages.map((pkg) => (
                    <tr key={pkg.id} className={`align-middle ${pkg.published ? "" : "bg-slate-50 opacity-60"}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#1a2330]">{pkg.nameEn}</p>
                        <p className="font-mono text-xs text-slate-400">{pkg.code}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          pkg.gender === "MALE"
                            ? "bg-[#eef3f8] text-[#1a2330]"
                            : pkg.gender === "FEMALE"
                            ? "bg-[#fbf8f1] text-[#9a7b12]"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {pkg.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400 line-through">
                        {Number(pkg.listPrice).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-[#1a2330]">
                        {Number(pkg.salePrice).toLocaleString()} THB
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
                          className="rounded-full border border-[#1a2330]/15 px-3 py-1.5 text-xs font-semibold text-[#1a2330] hover:bg-[#f7f4ee]"
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

      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#1a2330] px-5 py-4">
          <div>
            <p className="font-semibold text-white">Hospital package flyers</p>
            <p className="text-xs text-white/50">
              These sheets appear on the public homepage and packages page. Publish or hide each one here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#c4a35a] px-3 py-1 text-xs font-semibold text-[#1a2330]">
              {flyers.filter((p) => p.published).length}/{flyers.length} live
            </span>
            <RestoreFlyersButton />
          </div>
        </div>
        {flyers.length === 0 ? (
          <div className="p-6">
            <p className="text-slate-600">No flyers in the database yet. Publish the hospital sheets, or restore 2026 packages & flyers.</p>
          </div>
        ) : (
          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {flyers.map((promo) => (
              <article key={promo.id} className={`overflow-hidden rounded-xl ring-1 ring-slate-100 ${promo.published ? "" : "opacity-60"}`}>
                {promo.imagePath ? (
                  <div className="relative aspect-[3/4] bg-[#f4f1ea]">
                    <Image src={promo.imagePath} alt="" fill className="object-contain" sizes="30vw" />
                  </div>
                ) : null}
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#1a2330]">{promo.titleEn}</p>
                  <p className="text-xs text-slate-500">{promo.flyerGroup} · sort {promo.sortOrder}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/promotions/${promo.id}/edit`}
                      className="rounded-full border border-[#1a2330]/15 px-3 py-1.5 text-xs font-semibold text-[#1a2330] hover:bg-[#f7f4ee]"
                    >
                      Edit
                    </Link>
                    <PromotionActions id={promo.id} published={promo.published} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
