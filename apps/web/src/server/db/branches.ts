import { prisma } from "@/server/db/prisma";

export type BranchRow = {
  id: string;
  code: string;
  nameEn: string;
  nameMy: string;
  detailEn: string;
  detailMy: string;
  mapQuery: string;
  status: string;
  sortOrder: number;
  published: boolean;
};

type BranchDelegate = {
  findMany: (args: unknown) => Promise<BranchRow[]>;
  findUnique: (args: unknown) => Promise<BranchRow | null>;
  create: (args: unknown) => Promise<BranchRow>;
  update: (args: unknown) => Promise<BranchRow>;
  delete: (args: unknown) => Promise<unknown>;
};

function delegate(): BranchDelegate | null {
  const d = (prisma as unknown as { branch?: BranchDelegate }).branch;
  return d && typeof d.findMany === "function" ? d : null;
}

export async function listBranches(): Promise<BranchRow[]> {
  const d = delegate();
  if (d) return d.findMany({ orderBy: { sortOrder: "asc" } });
  return prisma.$queryRaw<BranchRow[]>`
    SELECT id, code, "nameEn", "nameMy", "detailEn", "detailMy", "mapQuery", status, "sortOrder", published
    FROM "Branch"
    ORDER BY "sortOrder" ASC
  `;
}

export async function getBranch(id: string): Promise<BranchRow | null> {
  const d = delegate();
  if (d) return d.findUnique({ where: { id } });
  const rows = await prisma.$queryRaw<BranchRow[]>`
    SELECT id, code, "nameEn", "nameMy", "detailEn", "detailMy", "mapQuery", status, "sortOrder", published
    FROM "Branch"
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function createBranch(data: Omit<BranchRow, "id">): Promise<BranchRow> {
  const d = delegate();
  if (d) return d.create({ data });
  const rows = await prisma.$queryRaw<BranchRow[]>`
    INSERT INTO "Branch" (id, code, "nameEn", "nameMy", "detailEn", "detailMy", "mapQuery", status, "sortOrder", published)
    VALUES (concat('c', substr(md5(random()::text), 1, 24)), ${data.code}, ${data.nameEn}, ${data.nameMy}, ${data.detailEn}, ${data.detailMy}, ${data.mapQuery}, ${data.status}, ${data.sortOrder}, ${data.published})
    RETURNING id, code, "nameEn", "nameMy", "detailEn", "detailMy", "mapQuery", status, "sortOrder", published
  `;
  return rows[0];
}

export async function updateBranch(id: string, data: Partial<Omit<BranchRow, "id" | "code">>): Promise<BranchRow> {
  const d = delegate();
  if (d) return d.update({ where: { id }, data });
  const current = await getBranch(id);
  if (!current) throw new Error("not_found");
  const next = { ...current, ...data };
  const rows = await prisma.$queryRaw<BranchRow[]>`
    UPDATE "Branch"
    SET
      "nameEn" = ${next.nameEn},
      "nameMy" = ${next.nameMy},
      "detailEn" = ${next.detailEn},
      "detailMy" = ${next.detailMy},
      "mapQuery" = ${next.mapQuery},
      status = ${next.status},
      "sortOrder" = ${next.sortOrder},
      published = ${next.published}
    WHERE id = ${id}
    RETURNING id, code, "nameEn", "nameMy", "detailEn", "detailMy", "mapQuery", status, "sortOrder", published
  `;
  return rows[0];
}

export async function deleteBranch(id: string) {
  const d = delegate();
  if (d) {
    await d.delete({ where: { id } });
    return;
  }
  await prisma.$executeRaw`DELETE FROM "Branch" WHERE id = ${id}`;
}
