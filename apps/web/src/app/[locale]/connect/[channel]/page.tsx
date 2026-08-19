import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MessengerOpen } from "@/components/messenger-open";
import { loadPublicChrome } from "@/server/content/public";
import { messengerLinks, type MessengerChannel } from "@/server/security/messengers";

export const dynamic = "force-dynamic";

const CHANNELS: MessengerChannel[] = ["line", "telegram", "viber"];

export default async function ConnectMessengerPage({
  params,
}: {
  params: Promise<{ locale: string; channel: string }>;
}) {
  const { locale, channel } = await params;
  if (!CHANNELS.includes(channel as MessengerChannel)) notFound();
  setRequestLocale(locale);

  const chrome = await loadPublicChrome();
  const links = messengerLinks({
    linePhone: chrome.linePhone,
    telegramUrl: chrome.telegramUrl,
    viberDisplay: chrome.viberDisplay,
  });
  const ch = channel as MessengerChannel;
  const names = { line: "LINE", telegram: "Telegram", viber: "Viber" };
  const numbers = {
    line: chrome.linePhone,
    telegram: chrome.linePhone,
    viber: chrome.viberDisplay,
  };

  return (
    <MessengerOpen
      locale={locale}
      name={names[ch]}
      appUrl={links[ch].app}
      httpUrl={links[ch].http}
      number={numbers[ch]}
    />
  );
}
