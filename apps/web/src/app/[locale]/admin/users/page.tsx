import { prisma } from "@/server/db/prisma";
import { UserActions } from "@/components/admin/user-actions";
import { CreateStaffUserForm } from "@/components/admin/create-staff-user-form";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { roles: true },
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create another login here. HOSPITAL_ADMIN and SUPER_ADMIN can open the admin panel at Staff login.
          INTERNATIONAL_COORDINATOR and RECEPTION use the coordinator inbox.
        </p>
      </div>

      <CreateStaffUserForm />

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Locale</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No users yet.</td>
              </tr>
            ) : null}
            {users.map((user) => (
              <tr key={user.id} className="align-middle hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((r) => (
                      <span key={r.id} className="rounded-full bg-[#eef3f8] px-2 py-0.5 text-xs font-semibold text-[#0b4f9c]">
                        {r.role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs uppercase text-slate-500">{user.locale}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {user.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                  {user.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  <UserActions id={user.id} isActive={user.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
