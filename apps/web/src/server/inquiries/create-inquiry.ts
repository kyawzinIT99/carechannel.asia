import { z } from "zod";
import { Locale } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { dispatchInquiryConversation } from "@/server/automation/dispatch";
import { buildInquiryReply } from "@/server/communication/inquiry-reply";
import { flattenSpecialties, CHECKUP_PACKAGES_2026, packageFeatureLines } from "@/catalog/hospital-source";
import { COUNTRIES } from "@/catalog/countries";
import { assignVisitorCode, normalizeVisitorCode } from "@/server/inquiries/visitor-code";
import { normalizePassport, pickPassportFromRecord } from "@/server/inquiries/passport";

function allSlugs() {
  return flattenSpecialties().map((item) => item.slug);
}

async function resolvePackageId(packageCode?: string, packageId?: string) {
  if (packageId) {
    const byId = await prisma.package.findFirst({ where: { id: packageId } });
    if (byId) return byId.id;
  }
  const code = String(packageCode || "").trim();
  if (!code) return null;
  const existing = await prisma.package.findFirst({ where: { code } });
  if (existing) return existing.id;

  const catalogPkg = CHECKUP_PACKAGES_2026.find((pkg) => pkg.code === code);
  if (!catalogPkg) return null;
  try {
    let catalog = await prisma.packageCatalog.findFirst({ orderBy: { validFrom: "desc" } });
    if (!catalog) {
      catalog = await prisma.packageCatalog.create({
        data: {
          code: "HEALTH_CHECKUP_2026",
          sourceUrl: "https://chiangmairam.com/news_detail/970",
          nameEn: "Health Check Up Package 2026",
          nameMy: "၂၀၂၆ နှစ်စဉ်ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်",
          validFrom: new Date("2026-01-01T00:00:00.000Z"),
          validTo: new Date("2026-12-31T23:59:59.000Z"),
          notesEn: "",
          notesMy: "",
        },
      });
    }
    const features = packageFeatureLines(catalogPkg.code);
    const created = await prisma.package.create({
      data: {
        catalogId: catalog.id,
        code: catalogPkg.code,
        nameEn: catalogPkg.nameEn,
        nameMy: catalogPkg.nameMy,
        gender: catalogPkg.gender,
        listPrice: catalogPkg.listPrice,
        salePrice: catalogPkg.salePrice,
        published: true,
        featuresEn: features.featuresEn,
        featuresMy: features.featuresMy,
      },
    });
    return created.id;
  } catch {
    const again = await prisma.package.findFirst({ where: { code } });
    return again?.id ?? null;
  }
}

export const inquirySchema = z.object({
  locale: z.enum(["en", "my"]),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  email: z.string().email().optional().or(z.literal("")),
  country: z.string().refine((value) => (COUNTRIES as readonly string[]).includes(value), "Unknown country"),
  returningPatient: z.boolean(),
  message: z.string().min(4).max(4000),
  specialtySlug: z.string().optional(),
  packageId: z.string().optional(),
  packageCode: z.string().optional(),
  visitSite: z.enum(["SRIPOOM", "CHAROEN_MUEANG"]).optional(),
  interpreterNeeded: z.boolean().optional(),
  interpreterLang: z.string().optional(),
  preferredDate: z.string().optional(),
  airportPickup: z.boolean().optional(),
  accommodationHelp: z.boolean().optional(),
  visaHelp: z.boolean().optional(),
  visitorCode: z.string().max(20).optional(),
  passportNo: z.string().max(40).optional(),
  consent: z.literal(true),
});

function hoistInquiryPayload(raw: unknown) {
  if (!raw || typeof raw !== "object") return raw;
  const rec = { ...(raw as Record<string, unknown>) };
  if (rec.body && typeof rec.body === "object") {
    Object.assign(rec, rec.body as Record<string, unknown>);
  }
  const passport = pickPassportFromRecord(rec);
  if (passport) rec.passportNo = passport;
  if (rec.consent === "true" || rec.consent === true || rec.consent === 1) rec.consent = true;
  if (typeof rec.returningPatient === "string") {
    rec.returningPatient = /yes|true|1|ရှိ/i.test(rec.returningPatient);
  }
  if (rec.returningPatient == null) rec.returningPatient = false;
  return rec;
}

