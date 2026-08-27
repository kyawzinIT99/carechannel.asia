import { z } from "zod";
import { Locale } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { dispatchInquiryConversation } from "@/server/automation/dispatch";
import { buildInquiryReply } from "@/server/communication/inquiry-reply";
import { flattenSpecialties, CHECKUP_PACKAGES_2026, packageFeatureLines } from "@/catalog/hospital-source";
import { COUNTRIES } from "@/catalog/countries";
import { assignVisitorCode, normalizeVisitorCode } from "@/server/inquiries/visitor-code";
import { normalizePassport, pickEmailFromRecord, pickPassportFromRecord } from "@/server/inquiries/passport";

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
  source: z.enum(["website", "google_form"]).optional(),
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

function asText(value: unknown): string {
  if (Array.isArray(value) && value[0] != null) return String(value[0]).trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value == null || typeof value === "object") return "";
  return String(value).trim();
}

const COUNTRY_ALIASES: Record<string, (typeof COUNTRIES)[number]> = {
  burma: "Myanmar",
  burmese: "Myanmar",
  myanmar: "Myanmar",
  mm: "Myanmar",
  mya: "Myanmar",
  thai: "Thailand",
  thailand: "Thailand",
  th: "Thailand",
  siam: "Thailand",
  usa: "United States",
  us: "United States",
  america: "United States",
  uk: "United Kingdom",
  britain: "United Kingdom",
  england: "United Kingdom",
  uae: "United Arab Emirates",
  korea: "Korea, South",
  "south korea": "Korea, South",
  "viet nam": "Vietnam",
};

function normalizeCountry(value: string | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "Myanmar";
  if (/မြန်မာ|burm|myanmar/i.test(raw) || /^\s*mm\s*$/i.test(raw)) return "Myanmar";
  const lower = raw.toLowerCase();
  const aliased = COUNTRY_ALIASES[lower];
  if (aliased) return aliased;
  const hit = (COUNTRIES as readonly string[]).find((row) => row.toLowerCase() === lower);
  return hit || "Myanmar";
}

function normalizePhone(value: unknown) {
  const mmDigits = "၀၁၂၃၄၅၆၇၈၉";
  let raw = asText(value);
  raw = raw.replace(/[၀-၉]/g, (ch) => String(Math.max(0, mmDigits.indexOf(ch))));
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (cleaned.length >= 6 && cleaned.length <= 40) return cleaned;
  return raw.slice(0, 40);
}

function isTruthyFlag(value: unknown) {
  if (value === true || value === 1) return true;
  return /^(true|yes|1|on|ရှိ)$/i.test(asText(value));
}

function parseJsonish(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return raw;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return raw;
  }
}

/** Google Form dates: 11/04/1988, 11-4-88, 1988-04-11. Skip impossible years like 988. */
function parseLooseDate(raw: string): string | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = Number(iso[1]);
    if (year >= 1900 && year <= 2100) return `${iso[1]}-${iso[2]}-${iso[3]}`;
    return undefined;
  }
  const slash = value.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (slash) {
    let year = Number(slash[3]);
    if (year < 100) year += year >= 30 ? 1900 : 2000;
    if (year < 1900 || year > 2100) return undefined;
    const first = Number(slash[1]);
    const second = Number(slash[2]);
    const day = first > 12 ? first : second > 12 ? second : first;
    const month = first > 12 ? second : second > 12 ? first : second;
    if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime()) && parsed.getFullYear() >= 1900 && parsed.getFullYear() <= 2100) {
    return parsed.toISOString().slice(0, 10);
  }
  return undefined;
}

