import { prisma } from "@/server/db/prisma";

export type SiteContentRow = {
  key: string;
  valueEn: string;
  valueMy: string;
};

export async function listSiteContent(): Promise<SiteContentRow[]> {
  return prisma.siteContent.findMany();
}

export async function upsertSiteContent(row: SiteContentRow) {
  await prisma.siteContent.upsert({
    where: { key: row.key },
    update: { valueEn: row.valueEn, valueMy: row.valueMy },
    create: { key: row.key, valueEn: row.valueEn, valueMy: row.valueMy },
  });
}

export async function countPublishedPromotions(): Promise<number> {
  return prisma.promotion.count({ where: { published: true } });
}
