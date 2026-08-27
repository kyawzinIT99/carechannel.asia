import { prisma } from "@/server/db/prisma";
import { stringList } from "@/server/db/json-list";
import { listBranches } from "@/server/db/branches";
import { listSiteContent } from "@/server/db/site-content";
import {
  CHECKUP_PACKAGES_2026,
  HOSPITAL_PROFILE,
  PACKAGE_NOTES,
  SPECIALTIES,
  VISIT_SITES,
  flattenSpecialties,
  packageFeatureLines,
} from "@/catalog/hospital-source";
import { PACKAGE_FLYERS, flyerFromPromotion } from "@/catalog/package-flyers";

import type { PublicChrome } from "@/catalog/public-chrome";
import { googleFormsUrl, httpsUrl } from "@/server/security/urls";
import { lineHttpUrl, telegramHttpUrl, viberAppUrl } from "@/server/security/messengers";

function siteMapEn() {
  return listSiteContent().then((rows) =>
    Object.fromEntries(rows.map((r) => [r.key, r.valueEn])),
  );
}

export async function loadPublicChrome(): Promise<PublicChrome> {
  const hospital = await loadPublicHospital();
  let copy: Record<string, string> = {};
  try {
    copy = await siteMapEn();
  } catch {
    copy = {};
  }
  const linePhone = copy["partner.linePhone"]?.trim() || HOSPITAL_PROFILE.chatPhoneDisplay;
  const viberDisplay = copy["partner.viberPhone"]?.trim() || HOSPITAL_PROFILE.viberDisplay;
  const telegramStored = copy["partner.telegramUrl"]?.trim() || HOSPITAL_PROFILE.telegramUrl;
  const apartmentUrl = httpsUrl(copy["partner.apartmentUrl"], "https://sddp-apartment.onrender.com");
  const publishedForm =
    "https://docs.google.com/forms/d/e/1FAIpQLSfV14CMMEqKiKkALBxB0JKc740JKPiAIrY-ykNQUqTjKsJbKw/viewform";
  const storedForm = googleFormsUrl(copy["partner.googleFormUrl"]) || googleFormsUrl(process.env.GOOGLE_FORM_URL);
  const googleFormUrl =
    !storedForm ||
    storedForm.includes("ram-hospital-visit") ||
    (storedForm.includes("1nLGeHgj") && !storedForm.includes("/e/"))
      ? publishedForm
      : storedForm;
  return {
    nameEn: hospital.nameEn,
    nameMy: hospital.nameMy,
    legalNameTh: hospital.legalNameTh,
    addressEn: hospital.addressEn,
    addressMy: hospital.addressMy,
    logoPath: hospital.logoPath || HOSPITAL_PROFILE.logoPath,
    heroPath: hospital.heroPath || HOSPITAL_PROFILE.heroPath,
    linePhone,
    lineUrl: lineHttpUrl(linePhone),
    telegramUrl: telegramHttpUrl(telegramStored, linePhone),
    viberDisplay,
    viberUrl: viberAppUrl(viberDisplay),
    apartmentUrl,
    googleFormUrl,
  };
}

export async function loadPublicHospital() {
  try {
    const row = await prisma.hospitalProfile.findFirst();
    if (row) return row;
  } catch { /* unmigrated */ }
  return HOSPITAL_PROFILE;
}

export async function loadPublicCopy(locale: string) {
  const my = locale === "my";
  try {
    const rows = await listSiteContent();
    return Object.fromEntries(rows.map((r) => [r.key, my ? r.valueMy : r.valueEn]));
  } catch {
    return {} as Record<string, string>;
  }
}