function hoistInquiryPayload(raw: unknown) {
  const parsed = parseJsonish(raw);
  if (!parsed || typeof parsed !== "object") return parsed;
  const rec = { ...(parsed as Record<string, unknown>) };
  const nested = parseJsonish(rec.body);
  if (nested && typeof nested === "object") {
    Object.assign(rec, nested as Record<string, unknown>);
  }
  if (!asText(rec.fullName)) {
    rec.fullName = pickStr(rec, ["Full Name (Passport)", "Name", "name", "full_name"]);
  } else {
    rec.fullName = asText(rec.fullName);
  }
  rec.phone = normalizePhone(rec.phone || pickStr(rec, ["Phone Number or Viber", "Phone or viber Number", "Phone", "mobile", "tel"]));
  rec.email = asText(rec.email || pickEmailFromRecord(rec));
  if (rec.email && !z.string().email().safeParse(rec.email).success) rec.email = "";
  rec.country = normalizeCountry(asText(rec.country) || pickStr(rec, ["Nationality", "nationality", "Country"]));
  rec.locale = asText(rec.locale).toLowerCase() === "my" ? "my" : "en";
  rec.consent = isTruthyFlag(rec.consent) ? true : rec.consent;
  rec.returningPatient = rec.returningPatient == null ? false : isTruthyFlag(rec.returningPatient);
  const passport = pickPassportFromRecord(rec);
  if (passport) rec.passportNo = passport;
  let message = asText(rec.message) || pickStr(rec, ["Symptoms or Health Concerns", "Resident Address", "Message"]);
  if (message.length < 4) message = "Visit request (Google Form)";
  const gender = pickStr(rec, ["Gender", "Sex"]);
  const dobRaw = pickStr(rec, ["Date of Birth", "Birth date", "DOB", "dateOfBirth"]);
  for (const line of [gender ? `Gender: ${gender}` : "", dobRaw ? `Date of birth: ${dobRaw}` : ""].filter(Boolean)) {
    if (!message.includes(line)) message = `${message}\n${line}`;
  }
  rec.message = message.slice(0, 4000);
  const preferred = asText(rec.preferredDate);
  if (preferred) rec.preferredDate = parseLooseDate(preferred) || preferred;
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

  const guestEmail = String(data.email || "").trim().toLowerCase();
  let reply: Awaited<ReturnType<typeof buildInquiryReply>> | null = null;
  try {
    reply = await buildInquiryReply({
      locale: data.locale,
      fullName: data.fullName,
      phone: data.phone,
      email: guestEmail.includes("@") ? guestEmail : undefined,
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
  } catch (err) {
    console.error("inquiry reply compose failed", err);
  }
  if (reply) {
    try {
      await dispatchInquiryConversation({
        locale,
        guestEmail: guestEmail.includes("@") ? guestEmail : undefined,
        ...reply,
      });
    } catch (err) {
      console.error("inquiry mail dispatch failed", err);
    }
  }

  return inquiry;
}

function pickStr(raw: Record<string, unknown>, keys: string[]) {
  const bag: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(raw)) bag[key.trim().toLowerCase()] = val;
  for (const key of keys) {
    const hit = asText(bag[key.trim().toLowerCase()]);
    if (hit) return hit;
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
  const fullName = pickStr(nested, ["fullName", "Full Name (Passport)", "name", "Name", "full_name"]);
  const phone = pickStr(nested, ["phone", "Phone", "Phone Number or Viber", "Phone or viber Number", "mobile", "tel"]);
  const email = pickEmailFromRecord(nested) || pickStr(nested, ["email", "Email", "Email Address"]);
  const address = pickStr(nested, ["Resident Address", "address", "Address"]);
  const message =
    pickStr(nested, ["message", "Message", "Symptoms or Health Concerns", "comment", "notes"]) ||
    (address ? `Resident address: ${address}` : "Google Form visit request");
  const locale = pickStr(nested, ["locale", "language"]) === "my" ? "my" : "en";
  const specialtySlugRaw = pickStr(nested, ["specialtySlug", "specialty"]);
  const specialtySlug = allSlugs().includes(specialtySlugRaw) ? specialtySlugRaw : undefined;
  const packageCode = pickStr(nested, ["packageCode", "package"]) || undefined;
  const visitorCode = pickStr(nested, ["visitorCode", "Visitor code", "Code", "Incentive code"]) || undefined;
  const passportNo = pickPassportFromRecord(nested) || undefined;
  try {
    return await createInquiry({
      source: "google_form",
      locale,
      fullName: fullName.length >= 2 ? fullName : "Google Form visitor",
      phone: phone.length >= 6 ? phone : "000000",
      email: email.includes("@") ? email : "",
      country: normalizeCountry(
        pickStr(nested, ["country", "Country", "nationality", "Nationality"]),
      ),
      returningPatient: /yes|true|1|ရှိ/i.test(pickStr(nested, ["returningPatient", "returning"])),
      message: message.slice(0, 4000),
      specialtySlug,
      packageCode,
      visitorCode,
      passportNo,
      consent: true,
    });
  } catch {
    return createInquiry({
      source: "google_form",
      locale,
      fullName: fullName.length >= 2 ? fullName : "Google Form visitor",
      phone: phone.length >= 6 ? phone : "000000",
      email: email.includes("@") ? email : "",
      country: "Myanmar",
      returningPatient: false,
      message: message.slice(0, 4000),
      consent: true,
      passportNo,
    });
  }
}
