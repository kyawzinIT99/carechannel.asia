const FORM_ID = "1nLGeHgj-IhYtgzPw2Bi7spUQW9rRnrHd1Fa4GZ7y3yQ";
const N8N_WEBHOOK = "https://n8n-al8a.srv1707349.hstgr.cloud/webhook/ram-hospital-google-form";

function getForm() {
  try {
    const active = FormApp.getActiveForm();
    if (active) return active;
  } catch (e) {
    /* standalone script */
  }
  return FormApp.openById(FORM_ID);
}

function pickNamed(nv, title) {
  const want = String(title || "").trim().toLowerCase();
  for (const key of Object.keys(nv || {})) {
    if (String(key).trim().toLowerCase() === want) {
      const row = nv[key];
      return Array.isArray(row) ? String(row[0] || "").trim() : String(row || "").trim();
    }
  }
  return "";
}

function pickFirst(nv, titles) {
  for (let i = 0; i < titles.length; i++) {
    const hit = pickNamed(nv, titles[i]);
    if (hit) return hit;
  }
  return "";
}

function pickPassport(nv) {
  const exact = pickFirst(nv, [
    "Passport Number",
    "Passport number",
    "Passport No",
    "Passport no",
    "Passport",
    "passportNo",
  ]);
  if (exact) return exact;
  for (const key of Object.keys(nv || {})) {
    if (/passport|နိုင်ငံကူးလက်မှတ်/i.test(String(key))) {
      const row = nv[key];
      const hit = Array.isArray(row) ? String(row[0] || "").trim() : String(row || "").trim();
      if (hit) return hit;
    }
  }
  return "";
}