export async function createInquiry(raw: unknown, patientUserId?: string) {
  const data = inquirySchema.parse(hoistInquiryPayload(raw));
  const locale = data.locale as Locale;

  if (data.specialtySlug && !allSlugs().includes(data.specialtySlug)) {
    throw new Error("Unknown specialty");
  }
  const packageId = await resolvePackageId(data.packageCode, data.packageId);
  const packageNote =
    data.packageCode && !packageId ? `\nSelected package: ${data.packageCode}` : "";

  const visitorCode = await assignVisitorCode(data.visitorCode);
  const claimed = normalizeVisitorCode(data.visitorCode);
  const claimedNote =
    claimed && claimed !== visitorCode ? `\nExisting incentive code quoted: ${claimed}` : "";
  const passportNo = normalizePassport(data.passportNo) || null;

  const inquiry = await prisma.inquiry.create({
    data: {
      locale,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      country: data.country,
      returningPatient: data.returningPatient,
      visitorCode,
      passportNo,
      message: `${data.message}${claimedNote}${packageNote}`.slice(0, 4000),
      specialtySlug: data.specialtySlug || null,
      packageId: packageId || null,
      patientUserId: patientUserId || null,
    },
  });

  await prisma.consent.create({
    data: {
      inquiryId: inquiry.id,
      accepted: true,
      textVersion: "pdpa-v1",
    },
  });

  await prisma.appointment.create({
    data: {
      inquiryId: inquiry.id,
      locale,
      preferredDate:
        data.preferredDate && !Number.isNaN(new Date(data.preferredDate).getTime())
          ? new Date(data.preferredDate)
          : null,
      interpreterNeeded: Boolean(data.interpreterNeeded),
      interpreterLang: data.interpreterLang || null,
      airportPickup: Boolean(data.airportPickup),
      accommodationHelp: Boolean(data.accommodationHelp),
      visaHelp: Boolean(data.visaHelp),
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "inquiry.create",
      entity: "Inquiry",
      entityId: inquiry.id,
      meta: {
        specialtySlug: data.specialtySlug ?? null,
        country: data.country,
        returningPatient: data.returningPatient,
        visitSite: data.visitSite ?? null,
        airportPickup: Boolean(data.airportPickup),
        accommodationHelp: Boolean(data.accommodationHelp),
        visaHelp: Boolean(data.visaHelp),
        visitorCode,
        passportNo,
      },
    },
  });

  try {
    const reply = await buildInquiryReply({
      locale: data.locale,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || undefined,
      country: data.country,
      returningPatient: data.returningPatient,
      message: data.message,
      specialtySlug: data.specialtySlug,
      packageCode: data.packageCode,
      visitSite: data.visitSite,
      interpreterNeeded: data.interpreterNeeded,
      interpreterLang: data.interpreterLang,
      airportPickup: data.airportPickup,
      accommodationHelp: data.accommodationHelp,
      visaHelp: data.visaHelp,
      visitorCode,
      passportNo: passportNo || undefined,
      preferredDate: data.preferredDate,
    });
    await dispatchInquiryConversation({
      locale,
      guestEmail: data.email || undefined,
      ...reply,
    });
  } catch {
    // Portal stays independent if n8n or mail is offline.
  }

  return inquiry;
}

function normalizeCountry(value: string | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "Myanmar";
  if (/မြန်မာ|burma|\bmm\b/i.test(raw)) return "Myanmar";
  const hit = (COUNTRIES as readonly string[]).find((row) => row.toLowerCase() === raw.toLowerCase());
  return hit || "Myanmar";
}

function pickStr(raw: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const val = raw[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  return "";
}

/** n8n / Google Form → same Inquiry row. Never creates a User. */
export async function ingestExternalInquiry(raw: unknown) {
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const nestedRaw = body.body && typeof body.body === "object" ? (body.body as Record<string, unknown>) : body;
  const nested: Record<string, unknown> = { ...nestedRaw };
  for (const [key, val] of Object.entries(nestedRaw)) {
    const trimmed = key.trim();
    if (trimmed && nested[trimmed] == null) nested[trimmed] = val;
  }
  const fullName = pickStr(nested, ["fullName", "name", "Name", "full_name"]);
  const phone = pickStr(nested, ["phone", "Phone", "Phone or viber Number", "mobile", "tel"]);
  const email = pickStr(nested, ["email", "Email"]);
  const address = pickStr(nested, ["Resident Address", "address", "Address"]);
  const message =
    pickStr(nested, ["message", "Message", "comment", "notes"]) ||
    (address ? `Resident address: ${address}` : "Google Form visit request");
  const locale = pickStr(nested, ["locale", "language"]) === "my" ? "my" : "en";
  const specialtySlugRaw = pickStr(nested, ["specialtySlug", "specialty"]);
  const specialtySlug = allSlugs().includes(specialtySlugRaw) ? specialtySlugRaw : undefined;
  const packageCode = pickStr(nested, ["packageCode", "package"]) || undefined;
  const visitorCode = pickStr(nested, ["visitorCode", "Visitor code", "Code", "Incentive code"]) || undefined;
  const passportNo = pickPassportFromRecord(nested) || undefined;
  try {
    return await createInquiry({
      locale,
      fullName: fullName.length >= 2 ? fullName : "Google Form visitor",
      phone: phone.length >= 6 ? phone : "000000",
      email: email.includes("@") ? email : "",
      country: normalizeCountry(
        pickStr(nested, ["country", "Country", "nationality", "Nationality"]),
      ),
      returningPatient: /yes|true|1|ရှိ/i.test(pickStr(nested, ["returningPatient", "returning"])),
      message: `[Google Form]\n${message}`.slice(0, 4000),
      specialtySlug,
      packageCode,
      visitorCode,
      passportNo,
      consent: true,
    });
  } catch {
    return createInquiry({
      locale,
      fullName: fullName.length >= 2 ? fullName : "Google Form visitor",
      phone: phone.length >= 6 ? phone : "000000",
      email: email.includes("@") ? email : "",
      country: "Myanmar",
      returningPatient: false,
      message: `[Google Form]\n${message}`.slice(0, 4000),
      consent: true,
      passportNo,
    });
  }
}
