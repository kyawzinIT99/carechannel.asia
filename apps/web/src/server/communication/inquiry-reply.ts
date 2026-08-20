import {
  HOSPITAL_PROFILE,
  INTERPRETER_LANGUAGES,
  PARTNER_CHANNEL,
  VISIT_SITES,
  flattenSpecialties,
  type SpecialtySeed,
} from "@/catalog/hospital-source";
import { composePatientReply } from "@/server/communication/chatgpt";
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

const PACKAGE_HINTS =
  /package|promotion|promo|price|checkup|check-up|health check|standard|advance|premium|3300|9500|12500|13500|18500|ပက်ကေ့|စစ်ဆေး|โปร|แพ็ก|ตรวจสุขภาพ/i;

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
  return merged.slice(0, 4);
}

function matchPackages(input: InquiryReplyInput, catalog: PublicPackage[]) {
  const showAll = Boolean(input.packageCode) || PACKAGE_HINTS.test(haystack(input));
  if (!showAll) return [] as PublicPackage[];
  if (!input.packageCode) return catalog;
  const first = catalog.filter((pkg) => pkg.code === input.packageCode);
  const rest = catalog.filter((pkg) => pkg.code !== input.packageCode);
  return [...first, ...rest];
}

function money(value: string) {
  return `${Number(value).toLocaleString()} THB`;
}

export async function buildInquiryReply(input: InquiryReplyInput): Promise<InquiryReply> {
  const locale = input.locale;
  const catalog = await loadPublicPackages();
  const packages = matchPackages(input, catalog);
  const specialties = matchSpecialties(input);
  const extras = [
    input.airportPickup
      ? locale === "my"
        ? "လေဆိပ်ကား ကြိုဆိုရန် တောင်းဆိုထားသည် (ပက်ကေ့ချ်တွင် မပါဝင်ပါ)။"
        : "Airport pickup requested (not included in checkup packages)."
      : "",
    input.accommodationHelp
      ? locale === "my"
        ? "အငှားတိုက်ခန်း အကူအညီ တောင်းထားသည် (ဟိုတယ်ပက်ကေ့ချ် မဟုတ်၊ လိုမှသာ၊ ပုံမှန် ၃,၅၀၀ သို့မဟုတ် ၄,၀၀၀ ဘတ်)။"
        : "Help requested with a simple rental apartment if the visitor wants one (not a hotel package; typically 3,500 or 4,000 THB at the partner apartment site)."
      : "",
    input.visaHelp
      ? locale === "my"
        ? "ကြာရှည် ဗီဇာ အကူအညီကို ဧည့်သည်က တောင်းထားသည်။ ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှသာ ပြန်ကြားပါ။ ဗီဇာရုံး ဖုန်း/အီးမေးလ် မပို့ပါ။"
        : "Long-stay visa help was requested because the visitor asked. Reply via this website, LINE, Telegram, or Viber. Do not send a visa office phone or email."
      : "",
    input.interpreterNeeded
      ? locale === "my"
        ? `ဆေးဘာသာပြန် တောင်းဆိုထားသည်: ${input.interpreterLang || "yes"}။ ဆေးရုံဖော်ပြ ဘာသာများ: ${INTERPRETER_LANGUAGES.join(", ")}`
        : `Interpreter requested: ${input.interpreterLang || "yes"}. Hospital-published languages: ${INTERPRETER_LANGUAGES.join(", ")}`
      : "",
  ].filter(Boolean);

  const intents = [
    ...(packages.length ? ["packages"] : []),
    ...specialties.map((item) => item.slug),
    ...(input.interpreterNeeded ? ["interpreter"] : []),
    ...(input.airportPickup ? ["airport-pickup"] : []),
    ...(input.accommodationHelp ? ["accommodation"] : []),
    ...(input.visaHelp ? ["visa-support"] : []),
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

  const copy =
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
      packageNames: facts.packages.map((pkg) => pkg.name),
      specialtyNames: facts.specialties.map((item) => item.name),
      extras,
    });

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
    specialtySlug: input.specialtySlug,
    packageCode: input.packageCode,
    preferredDate: input.preferredDate,
    interpreter: input.interpreterNeeded ? input.interpreterLang || "yes" : "no",
    message: input.message,
    intents,
    guestHtml,
  });
  const telegramText = renderStaffTelegramHtml({
    fullName: input.fullName,
    phone: input.phone,
    country: input.country,
    returningPatient: input.returningPatient,
    packageCode: input.packageCode,
    specialtySlug: input.specialtySlug,
    message: input.message,
    copy,
    extras,
  });
  const staffText = `Partner portal inquiry\nName: ${input.fullName}\nPhone: ${input.phone}\nEmail: ${input.email || ""}\nCountry: ${input.country || ""}\nReturning patient: ${input.returningPatient ? "yes" : "no"}\nSpecialty: ${input.specialtySlug || ""}\nPackage: ${input.packageCode || ""}\nDate: ${input.preferredDate || ""}\nInterpreter: ${input.interpreterNeeded ? input.interpreterLang || "yes" : "no"}\nMessage: ${input.message}\nIntents: ${intents.join(", ") || "general"}\n\nGuest reply:\n${guestText}`;

  return {
    intents,
    guestSubject:
      locale === "my"
        ? "ချင်းမိုင်ရမ် မိတ်ဖက်လမ်းကြောင်း — သင့်ခရီးစဉ် တောင်းဆိုမှု"
        : "Chiangmai Ram partner channel — your visit request",
    guestText,
    guestHtml,
    staffSubject: `Ram Hospital inquiry — ${input.fullName}`,
    staffText,
    staffHtml,
    telegramText,
  };
}
