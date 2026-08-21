import { Link } from "@/i18n/routing";

export function AdminPageHeader({
  kicker = "Admin",
  title,
  hint,
  liveHref,
  liveLabel = "View live page",
  actions,
}: {
  kicker?: string;
  title: string;
  hint?: string;
  liveHref?: string;
  liveLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c4a35a]">{kicker}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#1a2330]">{title}</h1>
        {hint ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{hint}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {liveHref ? (
          <Link
            href={liveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#1a2330]/15 bg-white px-4 py-2 text-sm font-semibold text-[#1a2330] hover:bg-[#f7f4ee]"
          >
            {liveLabel}
          </Link>
        ) : null}
        {actions}
      </div>
    </div>
  );
}
