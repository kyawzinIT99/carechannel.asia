import { PromotionForm } from "@/components/admin/promotion-form";

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New promotion</h1>
      <p className="text-sm text-slate-500">
        Add English and Myanmar copy. Tick Published to show it on the public homepage and packages page. Saving does not email anyone — mail a follow-up from Inquiries → Send.
      </p>
      <PromotionForm />
    </div>
  );
}
