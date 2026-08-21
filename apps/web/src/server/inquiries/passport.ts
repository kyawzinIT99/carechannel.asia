export function normalizePassport(raw?: string | null) {
  const value = String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 20);
  return value;
}
