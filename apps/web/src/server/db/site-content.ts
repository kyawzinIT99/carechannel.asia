import { prisma } from "@/server/db/prisma";

export type SiteContentRow = {
  key: string;
  valueEn: string;
  valueMy: string;
};

type Delegate = {
  findMany: (args?: unknown) => Promise<SiteContentRow[]>;
  upsert: (args: unknown) => Promise<unknown>;
};

function delegate(): Delegate | null {
  const d = (prisma as unknown as { siteContent?: Delegate }).siteContent;
  return d && typeof d.findMany === "function" ? d : null;
}

export async function listSiteContent(): Promise<SiteContentRow[]> {
  const d = delegate();
  if (d) return d.findMany();
  return prisma.$queryRaw<SiteContentRow[]>`
    SELECT key, "valueEn", "valueMy" FROM "SiteContent"
  `;
}

export async function upsertSiteContent(row: SiteContentRow) {
  const d = delegate();
  if (d) {
    await d.upsert({
      where: { key: row.key },
      update: { valueEn: row.valueEn, valueMy: row.valueMy },
      create: { key: row.key, valueEn: row.valueEn, valueMy: row.valueMy },
    });
    return;
  }
  await prisma.$executeRaw`
    INSERT INTO "SiteContent" (id, key, "valueEn", "valueMy", "updatedAt")
    VALUES (
      concat('c', substr(md5(random()::text), 1, 24)),
      ${row.key},
      ${row.valueEn},
      ${row.valueMy},
      NOW()
    )
    ON CONFLICT (key) DO UPDATE
    SET "valueEn" = EXCLUDED."valueEn",
        "valueMy" = EXCLUDED."valueMy",
        "updatedAt" = NOW()
  `;
}

export async function countPublishedPromotions(): Promise<number> {
  const d = (prisma as unknown as { promotion?: { count: (args: unknown) => Promise<number> } }).promotion;
  if (d && typeof d.count === "function") {
    return d.count({ where: { published: true } });
  }
  const rows = await prisma.$queryRaw<Array<{ n: bigint }>>`
    SELECT COUNT(*)::bigint AS n FROM "Promotion" WHERE published = true
  `;
  return Number(rows[0]?.n ?? 0);
}
