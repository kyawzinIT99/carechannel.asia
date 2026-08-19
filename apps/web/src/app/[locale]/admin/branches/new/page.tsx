import { BranchForm } from "@/components/admin/branch-form";

export default function NewBranchPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add branch</h1>
      <p className="text-sm text-slate-500">
        Add another Chiangmai Ram campus. It appears on the public contact form when published.
      </p>
      <BranchForm />
    </div>
  );
}
