/**
 * Paste into the Google Form: Extensions → Apps Script.
 * Form questions must be titled exactly: Name, Email, Phone, Nationality
 * Trigger: Edit → Triggers → Add trigger → onFormSubmit → From form → On form submit
 *
 * Do not also Link-to-Sheets into the same CRM sheet if this script is on,
 * or the visit request is created twice.
 */
function onFormSubmit(e) {
  const nv = (e && e.namedValues) || {};
  const pick = (title) => {
    const row = nv[title];
    return Array.isArray(row) ? String(row[0] || "").trim() : "";
  };
  UrlFetchApp.fetch("https://n8n-al8a.srv1707349.hstgr.cloud/webhook/ram-hospital-google-form", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      fullName: pick("Name"),
      email: pick("Email"),
      phone: pick("Phone"),
      country: pick("Nationality"),
      locale: "en",
      message: "Visit request (name, email, phone, nationality)",
    }),
    muteHttpExceptions: true,
  });
}
