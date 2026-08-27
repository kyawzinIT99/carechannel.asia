import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { MessengerOpen } from "@/components/messenger-open";
import { loadPublicChrome } from "@/server/content/public";
import { lineHttpUrl } from "@/server/security/messengers";

export const dynamic = "force-dynamic";

export default async function ConnectMessengerPage({
  params,
}: {
  params: Promise<{ locale: string; channel: string }>;
}) {
  const { locale, channel } = await params;
  if (channel !== "line") notFound();
  setRequestLocale(locale);

  const chrome = await loadPublicChrome();
  return (
    <MessengerOpen
      locale={locale}
      name="LINE"
      appUrl={lineHttpUrl(chrome.linePhone)}
      httpUrl={lineHttpUrl(chrome.linePhone)}
    />
  );
}
