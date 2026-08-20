export const VISA_SUPPORT_LOGO = "/brand/visa-support-thailand.png";

export function PartnerVisaMark({
  className = "h-6 w-auto",
}: {
  className?: string;
}) {
  return (
    <img
      src={VISA_SUPPORT_LOGO}
      alt="visa support (Thailand)"
      className={`inline-block shrink-0 object-contain align-middle ${className}`}
    />
  );
}
