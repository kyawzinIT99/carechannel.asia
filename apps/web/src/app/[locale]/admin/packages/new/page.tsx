import { PackageCatalogForm } from "@/components/admin/package-catalog-form";

export default function NewPackageCatalogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Add package catalog</h1>
      <p className="text-sm text-slate-500">
        When the hospital sends updated 2026 prices, create a new catalog here with the packages.
        Individual packages can be toggled from the catalog list.
      </p>
      <PackageCatalogForm />
    </div>
  );
}
