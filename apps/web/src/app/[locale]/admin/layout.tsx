import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { readSession, hasRole } from "@/server/auth/session";
import { Role } from "@prisma/client";
import { AdminSidebar } from "@/components/admin-sidebar";

const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "HOSPITAL_ADMIN"];

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await readSession();
  if (!hasRole(session, ADMIN_ROLES)) {
    redirect(`/${locale}/staff/login`);
  }
  return (
    <div className="flex min-h-[calc(100vh-4rem)] gap-0">
      <AdminSidebar />
      <div className="min-w-0 flex-1 p-6 md:p-8 print:p-0">{children}</div>
    </div>
  );
}
