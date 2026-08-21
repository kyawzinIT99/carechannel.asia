export function normalizePassport(raw?: string | null) {
  const value = String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
  return value;
}

function cellText(val: unknown): string {
  if (Array.isArray(val) && val[0] != null) return String(val[0]).trim();
  if (val == null || typeof val === "object") return "";
  return String(val).trim();
}

/** Google Form headers vary: Passport Number, Passport no., နိုင်ငံကူးလက်မှတ်. */
export function pickPassportFromRecord(raw: Record<string, unknown>) {
  const exact = ["passportNo", "Passport", "Passport no", "Passport No", "Passport number", "Passport Number", "passport"];
  for (const key of exact) {
    const hit = cellText(raw[key]);
    if (hit) return hit;
  }
  for (const [key, val] of Object.entries(raw)) {
    if (/passport|နိုင်ငံကူးလက်မှတ်/i.test(key)) {
      const hit = cellText(val);
      if (hit) return hit;
    }
  }
  return "";
}
