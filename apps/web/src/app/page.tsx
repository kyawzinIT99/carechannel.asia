import { redirect } from "next/navigation";

// Root / → /en (next-intl localePrefix:"always" fallback)
export default function RootPage() {
  redirect("/en");
}
