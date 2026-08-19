/**
 * Visitor messenger links. LINE / Telegram / Viber must open the app from a website tap.
 * Do not use target=_blank on viber:// or tg:// — Safari opens a blank tab.
 * https://t.me/+<phone> is an invite link, not a phone chat.
 */

export function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function e164Digits(value: string, country: "th" | "mm") {
  let d = digitsOnly(value);
  if (d.startsWith("00")) d = d.slice(2);
  if (country === "th") {
    if (d.startsWith("0")) return `66${d.slice(1)}`;
    if (d.startsWith("66")) return d;
    if (d.length === 9) return `66${d}`;
  }
  if (country === "mm") {
    if (d.startsWith("0")) return `95${d.slice(1)}`;
    if (d.startsWith("95")) return d;
  }
  return d;
}

function thaiLineId(display: string) {
  const d = digitsOnly(display);
  if (d.startsWith("66") && d.length >= 11) return `0${d.slice(2)}`;
  return d;
}

export function lineHttpUrl(display: string) {
  const id = thaiLineId(display);
  return `https://line.me/R/ti/p/~${encodeURIComponent(id)}`;
}

export function lineAppUrl(display: string) {
  const id = thaiLineId(display);
  return `line://ti/p/~${id}`;
}

function telegramUsernameUrl(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("@")) return `https://t.me/${encodeURIComponent(trimmed.slice(1))}`;
  const withScheme = /^(https?:)?\/\//i.test(trimmed)
    ? trimmed.replace(/^\/\//, "https://")
    : /^(t\.me|telegram\.me)\//i.test(trimmed)
      ? `https://${trimmed}`
      : trimmed;
  try {
    const url = new URL(withScheme);
    const host = url.hostname.replace(/^www\./, "");
    if (host !== "t.me" && host !== "telegram.me" && host !== "telegram.dog") return null;
    const path = decodeURIComponent(url.pathname).replace(/\/+$/, "") || "/";
    const inviteAsPhone = path.match(/^\/\+(\d{8,15})$/);
    if (inviteAsPhone) return null;
    if (path === "/" || path === "/+") return null;
    if (path.startsWith("/+")) return null;
    url.protocol = "https:";
    url.hostname = "t.me";
    return url.toString();
  } catch {
    return null;
  }
}

export function telegramAppUrl(adminUrl: string | undefined, phoneDisplay: string) {
  const named = telegramUsernameUrl(adminUrl || "");
  if (named) {
    const user = named.replace(/^https:\/\/t\.me\//i, "").replace(/^\//, "");
    return `tg://resolve?domain=${encodeURIComponent(user.split("/")[0] || "")}`;
  }
  const phone = e164Digits(phoneDisplay, "th");
  return `tg://resolve?phone=${phone}`;
}

export function telegramHttpUrl(adminUrl: string | undefined, phoneDisplay: string) {
  const named = telegramUsernameUrl(adminUrl || "");
  if (named) return named;
  const phone = e164Digits(phoneDisplay, "th");
  const deep = `tg://resolve?phone=${phone}`;
  return `https://web.telegram.org/k/#?tgaddr=${encodeURIComponent(deep)}`;
}

export function viberAppUrl(display: string) {
  const n = e164Digits(display, "mm");
  return `viber://chat?number=%2B${n}`;
}

export function viberAddUrl(display: string) {
  const n = e164Digits(display, "mm");
  return `viber://add?number=${n}`;
}

export type MessengerChannel = "line" | "telegram" | "viber";

export function messengerLinks(input: {
  linePhone: string;
  telegramUrl?: string;
  viberDisplay: string;
}) {
  return {
    line: {
      app: lineAppUrl(input.linePhone),
      http: lineHttpUrl(input.linePhone),
    },
    telegram: {
      app: telegramAppUrl(input.telegramUrl, input.linePhone),
      http: telegramHttpUrl(input.telegramUrl, input.linePhone),
    },
    viber: {
      app: viberAppUrl(input.viberDisplay),
      http: viberAddUrl(input.viberDisplay),
    },
  };
}