function normalizeCountry(value) {
  const raw = String(value || "").trim();
  if (!raw) return "Myanmar";
  if (/မြန်မာ|burm|myanmar|\bmm\b/i.test(raw)) return "Myanmar";
  if (/thai|siam|\bth\b/i.test(raw)) return "Thailand";
  return raw.replace(/\w\S*/g, function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

function normalizePhone(value) {
  var s = String(value || "").trim();
  var mm = "၀၁၂၃၄၅၆၇၈၉";
  s = s.replace(/[၀-၉]/g, function (ch) {
    return String(mm.indexOf(ch));
  });
  var cleaned = s.replace(/[^\d+]/g, "");
  if (cleaned.length >= 6 && cleaned.length <= 40) return cleaned;
  return s.slice(0, 40);
}

/**
 * Run once from Apps Script: setupVisitorInstructions
 * Sets bilingual help text so visitors fill nationality, phone, and date of birth correctly.
 * Then Telegram receives the same "New inquiry" alert as website Request a visit.
 */
function setupVisitorInstructions() {
  const form = getForm();
  form.setTitle("Chiangmai Ram Hospital — Request a visit");
  form.setDescription(
    "Official partner visit request. A coordinator replies by email and Telegram — the same alert as the website Request a visit form.\n\n" +
      "တရားဝင် ခရီးစဉ် တောင်းဆိုမှု။ ဝက်ဘ်ဆိုက် Request a visit ကဲ့သို့ပင် coordinator က email နှင့် Telegram မှ ပြန်ကြားပါမည်။\n\n" +
      "For nationality choose Myanmar — do not type “burmese” or “myanmar”. Use the date picker for date of birth (4-digit year, e.g. 1988).\n" +
      "နိုင်ငံအတွက် Myanmar ကို ရွေးပါ။ burmese / myanmar လို့ မရိုက်ပါနှင့်။ မွေးနေ့တွင် ခုနှစ် ဂဏန်း ၄ လုံး သုံးပါ။",
  );
  form.setConfirmationMessage(
    "We received your visit request. A coordinator will continue with you by email and Telegram.\n" +
      "သင့်ခရီးစဉ် တောင်းဆိုမှု လက်ခံပါသည်။ Coordinator က email နှင့် Telegram မှ ဆက်သွယ်ပါမည်။",
  );
  form.setShowLinkToRespondAgain(false);

  const helps = [
    {
      match: /full name|passport\)/i,
      text: "Write the name exactly as on the passport.\nနိုင်ငံကူးလက်မှတ်ပါ အမည်အတိုင်း ရေးပါ။",
    },
    {
      match: /passport number/i,
      text: "Letters and numbers only, no spaces. Example: MF393930\nနိုင်ငံကူးလက်မှတ်နံပါတ်သာ။ space မထည့်ပါနှင့်။",
    },
    {
      match: /nationality/i,
      text: "Select Myanmar (not “burmese”). Thailand if your passport is Thai.\nMyanmar ကို ရွေးပါ။ burmese လို့ မရိုက်ပါနှင့်။",
    },
    {
      match: /gender/i,
      text: "As on your passport.\nနိုင်ငံကူးလက်မှတ်ပါအတိုင်း ရွေးပါ။",
    },
    {
      match: /phone|viber/i,
      text: "Digits only. Example: 09xxxxxxxx or 959xxxxxxxx\nဖုန်းနံပါတ်ကို ဂဏန်းသာ။",
    },
    {
      match: /birth|dob/i,
      text: "Use the date picker. Year must be 4 digits (1988), not 988.\nရက်စွဲ picker သုံးပါ။ ခုနှစ်ကို ဂဏန်း ၄ လုံး။",
    },
    {
      match: /email/i,
      text: "A real email so we can send the same visit confirmation as the website.\nအတည်ပြုစာ ပို့ရန် အီးမေးလ် အမှန် ရေးပါ။",
    },
    {
      match: /symptom|health|concern|message/i,
      text: "What visit do you want? A package is not required.\nဘယ်လို ခရီးစဉ် လိုချင်သည်ကို ရေးပါ။",
    },
  ];

  form.getItems().forEach(function (item) {
    const title = item.getTitle() || "";
    for (var i = 0; i < helps.length; i++) {
      if (helps[i].match.test(title)) {
        item.setHelpText(helps[i].text);
        break;
      }
    }
    if (!/nationality/i.test(title)) return;
    var type = item.getType();
    if (type === FormApp.ItemType.LIST) {
      item.asListItem().setChoiceValues(["Myanmar", "Thailand", "Other"]).setRequired(true);
    } else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      item.asMultipleChoiceItem().setChoiceValues(["Myanmar", "Thailand", "Other"]).setRequired(true);
    } else if (type === FormApp.ItemType.TEXT) {
      item.asTextItem().setRequired(true);
      item.setHelpText(
        "Type exactly Myanmar or Thailand. Do not type burmese.\nMyanmar သို့မဟုတ် Thailand ဟုသာ ရေးပါ။ burmese လို့ မရိုက်ပါနှင့်။",
      );
    }
  });
}

/**
 * Optional. n8n already reads the linked response sheet every minute.
 * Do not enable this trigger as well, or each visit is created twice.
 */
function onFormSubmit(e) {
  const nv = (e && e.namedValues) || {};
  const gender = pickFirst(nv, ["Gender", "Sex"]);
  const dob = pickFirst(nv, ["Date of Birth", "Birth date", "DOB"]);
  let message =
    pickFirst(nv, ["Symptoms or Health Concerns", "Resident Address", "Message"]) ||
    "Visit request (Google Form)";
  if (gender) message += "\nGender: " + gender;
  if (dob) message += "\nDate of birth: " + dob;
  UrlFetchApp.fetch(N8N_WEBHOOK, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      source: "google_form",
      fullName: pickFirst(nv, ["Full Name (Passport)", "Name", "Full name"]),
      email: pickFirst(nv, ["Email Address", "Email", "E-mail"]),
      phone: normalizePhone(pickFirst(nv, ["Phone Number or Viber", "Phone or viber Number", "Phone"])),
      country: normalizeCountry(pickNamed(nv, "Nationality") || "Myanmar"),
      passportNo: pickPassport(nv),
      message: message,
      locale: "en",
      consent: true,
      returningPatient: false,
    }),
    muteHttpExceptions: true,
  });
}
