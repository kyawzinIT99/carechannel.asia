const FORM_ID = "1nLGeHgj-IhYtgzPw2Bi7spUQW9rRnrHd1Fa4GZ7y3yQ";
const N8N_WEBHOOK = "https://n8n-al8a.srv1707349.hstgr.cloud/webhook/ram-hospital-google-form";

function getForm() {
  try {
    const active = FormApp.getActiveForm();
    if (active) return active;
  } catch (e) {
    /* standalone script — open by id */
  }
  return FormApp.openById(FORM_ID);
}

/** Run this once in the Apps Script editor (Run → setupRamHospitalForm). Authorize Forms + UrlFetch. */
function setupRamHospitalForm() {
  const form = getForm();
  form.setTitle("Chiangmai Ram Hospital visit request");
  form.setDescription(
    "Same core details as the website request: name, email, phone, nationality. A coordinator will follow up. This is not emergency care.",
  );
  form.setCollectEmail(false);
  form.setAllowResponseEdits(false);

  const existing = form.getItems().map(function (item) {
    return String(item.getTitle() || "").trim();
  });
  ["Name", "Email", "Phone", "Nationality"].forEach(function (title) {
    if (existing.indexOf(title) === -1) {
      form.addTextItem().setTitle(title).setRequired(true);
    }
  });

  const hasTrigger = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === "onFormSubmit";
  });
  if (!hasTrigger) {
    ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();
  }

  Logger.log("Published URL: " + form.getPublishedUrl());
  Logger.log("Edit URL: " + form.getEditUrl());
}

function onFormSubmit(e) {
  const nv = (e && e.namedValues) || {};
  const pick = function (title) {
    const row = nv[title];
    return Array.isArray(row) ? String(row[0] || "").trim() : "";
  };
  UrlFetchApp.fetch(N8N_WEBHOOK, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      fullName: pick("Name"),
      email: pick("Email"),
      phone: pick("Phone"),
      country: pick("Nationality") || "Myanmar",
      locale: "en",
      message: "Visit request (name, email, phone, nationality)",
    }),
    muteHttpExceptions: true,
  });
}
