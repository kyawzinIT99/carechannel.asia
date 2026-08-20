"use client";

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

function TickerCopy({ items }: { items: string[] }) {
  return (
    <span className="gold-ticker-copy">
      {items.map((item) => (
        <span key={item}>
          {item}
          <span className="gold-ticker-dot" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </span>
  );
}

export function GoldTicker({ locale }: { locale: string }) {
  const items = locale === "my" ? ITEMS_MY : ITEMS_EN;
  const label = items.join(" • ");

  return (
    <div className="gold-ticker" aria-label={label}>
      <div className="gold-ticker-track">
        <TickerCopy items={items} />
        <TickerCopy items={items} />
        <TickerCopy items={items} />
        <TickerCopy items={items} />
      </div>
    </div>
  );
}
