import { PrismaClient, Role, Locale } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CHECKUP_PACKAGES_2026,
  HOSPITAL_PROFILE,
  PACKAGE_NOTES,
  SPECIALTIES,
  VISIT_SITES,
  packageFeatureLines,
  type SpecialtySeed,
} from "../src/catalog/hospital-source";
import { ABOUT_FIELDS } from "../src/catalog/about-copy";

const prisma = new PrismaClient();

async function upsertSpecialty(item: SpecialtySeed, parentId?: string) {
  const row = await prisma.specialty.upsert({
    where: { slug: item.slug },
    update: {
      sourceUrl: item.sourceUrl,
      imagePath: item.imagePath,
      phone: item.phone,
      hoursEn: item.hoursEn,
      hoursMy: item.hoursMy,
      nameEn: item.nameEn,
      nameMy: item.nameMy,
      nameTh: item.nameTh,
      summaryEn: item.summaryEn,
      summaryMy: item.summaryMy,
      servicesEn: item.servicesEn,
      servicesMy: item.servicesMy,
      sortOrder: item.sortOrder,
      parentId,
      published: true,
    },
    create: {
      slug: item.slug,
      sourceUrl: item.sourceUrl,
      imagePath: item.imagePath,
      phone: item.phone,
      hoursEn: item.hoursEn,
      hoursMy: item.hoursMy,
      nameEn: item.nameEn,
      nameMy: item.nameMy,
      nameTh: item.nameTh,
      summaryEn: item.summaryEn,
      summaryMy: item.summaryMy,
      servicesEn: item.servicesEn,
      servicesMy: item.servicesMy,
      sortOrder: item.sortOrder,
      parentId,
      published: true,
    },
  });
  for (const child of item.children ?? []) {
    await upsertSpecialty(child, row.id);
  }
}

const templates: { key: string; locale: Locale; subject: string; body: string }[] = [
  {
    key: "inquiry.received",
    locale: "en",
    subject: "Chiangmai Ram Hospital Myanmar received your request",
    body: "Dear {{name}},\n\nWe received your request on the official Myanmar partner channel. A coordinator will continue with you by email and Telegram about the incentive visit plan, published packages, or the specialty you asked about. We do not diagnose by message.\n\nHospital email: {{email}}\nFacebook: ChiangmaiRam.myanmar\n\nChiangmai Ram Hospital Myanmar",
  },
  {
    key: "inquiry.received",
    locale: "my",
    subject: "ချင်းမိုင်ရမ်ဆေးရုံ သင့်တောင်းဆိုမှု လက်ခံပြီး",
    body: "{{name}} ခင်ဗျာ/ရှင်၊\n\nမြန်မာမိတ်ဖက်လမ်းကြောင်းမှ သင့်တောင်းဆိုမှုကို လက်ခံပါသည်။ ညှိနှိုင်းရေးမှူးက incentive ခရီးစဉ်၊ ဖော်ပြထားသော ပက်ကေ့ချ် သို့မဟုတ် သင်မေးသော ဌာနအကြောင်းကို အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက် ပြောပါမည်။ မက်ဆေ့ချ်ဖြင့် ရောဂါမရှာပါ။\n\nဆေးရုံအီးမေးလ်: {{email}}\nFacebook: ChiangmaiRam.myanmar\n\nချင်းမိုင်ရမ်ဆေးရုံ",
  },
  {
    key: "staff.inquiry.alert",
    locale: "en",
    subject: "New Myanmar portal inquiry",
    body: "New inquiry from {{name}}\nPhone: {{phone}}\nEmail: {{email}}\nSpecialty: {{specialty}}\nPackage: {{packageName}}\nMessage: {{message}}",
  },
  {
    key: "telegram.help",
    locale: "en",
    subject: "Help",
    body: "Chiangmai Ram Hospital Myanmar — official partner channel for Myanmar and other visitors on the incentive visit plan. This bot repeats hospital-published packages and booking help. It does not diagnose. A coordinator continues by email and Telegram.\n\nEmail: {{email}}",
  },
  {
    key: "telegram.help",
    locale: "my",
    subject: "အကူအညီ",
    body: "ချင်းမိုင်ရမ်ဆေးရုံ — မြန်မာနှင့် အခြားဧည့်သည်များအတွက် တရားဝင် မိတ်ဖက်လမ်းကြောင်း။ ဤဘော့သည် ဆေးရုံထုတ်ပြန်သော ပက်ကေ့ချ်နှင့် ကြိုတင်စာရင်းအကူအညီသာ ပြန်ကြားသည်။ ရောဂါမရှာပါ။ ညှိနှိုင်းရေးမှူးက အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်ပြောပါမည်။\n\nအီးမေးလ်: {{email}}",
  },
  {
    key: "appointment.confirmed",
    locale: "en",
    subject: "Your Chiangmai Ram appointment request was confirmed",
    body: "Dear {{name}},\n\nA coordinator confirmed your appointment request on the incentive visit plan. Please arrive with your passport or ID. We will keep talking with you by email and Telegram if anything changes. This message is not medical advice.\n\nEmail: {{email}}",
  },
  {
    key: "appointment.confirmed",
    locale: "my",
    subject: "ချင်းမိုင်ရမ် ချိန်းဆိုမှု အတည်ပြုပြီး",
    body: "{{name}} ခင်ဗျာ/ရှင်၊\n\nညှိနှိုင်းရေးမှူးက incentive ခရီးစဉ် ချိန်းဆို တောင်းဆိုမှုကို အတည်ပြုပါသည်။ နိုင်ငံကူးလက်မှတ် သို့မဟုတ် အထောက်အထား ယူလာပါ။ ပြောင်းလဲမှုရှိပါက အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်ပြောပါမည်။ ဤမက်ဆေ့ချ်သည် ဆေးအကြံ မဟုတ်ပါ။\n\nအီးမေးလ်: {{email}}",
  },
  {
    key: "appointment.reminder",
    locale: "en",
    subject: "Appointment reminder — Chiangmai Ram Hospital Myanmar",
    body: "Dear {{name}},\n\nThis is a reminder of your confirmed visit on the partner incentive plan. Reply to this email or Telegram if you must change the time. Email: {{email}}.",
  },
  {
    key: "appointment.reminder",
    locale: "my",
    subject: "ချိန်းဆိုမှု သတိပေးချက် — ချင်းမိုင်ရမ်ဆေးရုံ",
    body: "{{name}} ခင်ဗျာ/ရှင်၊\n\nမိတ်ဖက် incentive ခရီးစဉ် အတည်ပြုပြီးသော လာရောက်မှု သတိပေးချက်ဖြစ်သည်။ အချိန်ပြောင်းရန် ဤအီးမေးလ် သို့မဟုတ် Telegram ကို ပြန်ကြားပါ။ အီးမေးလ်: {{email}}။",
  },
];

