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
  const want = String(title || "").trim();
  for (const key of Object.keys(nv || {})) {
    if (String(key).trim() === want) {
      const row = nv[key];
      return Array.isArray(row) ? String(row[0] || "").trim() : String(row || "").trim();
    }
  }
  return "";
}

function pickPassport(nv) {
  const titles = [
    "Passport Number",
    "Passport number",
    "Passport No",
    "Passport no",
    "Passport",
    "passportNo",
  ];
  for (let i = 0; i < titles.length; i++) {
    const hit = pickNamed(nv, titles[i]);
    if (hit) return hit;
  }
  for (const key of Object.keys(nv || {})) {
    if (/passport|နိုင်ငံကူးလက်မှတ်/i.test(String(key))) {
      const row = nv[key];
      const hit = Array.isArray(row) ? String(row[0] || "").trim() : String(row || "").trim();
      if (hit) return hit;
    }
  }
  return "";
}

/**
 * Optional. n8n already reads the linked response sheet every minute.
 * Do not enable this trigger as well, or each visit is created twice.
 */
function onFormSubmit(e) {
  const nv = (e && e.namedValues) || {};
  UrlFetchApp.fetch(N8N_WEBHOOK, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      fullName: pickNamed(nv, "Name"),
      email: pickNamed(nv, "Email"),
      phone: pickNamed(nv, "Phone or viber Number"),
      country: pickNamed(nv, "Nationality") || "Myanmar",
      passportNo: pickPassport(nv),
      message: pickNamed(nv, "Resident Address")
        ? "Resident address: " + pickNamed(nv, "Resident Address")
        : "Visit request (Google Form)",
      locale: "en",
      consent: true,
      returningPatient: false,
    }),
    muteHttpExceptions: true,
  });
}
