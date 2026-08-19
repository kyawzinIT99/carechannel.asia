const DUMMY_HASH = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export function dummyPasswordHash() {
  return DUMMY_HASH;
}

export function httpsUrl(value: string | undefined, fallback: string) {
  const raw = value?.trim();
  if (!raw) return fallback;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return fallback;
    if (url.username || url.password) return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

export function googleMapsEmbedSrc(mapQuery: string, hl: "en" | "my") {
  const q = mapQuery.replace(/[\u0000-\u001f<>]/g, "").slice(0, 200);
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&hl=${hl}&z=16&output=embed`;
}

export function googleMapsSearchHref(mapQuery: string) {
  const q = mapQuery.replace(/[\u0000-\u001f<>]/g, "").slice(0, 200);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
