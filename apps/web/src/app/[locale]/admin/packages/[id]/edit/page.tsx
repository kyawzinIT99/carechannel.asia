import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import { PackageEditor } from "@/components/admin/package-editor";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({ where: { id } });
  if (!pkg) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/packages" className="text-sm text-[#0b4f9c] hover:underline">
          ← All packages
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit package</h1>
        <p className="mt-1 text-sm text-slate-500">
          Changes go live on the homepage, packages page, and contact form as soon as you save.
        </p>
      </div>
      <PackageEditor
        id={pkg.id}
        code={pkg.code}
        nameEn={pkg.nameEn}
        nameMy={pkg.nameMy}
        gender={pkg.gender}
        listPrice={String(pkg.listPrice)}
        salePrice={String(pkg.salePrice)}
        highlight={pkg.highlight ?? ""}
        published={pkg.published}
        featuresEn={pkg.featuresEn ?? []}
        featuresMy={pkg.featuresMy ?? []}
      />
    </div>
  );
}
