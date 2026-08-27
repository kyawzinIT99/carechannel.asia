/**
 * Chiangmai Ram — Google Form helper
 *
 * Do NOT upload this file to Google Drive.
 *
 * Paste into the form's own Script editor:
 * 1. Open the form as the owner
 * 2. More (⋮) → Script editor
 * 3. Replace Code.gs with this file → Save
 * 4. Select setupVisitorInstructions → Run → Allow
 *
 * That run converts Nationality and Gender to dropdowns (same country list
 * as the website) and Date of Birth to a date picker.
 *
 * Do not add an onFormSubmit trigger. n8n already reads the sheet every minute.
 */

var NATIONALITY_CHOICES = [
  "Myanmar",
  "Thailand",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahrain",
  "Bangladesh",
  "Belarus",
  "Belgium",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Croatia",
  "Cyprus",
  "Czechia",
  "Denmark",
  "Egypt",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Korea, North",
  "Korea, South",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Malaysia",
  "Maldives",
  "Malta",
  "Mexico",
  "Moldova",
  "Mongolia",
  "Morocco",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Saudi Arabia",
  "Serbia",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "Spain",
  "Sri Lanka",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Timor-Leste",
  "Turkey",
  "Turkmenistan",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uzbekistan",
  "Vietnam",
  "Yemen",
  "Other"
];

var GENDER_CHOICES = ["Male", "Female", "Other"];

function getForm() {
  var form = FormApp.getActiveForm();
  if (!form) {
    throw new Error(
      "Open Script editor from the Google Form (⋮ → Script editor). Do not run this as a standalone Drive file."
    );
  }
  return form;
}

function helpFor(title) {
  if (/full name|passport\)/i.test(title)) {
    return "Write the name exactly as on the passport.\nနိုင်ငံကူးလက်မှတ်ပါ အမည်အတိုင်း ရေးပါ။";
  }
  if (/passport number/i.test(title)) {
    return "Letters and numbers only, no spaces. Example: MF393930\nနိုင်ငံကူးလက်မှတ်နံပါတ်သာ။ space မထည့်ပါနှင့်။";
  }
  if (/nationality/i.test(title)) {
    return "Choose your passport country. Myanmar is first. Do not type burmese.\nနိုင်ငံကူးလက်မှတ်ပါ နိုင်ငံကို ရွေးပါ။";
  }
  if (/gender/i.test(title)) {
    return "As on your passport.\nနိုင်ငံကူးလက်မှတ်ပါအတိုင်း ရွေးပါ။";
  }
  if (/phone|viber/i.test(title)) {
    return "Digits only. Example: 09xxxxxxxx or 959xxxxxxxx\nဖုန်းနံပါတ်ကို ဂဏန်းသာ။";
  }
  if (/birth|dob/i.test(title)) {
    return "Use the date picker. Year is 4 digits.\nရက်စွဲ picker သုံးပါ။";
  }
  if (/email/i.test(title)) {
    return "A real email so we can send the same visit confirmation as the website.\nအတည်ပြုစာ ပို့ရန် အီးမေးလ် အမှန် ရေးပါ။";
  }
  if (/symptom|health|concern|message/i.test(title)) {
    return "What visit do you want? A package is not required.\nဘယ်လို ခရီးစဉ် လိုချင်သည်ကို ရေးပါ။";
  }
  return "";
}

function replaceWithDropdown(form, item, choices, help) {
  var title = item.getTitle();
  var index = item.getIndex();
  var type = item.getType();
  if (type === FormApp.ItemType.LIST) {
    item.asListItem().setChoiceValues(choices).setHelpText(help).setRequired(true);
    return;
  }
  if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
    item.asMultipleChoiceItem().setChoiceValues(choices).setHelpText(help).setRequired(true);
    return;
  }
  form.deleteItem(item);
  var list = form.addListItem();
  list.setTitle(title).setHelpText(help).setRequired(true).setChoiceValues(choices);
  form.moveItem(list, index);
}

