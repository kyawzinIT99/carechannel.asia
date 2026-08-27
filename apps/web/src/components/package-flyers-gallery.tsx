"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { type FlyerGroup, type PackageFlyer } from "@/catalog/package-flyers";

const GROUP_COPY: Record<FlyerGroup, { en: string; my: string; kickerEn: string; kickerMy: string }> = {
  checkup: {
    kickerEn: "2026 check-up",
    kickerMy: "၂၀၂၆ စစ်ဆေးမှု",
    en: "Read the hospital sheets in full — every test and price.",
    my: "ဆေးရုံထုတ်ပြန်ဇယားကို အပြည့်အစုံ ဖတ်ပါ — စစ်ဆေးမှုနှင့် စျေးနှုန်းတိုင်း။",
  },
  specialty: {
    kickerEn: "More 2026 packages",
    kickerMy: "၂၀၂၆ ပက်ကေ့ချ် အခြား",
    en: "Pregnancy, heart, thyroid, scans, vaccines, and more.",
    my: "ကိုယ်ဝန်၊ နှလုံး၊ သိုင်းရွိုက်၊ စကင်၊ ကာကွယ်ဆေးနှင့် အခြား။",
  },
  hospital: {
    kickerEn: "Hospital & offices",
    kickerMy: "ဆေးရုံနှင့် ရုံးများ",
    en: "Mae Sai office, campus, and specialist centres.",
    my: "မယ်ဆိုင်ရုံး၊ နယ်မြေနှင့် အထူးကုဌာနများ။",
  },
};

function FlyerCard({
  flyer,
  my,
  featured,
  onOpen,
}: {
  flyer: PackageFlyer;
  my: boolean;
  featured?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(flyer.id)}
      className={`group w-full overflow-hidden rounded-[1.5rem] bg-white text-left shadow-[0_12px_32px_rgba(26,35,48,0.08)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(26,35,48,0.12)] ${
        featured ? "md:col-span-1" : ""
      }`}
    >
      <div className="relative bg-[#f4f1ea]">
        <Image
          src={flyer.src}
          alt={my ? flyer.titleMy : flyer.titleEn}
          width={flyer.width}
          height={flyer.height}
          quality={90}
          className="h-auto w-full"
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
        />
      </div>
      <div className="px-4 py-3 md:px-5 md:py-4">
        <p className="text-sm font-semibold leading-5 text-[#1a2330] md:text-[15px]">
          {my ? flyer.titleMy : flyer.titleEn}
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500 md:text-[13px] md:leading-6">
          {my ? flyer.summaryMy : flyer.summaryEn}
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0b4f9c]">
          {my ? "ကြီးကြည့်ရန် နှိပ်ပါ" : "Tap to enlarge"}
        </p>
      </div>
    </button>
  );
}

export function PackageFlyersGallery({
  locale,
  groups,
  flyers,
  heading,
}: {
  locale: string;
  groups: FlyerGroup[];
  flyers: PackageFlyer[];
  heading?: boolean;
}) {
  const my = locale === "my";
  const visible = useMemo(() => flyers.filter((f) => groups.includes(f.group)), [flyers, groups]);
  const [openId, setOpenId] = useState<string | null>(null);
  const titleId = useId();
  const openIndex = openId ? visible.findIndex((f) => f.id === openId) : -1;
  const openFlyer = openIndex >= 0 ? visible[openIndex] : null;

  const close = useCallback(() => setOpenId(null), []);
  const go = useCallback(
    (dir: -1 | 1) => {
      if (openIndex < 0) return;
      const next = (openIndex + dir + visible.length) % visible.length;
      setOpenId(visible[next].id);
    },
    [visible, openIndex],
  );

  useEffect(() => {
    if (!openFlyer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [openFlyer, close, go]);

  return (
    <>
      {groups.map((group) => {
        const items = visible.filter((f) => f.group === group);
        if (!items.length) return null;
        const copy = GROUP_COPY[group];
        const featured = group === "checkup";
        return (
          <div key={group} className={heading ? "mt-10 first:mt-0" : "mt-8 first:mt-0"}>
            {heading ? (
              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c4a35a]">
                  {my ? copy.kickerMy : copy.kickerEn}
                </p>
                <p className="mt-1 max-w-2xl text-[15px] leading-7 text-slate-600">{my ? copy.my : copy.en}</p>
              </div>
            ) : null}
            <div className={`grid gap-4 ${featured ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
              {items.map((flyer) => (
                <FlyerCard
                  key={flyer.id}
                  flyer={flyer}
                  my={my}
                  featured={featured}
                  onOpen={setOpenId}
                />
              ))}
            </div>
          </div>
        );
      })}

      {openFlyer ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a2330]/80 p-3 backdrop-blur-sm md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <div
            className="relative flex max-h-[96vh] w-full max-w-4xl flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p id={titleId} className="text-sm font-semibold text-white md:text-base">
                  {my ? openFlyer.titleMy : openFlyer.titleEn}
                </p>
                <p className="mt-0.5 text-xs text-white/70">{my ? openFlyer.summaryMy : openFlyer.summaryEn}</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/25"
              >
                {my ? "ပိတ်မည်" : "Close"}
              </button>
            </div>
            <div className="relative overflow-auto rounded-2xl bg-white shadow-2xl">
              <Image
                src={openFlyer.src}
                alt={my ? openFlyer.titleMy : openFlyer.titleEn}
                width={openFlyer.width}
                height={openFlyer.height}
                quality={90}
                className="h-auto w-full"
                sizes="min(896px, 100vw)"
                priority
              />
            </div>
            {visible.length > 1 ? (
              <div className="mt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
                >
                  {my ? "ယခင်" : "Previous"}
                </button>
                <p className="text-xs text-white/70">
                  {openIndex + 1} / {visible.length}
                </p>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25"
                >
                  {my ? "ရှေ့" : "Next"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