async function main() {
  await prisma.hospitalProfile.deleteMany();
  await prisma.hospitalProfile.create({
    data: {
      legalNameTh: HOSPITAL_PROFILE.legalNameTh,
      nameEn: HOSPITAL_PROFILE.nameEn,
      nameMy: HOSPITAL_PROFILE.nameMy,
      addressEn: HOSPITAL_PROFILE.addressEn,
      addressMy: HOSPITAL_PROFILE.addressMy,
      mainPhone: HOSPITAL_PROFILE.mainPhone,
      emergencyPhone: HOSPITAL_PROFILE.emergencyPhone,
      cardiacPhone: HOSPITAL_PROFILE.cardiacPhone,
      email: HOSPITAL_PROFILE.email,
      website: HOSPITAL_PROFILE.website,
      facebookUrl: HOSPITAL_PROFILE.facebookUrl,
      logoPath: HOSPITAL_PROFILE.logoPath,
      mapPath: HOSPITAL_PROFILE.mapPath,
      heroPath: HOSPITAL_PROFILE.heroPath,
      locationNoteEn: HOSPITAL_PROFILE.locationNoteEn,
      locationNoteMy: HOSPITAL_PROFILE.locationNoteMy,
      sourceNote: HOSPITAL_PROFILE.sourceNote,
    },
  });

  for (const spec of SPECIALTIES) {
    await upsertSpecialty(spec);
  }

  const catalog = await prisma.packageCatalog.upsert({
    where: { code: "HEALTH_CHECKUP_2026" },
    update: {
      sourceUrl: "https://chiangmairam.com/news_detail/970",
      nameEn: "Health Check Up Package 2026",
      nameMy: "၂၀၂၆ နှစ်စဉ်ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်",
      validFrom: new Date("2026-01-01T00:00:00+07:00"),
      validTo: new Date("2026-12-31T23:59:59+07:00"),
      notesEn: PACKAGE_NOTES.en,
      notesMy: PACKAGE_NOTES.my,
    },
    create: {
      code: "HEALTH_CHECKUP_2026",
      sourceUrl: "https://chiangmairam.com/news_detail/970",
      nameEn: "Health Check Up Package 2026",
      nameMy: "၂၀၂၆ နှစ်စဉ်ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်",
      validFrom: new Date("2026-01-01T00:00:00+07:00"),
      validTo: new Date("2026-12-31T23:59:59+07:00"),
      notesEn: PACKAGE_NOTES.en,
      notesMy: PACKAGE_NOTES.my,
    },
  });

  for (const pkg of CHECKUP_PACKAGES_2026) {
    const features = packageFeatureLines(pkg.code);
    await prisma.package.upsert({
      where: { code: pkg.code },
      update: { ...pkg, ...features, catalogId: catalog.id, published: true },
      create: { ...pkg, ...features, catalogId: catalog.id, published: true },
    });
  }

  for (const t of templates) {
    await prisma.messageTemplate.upsert({
      where: { key_locale: { key: t.key, locale: t.locale } },
      update: { subject: t.subject, body: t.body },
      create: t,
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@chiangmairam.local";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe_RamHospital_2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, name: "Hospital Admin", isActive: true },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Hospital Admin",
      locale: "en",
    },
  });
  await prisma.userRole.deleteMany({ where: { userId: admin.id } });
  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, role: Role.SUPER_ADMIN },
      { userId: admin.id, role: Role.HOSPITAL_ADMIN },
      { userId: admin.id, role: Role.INTERNATIONAL_COORDINATOR },
    ],
  });

  const siteContent: { key: string; valueEn: string; valueMy: string }[] = [
    {
      key: "home.heroEyebrow",
      valueEn: "Official Myanmar Partner Channel",
      valueMy: "တရားဝင် မြန်မာ မိတ်ဖက်လမ်းကြောင်း",
    },
    {
      key: "home.heroTitle",
      valueEn: "Your visit to Chiangmai Ram starts here",
      valueMy: "ချင်းမိုင်ရမ် ခရီးစဉ်ကို ဤနေရာမှ စတင်ပါ",
    },
    {
      key: "home.heroHighlight",
      valueEn: "Packages, centres, and coordinator support — before you travel.",
      valueMy: "ပက်ကေ့ချ်၊ ဌာနနှင့် ညှိနှိုင်းရေးမှူး အကူအညီ — ခရီးမထွက်မီ။",
    },
    {
      key: "home.heroBody",
      valueEn:
        "Plan your incentive visit with hospital-published 2026 check-up packages and specialty centres. A coordinator follows up by email and Telegram.",
      valueMy:
        "ဆေးရုံထုတ်ပြန်သည့် ၂၀၂၆ စစ်ဆေးပက်ကေ့ချ်နှင့် ဌာနများဖြင့် incentive ခရီးစဉ်ကို စီစဉ်ပါ။ ညှိနှိုင်းရေးမှူးက အီးမေးလ်နှင့် Telegram ဖြင့် ဆက်လက်ကူညီမည်။",
    },
    {
      key: "home.ctaPrimary",
      valueEn: "Request a visit",
      valueMy: "လာရောက်ရန် တောင်းဆိုမည်",
    },
    {
      key: "home.ctaSecondary",
      valueEn: "See 2026 packages",
      valueMy: "၂၀၂၆ ပက်ကေ့ချ်များ",
    },
    {
      key: "home.facebookNote",
      valueEn: "Updates also appear on Facebook: ChiangmaiRam.myanmar",
      valueMy: "သတင်းများကို Facebook ChiangmaiRam.myanmar တွင်လည်း ကြည့်နိုင်သည်",
    },
    {
      key: "visit.pickupTitle",
      valueEn: "Airport pickup",
      valueMy: "လေဆိပ်ကား ကြိုဆိုခြင်း",
    },
    {
      key: "visit.pickupBody",
      valueEn:
        "A coordinator can arrange pickup from Chiang Mai Airport to the hospital campus or your stay. This is a partner visit service — it is not included in STANDARD, ADVANCE, or PREMIUM checkup prices.",
      valueMy:
        "ချင်းမိုင်လေဆိပ်မှ ဆေးရုံ သို့မဟုတ် နေထိုင်မည့်နေရာသို့ ကြိုဆိုကား စီစဉ်ပေးနိုင်သည်။ ဤသည် မိတ်ဖက်ခရီးစဉ် အကူအညီဖြစ်ပြီး STANDARD၊ ADVANCE၊ PREMIUM စစ်ဆေးပက်ကေ့ချ် စျေးနှုန်းတွင် မပါဝင်ပါ။",
    },
    {
      key: "visit.stayTitle",
      valueEn: "Rental apartment nearby",
      valueMy: "အနီးအနား အငှားတိုက်ခန်း",
    },
    {
      key: "visit.stayBody",
      valueEn:
        "If you wish, a coordinator can help you find a simple rental apartment near the visit. This is not a hotel, and it is not a hospital or checkup package. Typical rates on the partner apartment site are 3,500 or 4,000 THB. Only if you want it — tell us on the request form, LINE, Telegram, or Viber.",
      valueMy:
        "လိုပါက ညှိနှိုင်းရေးမှူးက ခရီးစဉ်အနီး ရိုးရိုး အငှားတိုက်ခန်း ရှာပေးနိုင်သည်။ ဟိုတယ် မဟုတ်၊ ဆေးရုံ သို့မဟုတ် စစ်ဆေးပက်ကေ့ချ်လည်း မဟုတ်ပါ။ မိတ်ဖက်တိုက်ခန်းဝက်ဘ်ဆိုက်တွင် ပုံမှန်အားဖြင့် ၃,၅၀၀ သို့မဟုတ် ၄,၀၀၀ ဘတ်။ လိုမှသာ တောင်းဆိုဖောင်၊ LINE၊ Telegram သို့မဟုတ် Viber တွင် ပြောပါ။",
    },
    ...ABOUT_FIELDS.map((f) => ({
      key: f.key,
      valueEn: f.fallbackEn,
      valueMy: f.fallbackMy,
    })),
  ];

  for (const row of siteContent) {
    await prisma.siteContent.upsert({
      where: { key: row.key },
      update: row.key.startsWith("visit.stay")
        ? { valueEn: row.valueEn, valueMy: row.valueMy }
        : {},
      create: row,
    });
  }

  const promoCount = await prisma.promotion.count();
  if (promoCount === 0) {
    await prisma.promotion.create({
      data: {
        titleEn: "2026 hospital-published check-up packages",
        titleMy: "၂၀၂၆ ဆေးရုံထုတ်ပြန် ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်",
        bodyEn:
          "STANDARD, ADVANCE, and PREMIUM follow the hospital 2026 table. A coordinator confirms the official incentive amount on this website, LINE, Telegram, or Viber. Airport pickup and a rental apartment are optional help if you want them — not a hotel or checkup package.",
        bodyMy:
          "STANDARD၊ ADVANCE နှင့် PREMIUM သည် ဆေးရုံ ၂၀၂၆ ဇယားအတိုင်းဖြစ်သည်။ ညှိနှိုင်းရေးမှူးက တရားဝင် incentive ပမာဏကို ဤဝက်ဘ်ဆိုက်၊ LINE၊ Telegram သို့မဟုတ် Viber မှ အတည်ပြုသည်။ လေဆိပ်ကားနှင့် အငှားတိုက်ခန်းသည် လိုမှသာ အကူအညီဖြစ်ပြီး ဟိုတယ် သို့မဟုတ် စစ်ဆေးပက်ကေ့ချ် မဟုတ်ပါ။",
        published: true,
        sortOrder: 10,
      },
    });
  }

  // Seed branches from VISIT_SITES catalog
  for (const [i, site] of VISIT_SITES.entries()) {
    await prisma.branch.upsert({
      where: { code: site.code },
      update: {
        nameEn: site.nameEn,
        nameMy: site.nameMy,
        detailEn: site.detailEn,
        detailMy: site.detailMy,
        mapQuery: site.mapQuery,
        status: site.status,
        sortOrder: (i + 1) * 10,
        published: true,
      },
      create: {
        code: site.code,
        nameEn: site.nameEn,
        nameMy: site.nameMy,
        detailEn: site.detailEn,
        detailMy: site.detailMy,
        mapQuery: site.mapQuery,
        status: site.status,
        sortOrder: (i + 1) * 10,
        published: true,
      },
    });
  }

  console.log("Seed complete. Admin:", adminEmail);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
