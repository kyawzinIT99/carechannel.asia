/** Tiny gold Shwedagon-style stupa for the partner-channel line. */
export function ShwedagonMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 40"
      width="18"
      height="26"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    >
      <title>Shwedagon Pagoda</title>
      <path fill="#c9a227" d="M4 36h20v2H4z" />
      <path fill="#d4af37" d="M6 33h16l1 3H5z" />
      <path fill="#e8c547" d="M8 30h12l1.2 3H6.8z" />
      <path fill="#d4af37" d="M14 8c-5.2 4.2-7.4 10.2-7.6 16.6 0 .6.4 1.4 1.2 1.4h12.8c.8 0 1.2-.8 1.2-1.4C21.4 18.2 19.2 12.2 14 8Z" />
      <path fill="#f3d56a" d="M14 9.2c-3.8 3.4-5.6 8.2-5.8 13.8h11.6C19.6 17.4 17.8 12.6 14 9.2Z" />
      <path fill="#b8860b" d="M12.6 7.4h2.8L14 5.2z" />
      <rect fill="#d4af37" x="13.2" y="2.4" width="1.6" height="3.2" rx="0.4" />
      <path fill="#f6e27a" d="M14 0.6 15.4 2.6h-2.8z" />
      <circle fill="#fff3b0" cx="14" cy="0.8" r="0.7" />
      <path fill="#c9a227" d="M10.5 26.8h7v1.4h-7z" />
    </svg>
  );
}
