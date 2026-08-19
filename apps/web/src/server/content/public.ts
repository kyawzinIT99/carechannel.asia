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

import type { PublicChrome } from "@/catalog/public-chrome";
import { httpsUrl } from "@/server/security/urls";

function siteMapEn() {
  return listSiteContent().then((rows) =>
    Object.fromEntries(rows.map((r) => [r.key, r.valueEn])),
  );
}

function digits(value: string) {
  return value.replace(/\D/g, "");
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
  const telegramUrl = httpsUrl(copy["partner.telegramUrl"], HOSPITAL_PROFILE.telegramUrl);
  const apartmentUrl = httpsUrl(copy["partner.apartmentUrl"], "https://sddp-apartment.onrender.com");
  const lineDigits = digits(linePhone);
  const viberDigits = digits(viberDisplay);
  return {
    nameEn: hospital.nameEn,
    nameMy: hospital.nameMy,
    legalNameTh: hospital.legalNameTh,
    addressEn: hospital.addressEn,
    addressMy: hospital.addressMy,
    logoPath: hospital.logoPath || HOSPITAL_PROFILE.logoPath,
    heroPath: hospital.heroPath || HOSPITAL_PROFILE.heroPath,
    linePhone,
    lineUrl: lineDigits ? `https://line.me/ti/p/~${lineDigits}` : HOSPITAL_PROFILE.lineUrl,
    telegramUrl,
    viberDisplay,
    viberUrl: viberDigits ? `viber://chat?number=${viberDigits}` : HOSPITAL_PROFILE.viberUrl,
    apartmentUrl,
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
      where: { published: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export async function loadPublicPackages() {
  try {
    const rows = await prisma.package.findMany({
      where: { published: true },
      orderBy: { salePrice: "asc" },
    });
    if (rows.length) {
      return rows.map((p) => {
        const fallback = packageFeatureLines(p.code);
        return {
          id: p.id,
          code: p.code,
          nameEn: p.nameEn,
          nameMy: p.nameMy,
          gender: p.gender,
          listPrice: String(p.listPrice),
          salePrice: String(p.salePrice),
          highlight: p.highlight ?? null,
          featuresEn: stringList(p.featuresEn).length ? stringList(p.featuresEn) : fallback.featuresEn,
          featuresMy: stringList(p.featuresMy).length ? stringList(p.featuresMy) : fallback.featuresMy,
        };
      });
    }
  } catch { /* fallback */ }
  return CHECKUP_PACKAGES_2026.map((p) => ({
    id: p.code,
    ...p,
    highlight: null as string | null,
    ...packageFeatureLines(p.code),
  }));
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
