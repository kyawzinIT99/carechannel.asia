import {
  HOSPITAL_PROFILE,
  PARTNER_CHANNEL,
  VISIT_SITES,
  flattenSpecialties,
  type SpecialtySeed,
} from "@/catalog/hospital-source";
import { composePatientReply, type PatientReplyCopy } from "@/server/communication/chatgpt";
import {
  fallbackPatientCopy,
  renderGuestEmailHtml,
  renderGuestEmailText,
  renderStaffEmailHtml,
  renderStaffTelegramHtml,
} from "@/server/communication/message-format";
import { messengerFooterText } from "@/catalog/partner-messengers";
import { loadPublicPackages } from "@/server/content/public";
import { stringList } from "@/server/db/json-list";

type PublicPackage = Awaited<ReturnType<typeof loadPublicPackages>>[number];

export type InquiryReplyInput = {
  locale: "en" | "my";
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  returningPatient?: boolean;
  message: string;
  specialtySlug?: string;
  packageCode?: string;
  visitSite?: "SRIPOOM" | "CHAROEN_MUEANG";
  interpreterNeeded?: boolean;
  interpreterLang?: string;
  airportPickup?: boolean;
  accommodationHelp?: boolean;
  visaHelp?: boolean;
  visitorCode?: string;
  passportNo?: string;
  preferredDate?: string;
};

export type InquiryReply = {
  intents: string[];
  guestSubject: string;
  guestText: string;
  guestHtml: string;
  staffSubject: string;
  staffText: string;
  staffHtml: string;
  telegramText: string;
};

function haystack(input: InquiryReplyInput) {
  return [input.message, input.specialtySlug ?? "", input.packageCode ?? "", input.interpreterLang ?? ""]
    .join(" ")
    .toLowerCase();
}

const SPECIALTY_HINTS: Record<string, RegExp> = {
  "cardiac-balloon-center": /heart|cardiac|chest|balloon|cad|ekg|နှလုံး|ရင်ဘတ်|หัวใจ/,
  "stroke-center": /stroke|paralysis|brain|လေဖြတ်|อัมพาต/,
  "childrens-hospital": /child|paediatr|pediatr|vaccin|ကလေး|เด็ก/,
  "health-center": /health center|wellness|ကျန်းမာရေးစင်တာ/,
  "dental-center": /dental|tooth|teeth|invisalign|သွား|ทันต/,
  "skin-aesthetic-center": /skin|dermat|acne|laser|filler|အရေပြား|ผิว/,
  "checkup-center": /visa|check-up|checkup|vaccination|စစ်ဆေး/,
  "physical-therapy-center": /physio|rehab|back|knee|office syndrome|ကာယ|กายภาพ/,
  "chiangmai-ram-pharma": /pharma|pharmacy|medicine|ဆေးဆိုင်|ร้านยา/,
};

function matchSpecialties(input: InquiryReplyInput): SpecialtySeed[] {
  const all = flattenSpecialties();
  const selected = input.specialtySlug ? all.filter((item) => item.slug === input.specialtySlug) : [];
  const text = haystack(input);
  const hinted = all.filter((item) => SPECIALTY_HINTS[item.slug]?.test(text));
  const merged = [...selected];
  for (const item of hinted) {
    if (!merged.some((row) => row.slug === item.slug)) merged.push(item);
  }
  return merged.slice(0, 1);
}

function matchPackages(input: InquiryReplyInput, catalog: PublicPackage[]) {
  if (!input.packageCode) return [] as PublicPackage[];
  return catalog.filter((pkg) => pkg.code === input.packageCode).slice(0, 1);
}

function money(value: string) {
  return `${Number(value).toLocaleString()} THB`;
}

