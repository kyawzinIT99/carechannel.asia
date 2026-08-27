import { PromotionForm } from "@/components/admin/promotion-form";

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New promotion</h1>
      <p className="text-sm text-slate-500">
        Add English and Myanmar copy. For a hospital package sheet, set Type to Package flyer and add the image path. Tick Published to show it on the public homepage.
      </p>
      <PromotionForm />
    </div>
  );
}
