import { notFound } from "next/navigation";
import { prisma } from "@/server/db/prisma";
import { SpecialtyForm } from "@/components/admin/specialty-form";

export const dynamic = "force-dynamic";

export default async function EditSpecialtyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.specialty.findUnique({ where: { id } });
  if (!s) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit {s.nameEn}</h1>
      <SpecialtyForm
        initial={{
          id: s.id,
          nameEn: s.nameEn,
          nameMy: s.nameMy,
          nameTh: s.nameTh,
          summaryEn: s.summaryEn,
          summaryMy: s.summaryMy,
          servicesEn: s.servicesEn.join("\n"),
          servicesMy: s.servicesMy.join("\n"),
          imagePath: s.imagePath ?? "",
          hoursEn: s.hoursEn ?? "",
          hoursMy: s.hoursMy ?? "",
          sortOrder: s.sortOrder,
          published: s.published,
        }}
      />
    </div>
  );
}