export async function loadPublicPromotions() {
  try {
    return await prisma.promotion.findMany({
      where: { published: true, kind: { not: "flyer" } },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    try {
      return await prisma.promotion.findMany({
        where: { published: true },
        orderBy: { sortOrder: "asc" },
      });
    } catch {
      return [];
    }
  }
}

export async function loadPublicFlyers() {
  try {
    const rows = await prisma.promotion.findMany({
      where: { published: true, kind: "flyer" },
      orderBy: { sortOrder: "asc" },
    });
    const flyers = rows.map(flyerFromPromotion).filter((row): row is NonNullable<typeof row> => Boolean(row));
    if (flyers.length) return flyers;
  } catch {
    /* unmigrated or empty */
  }
  return PACKAGE_FLYERS;
}

function publicPackageFromDb(p: {
  id: string;
  code: string;
  nameEn: string;
  nameMy: string;
  gender: string;
  listPrice: unknown;
  salePrice: unknown;
  highlight?: string | null;
  featuresEn: unknown;
  featuresMy: unknown;
}) {
  const fallback = packageFeatureLines(p.code);
  const featuresEn = stringList(p.featuresEn);
  const featuresMy = stringList(p.featuresMy);
  return {
    id: p.id,
    code: p.code,
    nameEn: p.nameEn,
    nameMy: p.nameMy,
    gender: p.gender,
    listPrice: String(p.listPrice),
    salePrice: String(p.salePrice),
    highlight: p.highlight ?? null,
    featuresEn: featuresEn.length ? featuresEn : fallback.featuresEn,
    featuresMy: featuresMy.length ? featuresMy : fallback.featuresMy,
  };
}

export async function loadPublicPackages() {
  const catalog = CHECKUP_PACKAGES_2026.map((p) => ({
    id: p.code,
    ...p,
    highlight: p.highlight ?? null,
    ...packageFeatureLines(p.code),
  }));
  try {
    const rows = await prisma.package.findMany({ orderBy: { salePrice: "asc" } });
    const byCode = new Map(rows.map((row) => [row.code, row]));
    const catalogCodes = new Set(CHECKUP_PACKAGES_2026.map((p) => p.code));
    const merged = [];
    for (const item of catalog) {
      const db = byCode.get(item.code);
      if (!db) {
        merged.push(item);
        continue;
      }
      if (!db.published) continue;
      merged.push({
        ...publicPackageFromDb(db),
        nameEn: item.nameEn,
        nameMy: item.nameMy,
        listPrice: item.listPrice,
        salePrice: item.salePrice,
        highlight: item.highlight,
        featuresEn: item.featuresEn,
        featuresMy: item.featuresMy,
      });
    }
    for (const db of rows) {
      if (catalogCodes.has(db.code) || !db.published) continue;
      merged.push(publicPackageFromDb(db));
    }
    const catalogOrder = CHECKUP_PACKAGES_2026.map((p) => p.code);
    merged.sort((a, b) => {
      const ai = catalogOrder.indexOf(a.code);
      const bi = catalogOrder.indexOf(b.code);
      if (ai === -1 && bi === -1) return Number(a.salePrice) - Number(b.salePrice);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return merged.length ? merged : catalog;
  } catch {
    return catalog;
  }
}

export async function loadPublicPackageNotes() {
  try {
    const catalog = await prisma.packageCatalog.findFirst({ orderBy: { validFrom: "desc" } });
    if (catalog) return { en: catalog.notesEn, my: catalog.notesMy };
  } catch { /* fallback */ }
  return PACKAGE_NOTES;
}

export async function loadPublicBranches() {
  try {
    const rows = (await listBranches()).filter((s) => s.published);
    if (rows.length) return rows;
  } catch { /* fallback */ }
  return VISIT_SITES.map((s, i) => ({
    id: s.code,
    code: s.code,
    nameEn: s.nameEn,
    nameMy: s.nameMy,
    detailEn: s.detailEn,
    detailMy: s.detailMy,
    mapQuery: s.mapQuery,
    status: s.status,
    sortOrder: (i + 1) * 10,
    published: true,
  }));
}

export async function loadPublicSpecialties() {
  try {
    const rows = await prisma.specialty.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
    if (rows.length) {
      return rows.map((s) => ({
        ...s,
        servicesEn: stringList(s.servicesEn),
        servicesMy: stringList(s.servicesMy),
      }));
    }
  } catch { /* fallback */ }
  return flattenSpecialties(SPECIALTIES).map((s) => ({
    id: s.slug,
    slug: s.slug,
    sourceUrl: s.sourceUrl,
    imagePath: s.imagePath ?? null,
    phone: s.phone ?? null,
    hoursEn: s.hoursEn ?? null,
    hoursMy: s.hoursMy ?? null,
    nameEn: s.nameEn,
    nameMy: s.nameMy,
    nameTh: s.nameTh,
    summaryEn: s.summaryEn,
    summaryMy: s.summaryMy,
    servicesEn: s.servicesEn,
    servicesMy: s.servicesMy,
    sortOrder: s.sortOrder,
    published: true,
    parentId: null as string | null,
  }));
}

export async function loadPublicSpecialtyTree() {
  const all = await loadPublicSpecialties();
  const tops = all.filter((s) => !s.parentId);
  return tops.map((parent) => ({
    ...parent,
    children: all.filter((c) => c.parentId === parent.id),
  }));
}
