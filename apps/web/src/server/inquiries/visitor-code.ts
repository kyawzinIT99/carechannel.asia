import { prisma } from "@/server/db/prisma";

const PREFIX = "CH";

export function formatVisitorCode(n: number) {
  return `${PREFIX}${String(Math.max(1, Math.floor(n))).padStart(3, "0")}`;
}

export function normalizeVisitorCode(raw?: string | null) {
  const compact = String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]/g, "");
  const match = compact.match(/^(?:CH)?(\d{1,6})$/);
  if (!match) return "";
  return formatVisitorCode(Number(match[1]));
}

async function maxVisitorNumber() {
  const rows = await prisma.inquiry.findMany({
    where: { visitorCode: { not: null } },
    select: { visitorCode: true },
  });
  let max = 0;
  for (const row of rows) {
    const n = Number(String(row.visitorCode || "").replace(/^CH/i, ""));
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

export async function backfillVisitorCodes() {
  try {
    const missing = await prisma.inquiry.findMany({
      where: { visitorCode: null },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      select: { id: true },
    });
    if (!missing.length) return;
    let next = (await maxVisitorNumber()) + 1;
    for (const row of missing) {
      await prisma.inquiry.update({
        where: { id: row.id },
        data: { visitorCode: formatVisitorCode(next) },
      });
      next += 1;
    }
  } catch {
    /* column not migrated yet */
  }
}

export async function assignVisitorCode(claimedRaw?: string | null) {
  await backfillVisitorCodes();
  const claimed = normalizeVisitorCode(claimedRaw);
  if (claimed) {
    const taken = await prisma.inquiry.findFirst({
      where: { visitorCode: claimed },
      select: { id: true },
    });
    if (!taken) return claimed;
  }
  return formatVisitorCode((await maxVisitorNumber()) + 1);
}
