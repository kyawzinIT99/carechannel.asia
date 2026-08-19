import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { PromotionForm } from "@/components/admin/promotion-form";

export const dynamic = "force-dynamic";

export default async function EditPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const promo = await prisma.promotion.findUnique({ where: { id } });
  if (!promo) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit promotion</h1>
      <PromotionForm
        initial={{
          id: promo.id,
          titleEn: promo.titleEn,
          titleMy: promo.titleMy,
          bodyEn: promo.bodyEn,
          bodyMy: promo.bodyMy,
          sortOrder: promo.sortOrder,
          published: promo.published,
        }}
      />
    </div>
  );
}
