import { Link } from "@/i18n/routing";
import { HomeContentForm } from "@/components/admin/home-content-form";
import { ABOUT_FIELDS } from "@/catalog/about-copy";
import { listSiteContent } from "@/server/db/site-content";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  let stored: { key: string; valueEn: string; valueMy: string }[] = [];
  try {
    stored = await listSiteContent();
  } catch {
    stored = [];
  }
  const map = Object.fromEntries(stored.map((r) => [r.key, r]));
  const rows = ABOUT_FIELDS.map((f) => ({
    key: f.key,
    label: f.label,
    multiline: f.multiline,
    valueEn: map[f.key]?.valueEn || f.fallbackEn,
    valueMy: map[f.key]?.valueMy || f.fallbackMy,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">About page</h1>
        <p className="mt-1 text-sm text-slate-500">
          This copy appears at{" "}
          <Link href="/about" className="font-semibold text-[#0b4f9c] hover:underline">
            /about
          </Link>{" "}
          in English and Myanmar. It is the official partner story — relationship, Asia patients, and why to inquire on this website.
        </p>
      </div>
      <HomeContentForm
        rows={rows}
        buttonLabel="Save About page"
        successMessage="Saved. The public About page now shows this copy."
      />
    </div>
  );
}
