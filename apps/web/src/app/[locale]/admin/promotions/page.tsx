import { Promotion } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import { PromotionActions } from "@/components/admin/promotion-actions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  let promos: Promotion[] = [];
  try {
    promos = await prisma.promotion.findMany({ orderBy: { sortOrder: "asc" } });
  } catch {
    return (
      <div className="rounded-2xl bg-amber-50 p-6 text-sm text-amber-900">
        Announcements could not load. Restart the Next.js server so Prisma can load the latest schema, then refresh this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Announcements"
        hint="Published items appear on the public homepage and packages page. Publishing does not email visitors — use Inquiries to send a follow-up."
        liveHref="/"
        actions={
          <Link href="/admin/promotions/new" className="rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820]">
            + New announcement
          </Link>
        }
      />

      {promos.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500">No promotions yet.</p>
      ) : (
        <div className="space-y-3">
          {promos.map((promo) => (
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
    </div>
  );
}
