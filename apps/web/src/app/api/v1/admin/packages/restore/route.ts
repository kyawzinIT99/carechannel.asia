import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { hasRole, readSession } from "@/server/auth/session";
import { CHECKUP_PACKAGES_2026, PACKAGE_NOTES, packageFeatureLines } from "@/catalog/hospital-source";
import { revalidatePublicSite } from "@/server/content/revalidate-public";

const ADMIN: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export async function POST() {
  const session = await readSession();
  if (!hasRole(session, ADMIN)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const catalog = await prisma.packageCatalog.upsert({
    where: { code: "HEALTH_CHECKUP_2026" },
    update: {
      nameEn: "Health Check Up Package 2026",
      nameMy: "၂၀၂၆ နှစ်စဉ်ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်",
      sourceUrl: "https://chiangmairam.com/news_detail/970",
      notesEn: PACKAGE_NOTES.en,
      notesMy: PACKAGE_NOTES.my,
    },
    create: {
      code: "HEALTH_CHECKUP_2026",
      nameEn: "Health Check Up Package 2026",
      nameMy: "၂၀၂၆ နှစ်စဉ်ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်",
      sourceUrl: "https://chiangmairam.com/news_detail/970",
      notesEn: PACKAGE_NOTES.en,
      notesMy: PACKAGE_NOTES.my,
      validFrom: new Date("2026-01-01T00:00:00.000Z"),
      validTo: new Date("2026-12-31T23:59:59.000Z"),
    },
  });

  for (const pkg of CHECKUP_PACKAGES_2026) {
    const features = packageFeatureLines(pkg.code);
    await prisma.package.upsert({
      where: { code: pkg.code },
      update: {
        ...pkg,
        ...features,
        catalogId: catalog.id,
        published: true,
      },
      create: {
        ...pkg,
        ...features,
        catalogId: catalog.id,
        published: true,
      },
    });
  }

  revalidatePublicSite();
  return NextResponse.json({ ok: true, count: CHECKUP_PACKAGES_2026.length });
}
