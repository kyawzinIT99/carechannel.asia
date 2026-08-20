import { PartnerVisaMark } from "@/components/partner-visa-mark";

export const HOSPITAL_FILM_SRC = "/videos/chiangmai-ram-master.mp4";

export function HospitalFilm({
  locale,
  layout = "page",
}: {
  locale: string;
  layout?: "hero" | "page";
}) {
  const my = locale === "my";
  const frame =
    layout === "hero"
      ? "overflow-hidden rounded-[2rem] bg-[#1a2330] shadow-[0_24px_50px_rgba(26,35,48,0.12)] ring-1 ring-black/5"
      : "overflow-hidden rounded-[1.75rem] bg-[#1a2330] shadow-[0_16px_40px_rgba(26,35,48,0.12)] ring-1 ring-black/5";

  return (
    <figure className={frame}>
      <video
        className="aspect-video w-full bg-black object-cover"
        controls
        playsInline
        preload="metadata"
        poster="/photos/health.jpg"
      >
        <source src={HOSPITAL_FILM_SRC} type="video/mp4" />
      </video>
      <figcaption className="border-t border-white/10 px-5 py-4 sm:px-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#d4af37]">
          {my ? "ဆေးရုံ ရုပ်သံ" : "Hospital film"}
          <PartnerVisaMark className="h-5 w-auto brightness-110" />
        </p>
        <p className="mt-1 text-sm font-semibold leading-6 text-white">
          {my
            ? "ချင်းမိုင်ရမ်ဆေးရုံ — နိုင်ငံသားတိုင်းအတွက် ဧည့်ဝန်ဆောင်မှု"
            : "Chiangmai Ram Hospital — service for guests of every nationality"}
        </p>
        <p className="mt-1 text-xs leading-6 text-white/70">
          {my
            ? "ဤရုပ်သံသည် ဆေးရုံမိတ်ဖက်လမ်းကြောင်းအတွက် ဖြစ်ပါသည်။ ဆေးကုသမှု အချက်အလက်သစ်ကို ဤနေရာတွင် တီထွင်မပြောပါ။"
            : "This film is for the hospital partner channel. It does not add new medical claims."}
        </p>
      </figcaption>
    </figure>
  );
}
