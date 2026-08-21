import { HomeContentForm } from "@/components/admin/home-content-form";
import { ABOUT_FIELDS } from "@/catalog/about-copy";
import { listSiteContent } from "@/server/db/site-content";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

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
      <AdminPageHeader
        title="About page"
        hint="English and Myanmar copy for the public About page. Save to replace the catalog text visitors see."
        liveHref="/en/about"
      />
      <HomeContentForm
        rows={rows}
        buttonLabel="Save About page"
        successMessage="Saved. The public About page now shows this copy."
      />
    </div>
  );
}
