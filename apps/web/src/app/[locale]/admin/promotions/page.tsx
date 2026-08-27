import { Promotion } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { PromotionActions } from "@/components/admin/promotion-actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RestoreFlyersButton } from "@/components/admin/restore-flyers-button";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  let promos: Promotion[] = [];
  try {
    promos = await prisma.promotion.findMany({ orderBy: [{ kind: "desc" }, { sortOrder: "asc" }] });
  } catch {
    return (
      <div className="rounded-2xl bg-amber-50 p-6 text-sm text-amber-900">
        Announcements could not load. Restart the Next.js server so Prisma can load the latest schema, then refresh this page.
      </div>
    );
  }

  const flyers = promos.filter((p) => p.kind === "flyer");
  const notes = promos.filter((p) => p.kind !== "flyer");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Announcements"
        hint="Package flyers appear as full hospital sheets on the homepage. Text announcements stay in the news section. Publishing does not email visitors."
        liveHref="/"
        actions={
          <>
            <RestoreFlyersButton />
            <Link href="/admin/promotions/new" className="rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820]">
              + New announcement
            </Link>
          </>
        }
      />

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4a35a]">Package flyers</p>
            <p className="mt-1 text-sm text-slate-500">
              Published sheets show on the public homepage and packages page. Unpublish to hide one without deleting it.
            </p>
          </div>
        </div>
        {flyers.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-slate-500">
            No flyers in the database yet. Click Publish hospital flyers.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {flyers.map((promo) => (
              <article key={promo.id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
                {promo.imagePath ? (
                  <div className="relative aspect-[3/4] bg-[#f4f1ea]">
                    <Image src={promo.imagePath} alt="" fill className="object-contain" sizes="30vw" />
                  </div>
                ) : null}
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${promo.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {promo.published ? "Live" : "Hidden"}
                    </span>
                    <span className="text-xs text-slate-400">{promo.flyerGroup || "flyer"}</span>
                  </div>
                  <p className="mt-2 font-semibold text-[#1a2330]">{promo.titleEn}</p>
                  <p className="text-sm text-slate-500">{promo.titleMy}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={`/admin/promotions/${promo.id}/edit`}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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

      <section>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4a35a]">Text announcements</p>
        {notes.length === 0 ? (
          <p className="rounded-2xl bg-white p-6 text-slate-500">No text announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((promo) => (
              <div key={promo.id} className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${promo.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {promo.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-slate-400">sort {promo.sortOrder}</span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{promo.titleEn}</p>
                  <p className="text-sm text-slate-500">{promo.titleMy}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-700">{promo.bodyEn}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Link
                    href={`/admin/promotions/${promo.id}/edit`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </Link>
                  <PromotionActions id={promo.id} published={promo.published} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