function replaceWithDate(form, item, help) {
  var title = item.getTitle();
  var index = item.getIndex();
  if (item.getType() === FormApp.ItemType.DATE) {
    item.asDateItem().setHelpText(help).setRequired(true);
    return;
  }
  form.deleteItem(item);
  var date = form.addDateItem();
  date.setTitle(title).setHelpText(help).setRequired(true);
  form.moveItem(date, index);
}

/** Run this once after pasting. It turns short answers into dropdowns / a date picker. */
function setupVisitorInstructions() {
  var form = getForm();
  form.setTitle("Chiangmai Ram Hospital visit request");
  form.setDescription(
    "Official partner visit request. A coordinator replies by email and Telegram — the same as the website Request a visit form.\n\n" +
      "တရားဝင် ခရီးစဉ် တောင်းဆိုမှု။ ဝက်ဘ်ဆိုက် Request a visit ကဲ့သို့ပင် coordinator က email နှင့် Telegram မှ ပြန်ကြားပါမည်။\n\n" +
      "Choose nationality from the list (Myanmar is first). Pick date of birth from the calendar.\n" +
      "နိုင်ငံကို စာရင်းမှ ရွေးပါ။ မွေးနေ့ကို ပြက္ခဒိန်မှ ရွေးပါ။"
  );
  form.setConfirmationMessage(
    "We received your visit request. A coordinator will continue with you by email and Telegram.\n" +
      "သင့်ခရီးစဉ် တောင်းဆိုမှု လက်ခံပါသည်။ Coordinator က email နှင့် Telegram မှ ဆက်သွယ်ပါမည်။"
  );
  form.setShowLinkToRespondAgain(false);

  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i];
    var title = item.getTitle() || "";
    var help = helpFor(title);
    if (/nationality/i.test(title)) {
      replaceWithDropdown(form, item, NATIONALITY_CHOICES, help);
    } else if (/gender/i.test(title)) {
      replaceWithDropdown(form, item, GENDER_CHOICES, help);
    } else if (/birth|dob/i.test(title)) {
      replaceWithDate(form, item, help);
    } else if (help) {
      item.setHelpText(help);
    }
  }
}

function pickNamed(nv, title) {
  var want = String(title || "").trim().toLowerCase();
  var keys = Object.keys(nv || {});
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i]).trim().toLowerCase() === want) {
      var row = nv[keys[i]];
      return Array.isArray(row) ? String(row[0] || "").trim() : String(row || "").trim();
    }
  }
  return "";
}

function pickFirst(nv, titles) {
  for (var i = 0; i < titles.length; i++) {
    var hit = pickNamed(nv, titles[i]);
    if (hit) return hit;
  }
  return "";
}

function pickPassport(nv) {
  var exact = pickFirst(nv, [
    "Passport Number",
    "Passport number",
    "Passport No",
    "Passport no",
    "Passport",
    "passportNo"
  ]);
  if (exact) return exact;
  var keys = Object.keys(nv || {});
  for (var i = 0; i < keys.length; i++) {
    if (/passport|နိုင်ငံကူးလက်မှတ်/i.test(String(keys[i]))) {
      var row = nv[keys[i]];
      var hit = Array.isArray(row) ? String(row[0] || "").trim() : String(row || "").trim();
      if (hit) return hit;
    }
  }
  return "";
}

function normalizeCountry(value) {
  var raw = String(value || "").trim();
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
 * Optional backup. n8n already reads the sheet every minute.
 * Do not add a form-submit trigger for this function.
 */
function onFormSubmit(e) {
  var nv = (e && e.namedValues) || {};
  var gender = pickFirst(nv, ["Gender", "Sex"]);
  var dob = pickFirst(nv, ["Date of Birth", "Birth date", "DOB"]);
  var message =
    pickFirst(nv, ["Symptoms or Health Concerns", "Resident Address", "Message"]) ||
    "Visit request (Google Form)";
  if (gender) message += "\nGender: " + gender;
  if (dob) message += "\nDate of birth: " + dob;
  UrlFetchApp.fetch("https://n8n-al8a.srv1707349.hstgr.cloud/webhook/ram-hospital-google-form", {
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
      returningPatient: false
    }),
    muteHttpExceptions: true
  });
}
