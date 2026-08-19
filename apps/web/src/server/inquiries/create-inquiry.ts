import { z } from "zod";
import { Locale } from "@prisma/client";
import { prisma } from "@/server/db/prisma";
import { dispatchInquiryConversation } from "@/server/automation/dispatch";
import { buildInquiryReply } from "@/server/communication/inquiry-reply";
import { flattenSpecialties } from "@/catalog/hospital-source";
import { COUNTRIES } from "@/catalog/countries";

function allSlugs() {
  return flattenSpecialties().map((item) => item.slug);
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
  consent: z.literal(true),
});

export async function createInquiry(raw: unknown, patientUserId?: string) {
  const data = inquirySchema.parse(raw);
  const locale = data.locale as Locale;

  if (data.specialtySlug && !allSlugs().includes(data.specialtySlug)) {
    throw new Error("Unknown specialty");
  }
  let packageId = data.packageId;
  if (data.packageCode) {
    const pkg = await prisma.package.findFirst({
      where: { code: data.packageCode, published: true },
    });
    if (!pkg) throw new Error("Unknown package");
    packageId = pkg.id;
  } else if (data.packageId) {
    const pkg = await prisma.package.findFirst({
      where: { id: data.packageId, published: true },
    });
    if (!pkg) {
      throw new Error("Unknown package");
    }
  }

  const inquiry = await prisma.inquiry.create({
    data: {
      locale,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email || null,
      country: data.country,
      returningPatient: data.returningPatient,
      message: data.message,
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
      preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
      interpreterNeeded: Boolean(data.interpreterNeeded),
      interpreterLang: data.interpreterLang || null,
      airportPickup: Boolean(data.airportPickup),
      accommodationHelp: Boolean(data.accommodationHelp),
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
  const nested = body.body && typeof body.body === "object" ? (body.body as Record<string, unknown>) : body;
  const fullName = pickStr(nested, ["fullName", "name", "Name", "full_name"]);
  const phone = pickStr(nested, ["phone", "Phone", "mobile", "tel"]);
  const email = pickStr(nested, ["email", "Email"]);
  const message = pickStr(nested, ["message", "Message", "comment", "notes"]) || "Google Form visit request";
  const locale = pickStr(nested, ["locale", "language"]) === "my" ? "my" : "en";
  const specialtySlugRaw = pickStr(nested, ["specialtySlug", "specialty"]);
  const specialtySlug = allSlugs().includes(specialtySlugRaw) ? specialtySlugRaw : undefined;
  const packageCode = pickStr(nested, ["packageCode", "package"]) || undefined;
  try {
    return await createInquiry({
      locale,
      fullName: fullName.length >= 2 ? fullName : "Google Form visitor",
      phone: phone.length >= 6 ? phone : "000000",
      email: email.includes("@") ? email : "",
      country: normalizeCountry(pickStr(nested, ["country", "Country"])),
      returningPatient: /yes|true|1|ရှိ/i.test(pickStr(nested, ["returningPatient", "returning"])),
      message: `[Google Form]\n${message}`.slice(0, 4000),
      specialtySlug,
      packageCode,
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
    });
  }
}
