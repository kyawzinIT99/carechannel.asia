import { prisma } from "@/server/db/prisma";
import { PACKAGE_FLYERS, flyerRecordCode } from "@/catalog/package-flyers";

export async function upsertHospitalFlyers() {
  let count = 0;
  for (const [i, flyer] of PACKAGE_FLYERS.entries()) {
    const code = flyerRecordCode(flyer.id);
    const data = {
      code,
      kind: "flyer" as const,
      flyerGroup: flyer.group,
      titleEn: flyer.titleEn,
      titleMy: flyer.titleMy,
      bodyEn: flyer.summaryEn,
      bodyMy: flyer.summaryMy,
      imagePath: flyer.src,
      sortOrder: (i + 1) * 10,
      published: true,
    };
    await prisma.promotion.upsert({
      where: { code },
      update: data,
      create: data,
    });
    count += 1;
  }
  return count;
}