export async function buildInquiryReply(input: InquiryReplyInput): Promise<InquiryReply> {
  const locale = input.locale;
  let catalog: PublicPackage[] = [];
  try {
    catalog = await loadPublicPackages();
  } catch (err) {
    console.error("inquiry reply catalog failed", err);
  }
  const packages = matchPackages(input, catalog);
  const specialties = matchSpecialties(input);
  const extras = [
    input.visitorCode
      ? locale === "my"
        ? `ကုဒ် ${input.visitorCode}`
        : `Code ${input.visitorCode}`
      : "",
    input.airportPickup ? (locale === "my" ? "လေဆိပ်ကား တောင်းထားသည်" : "Airport pickup requested") : "",
    input.accommodationHelp ? (locale === "my" ? "နေထိုင်ရန် အကူအညီ တောင်းထားသည်" : "Stay help requested") : "",
    input.visaHelp ? (locale === "my" ? "ဗီဇာ အကူအညီ တောင်းထားသည်" : "Visa help requested") : "",
    input.interpreterNeeded
      ? locale === "my"
        ? `ဘာသာပြန်: ${input.interpreterLang || "yes"}`
        : `Interpreter: ${input.interpreterLang || "yes"}`
      : "",
  ].filter(Boolean);

  const intents = [
    ...(packages.length ? ["packages"] : []),
    ...specialties.map((item) => item.slug),
    ...(input.interpreterNeeded ? ["interpreter"] : []),
    ...(input.airportPickup ? ["airport-pickup"] : []),
    ...(input.accommodationHelp ? ["accommodation"] : []),
    ...(input.visaHelp ? ["visa-support"] : []),
    ...(input.visitorCode ? ["incentive-code"] : []),
    ...(input.passportNo ? ["passport"] : []),
  ];

  const facts = {
    guest: {
      name: input.fullName,
      country: input.country || "",
      returningPatient: Boolean(input.returningPatient),
      preferredDate: input.preferredDate || "",
    },
    partner: locale === "my" ? PARTNER_CHANNEL.my : PARTNER_CHANNEL.en,
    packages: packages.map((pkg) => ({
      name: locale === "my" ? pkg.nameMy : pkg.nameEn,
      sale: money(pkg.salePrice),
      list: money(pkg.listPrice),
    })),
    specialties: specialties.map((item) => ({
      name: locale === "my" ? item.nameMy : item.nameEn,
      summary: locale === "my" ? item.summaryMy : item.summaryEn,
      services: stringList(locale === "my" ? item.servicesMy : item.servicesEn).slice(0, 8),
    })),
    extras,
    stayHelp: {
      optional: true,
      hotel: false,
      checkupPackage: false,
      typicalThb: "3,500 or 4,000",
      apartmentUrl: "https://sddp-apartment.onrender.com",
    },
    messengers: {
      website: "this partner website request form",
      phone: HOSPITAL_PROFILE.chatPhoneDisplay,
      telegram: HOSPITAL_PROFILE.telegramUrl,
      line: HOSPITAL_PROFILE.lineUrl,
      viber: HOSPITAL_PROFILE.viberDisplay,
      viberUrl: HOSPITAL_PROFILE.viberUrl,
      note: messengerFooterText(locale),
    },
    location: locale === "my" ? HOSPITAL_PROFILE.locationNoteMy : HOSPITAL_PROFILE.locationNoteEn,
  };

  let copy: PatientReplyCopy;
  try {
    copy =
      (await composePatientReply({
        locale,
        visitorName: input.fullName,
        message: input.message,
        facts,
      })) ??
      fallbackPatientCopy({
        locale,
        fullName: input.fullName,
        message: input.message,
        visitorCode: input.visitorCode,
        packageNames: facts.packages.map((pkg) => pkg.name),
        specialtyNames: facts.specialties.map((item) => item.name),
        extras,
      });
  } catch {
    copy = fallbackPatientCopy({
      locale,
      fullName: input.fullName,
      message: input.message,
      visitorCode: input.visitorCode,
      packageNames: facts.packages.map((pkg) => pkg.name),
      specialtyNames: facts.specialties.map((item) => item.name),
      extras,
    });
  }

  const chosen = VISIT_SITES.find((site) => site.code === input.visitSite);
  const siteLine = chosen
    ? locale === "my"
      ? `ရွေးထားသော နေရာ: ${chosen.nameMy}${chosen.status === "opening_soon" ? " (မကြာမီ ဖွင့်မည်)" : ""}`
      : `Preferred site: ${chosen.nameEn}${chosen.status === "opening_soon" ? " (opening soon)" : ""}`
    : "";
  const channel = locale === "my" ? PARTNER_CHANNEL.my : PARTNER_CHANNEL.en;
  const location = locale === "my" ? HOSPITAL_PROFILE.locationNoteMy : HOSPITAL_PROFILE.locationNoteEn;

  const layout = {
    locale,
    copy,
    visitorMessage: input.message,
    visitorCode: input.visitorCode,
    siteLine,
    packageRows: facts.packages,
    specialtyBlocks: facts.specialties,
    extras,
    channel,
    location,
  };

  const guestHtml = renderGuestEmailHtml(layout);
  const guestText = renderGuestEmailText(layout);
  const staffHtml = renderStaffEmailHtml({
    fullName: input.fullName,
    phone: input.phone,
    email: input.email,
    country: input.country,
    returningPatient: input.returningPatient,
    visitorCode: input.visitorCode,
    passportNo: input.passportNo,
    specialtySlug: input.specialtySlug,
    packageCode: input.packageCode,
    preferredDate: input.preferredDate,
    interpreter: input.interpreterNeeded ? input.interpreterLang || "yes" : "no",
    message: input.message,
    intents,
  });
  const telegramText = renderStaffTelegramHtml({
    fullName: input.fullName,
    phone: input.phone,
    country: input.country,
    returningPatient: input.returningPatient,
    visitorCode: input.visitorCode,
    passportNo: input.passportNo,
    packageCode: input.packageCode,
    specialtySlug: input.specialtySlug,
    message: input.message,
    extras,
  });
  const staffText = [
    `New inquiry ${input.visitorCode || ""}`.trim(),
    input.fullName,
    `Passport: ${input.passportNo || "—"}`,
    `Phone: ${input.phone}`,
    input.email ? `Email: ${input.email}` : "",
    input.packageCode ? `Package: ${input.packageCode}` : "",
    input.specialtySlug ? `Centre: ${input.specialtySlug}` : "",
    extras.join(" · "),
    input.message.slice(0, 240),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    intents,
    guestSubject:
      locale === "my" ? "ချင်းမိုင်ရမ် — တောင်းဆိုမှု လက်ခံပါသည်" : "Chiangmai Ram — we received your request",
    guestText,
    guestHtml,
    staffSubject: `Ram Hospital inquiry — ${input.visitorCode || ""} ${input.fullName}`.trim(),
    staffText,
    staffHtml,
    telegramText,
  };
}
