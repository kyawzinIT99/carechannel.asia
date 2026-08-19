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

export async function listBranches(): Promise<BranchRow[]> {
  return prisma.branch.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getBranch(id: string): Promise<BranchRow | null> {
  return prisma.branch.findUnique({ where: { id } });
}

export async function createBranch(data: Omit<BranchRow, "id">): Promise<BranchRow> {
  return prisma.branch.create({ data });
}

export async function updateBranch(id: string, data: Partial<Omit<BranchRow, "id" | "code">>): Promise<BranchRow> {
  return prisma.branch.update({ where: { id }, data });
}

export async function deleteBranch(id: string) {
  await prisma.branch.delete({ where: { id } });
}
