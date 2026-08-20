const ITEMS_EN = [
  "Official Myanmar Partner Channel",
  "Exclusive Benefits",
  "Outstanding Healthcare",
  "Personalized Patient Support",
];

const ITEMS_MY = [
  "တရားဝင် မြန်မာ မိတ်ဖက်လမ်းကြောင်း",
  "အထူးအခွင့်အရေး",
  "အရည်အသွေးမြင့် ကျန်းမာရေးစောင့်ရှောက်မှု",
  "လူနာတစ်ဦးချင်း အထောက်အပံ့",
];

export function GoldTicker({ locale }: { locale: string }) {
  const items = locale === "my" ? ITEMS_MY : ITEMS_EN;
  const line = items.join("  •  ");

  return (
    <div className="gold-ticker" aria-label={line}>
      <div className="gold-ticker-track">
        <span>{line}</span>
        <span aria-hidden="true">{line}</span>
      </div>
    </div>
  );
}
