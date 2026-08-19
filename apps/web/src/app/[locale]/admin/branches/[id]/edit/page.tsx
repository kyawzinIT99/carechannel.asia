import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { BranchForm } from "@/components/admin/branch-form";
import { getBranch } from "@/server/db/branches";

export const dynamic = "force-dynamic";

export default async function EditBranchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const branch = await getBranch(id);
  if (!branch) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/branches" className="text-sm text-[#0b4f9c] hover:underline">
          ← All branches
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit branch</h1>
        <p className="mt-1 text-sm text-slate-500">
          Changes go live on the contact page and visit request form when the branch is published.
        </p>
      </div>
      <BranchForm
        initial={{
          id: branch.id,
          code: branch.code,
          nameEn: branch.nameEn,
          nameMy: branch.nameMy,
          detailEn: branch.detailEn,
          detailMy: branch.detailMy,
          mapQuery: branch.mapQuery,
          status: branch.status,
          sortOrder: branch.sortOrder,
          published: branch.published,
        }}
      />
    </div>
  );
}
