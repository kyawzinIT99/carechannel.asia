export function DownArrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-5 text-[#0b4f9c]" aria-hidden={label ? undefined : true}>
      {label ? <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em]">{label}</p> : null}
      <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
        <path d="M18 2v32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M7 24l11 16 11-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
