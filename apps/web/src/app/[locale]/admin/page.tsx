import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";

export const dynamic = "force-dynamic";

async function stats() {
  const [
    totalInquiries, newInquiries, confirmedAppts, promotions, templates, users,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.promotion.count({ where: { published: true } }),
    prisma.messageTemplate.count(),
    prisma.user.count(),
  ]);
  return { totalInquiries, newInquiries, confirmedAppts, promotions, templates, users };
}

export default async function AdminDashboard() {
  const s = await stats();

  const cards = [
    { label: "Total inquiries",      value: s.totalInquiries,  href: "/admin/inquiries",  bg: "bg-[#0b4f9c]", text: "text-white" },
    { label: "New (uncontacted)",     value: s.newInquiries,    href: "/admin/inquiries?status=NEW", bg: "bg-amber-500", text: "text-white" },
    { label: "Confirmed appointments",value: s.confirmedAppts,  href: "/admin/inquiries",  bg: "bg-emerald-600", text: "text-white" },
    { label: "Live promotions",       value: s.promotions,      href: "/admin/promotions", bg: "bg-white", text: "text-slate-800" },
    { label: "Message templates",     value: s.templates,       href: "/admin/templates",  bg: "bg-white", text: "text-slate-800" },
    { label: "Registered users",      value: s.users,           href: "/admin/users",      bg: "bg-white", text: "text-slate-800" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Official incentive partner portal — Chiangmai Ram Hospital Myanmar
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`rounded-2xl ${c.bg} p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md`}
          >
            <p className={`text-3xl font-bold ${c.text}`}>{c.value}</p>
            <p className={`mt-1 text-sm ${c.text === "text-white" ? "text-white/80" : "text-slate-500"}`}>
              {c.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/home" className="rounded-full bg-[#0b4f9c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#083a73]">
            Edit homepage
          </Link>
          <Link href="/admin/promotions/new" className="rounded-full border border-[#0b4f9c] px-4 py-2 text-sm font-semibold text-[#0b4f9c] hover:bg-slate-50">
            + New announcement
          </Link>
          <Link href="/admin/packages/new" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            + Add package
          </Link>
          <Link href="/admin/inquiries" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            View all inquiries
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800">Route map</h2>
        <div className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          {[
            ["PUBLIC — Homepage", "/en"],
            ["PUBLIC — Specialties", "/en/specialties"],
            ["PUBLIC — Packages", "/en/packages"],
            ["PUBLIC — Request a visit", "/en/contact"],
            ["PATIENT — My requests", "/en/account"],
            ["STAFF — Coordinator inbox", "/en/staff"],
            ["ADMIN — Dashboard", "/en/admin"],
            ["ADMIN — Homepage copy", "/en/admin/home"],
            ["ADMIN — Inquiries", "/en/admin/inquiries"],
            ["ADMIN — Announcements", "/en/admin/promotions"],
            ["ADMIN — Packages", "/en/admin/packages"],
            ["ADMIN — Templates", "/en/admin/templates"],
            ["ADMIN — Users", "/en/admin/users"],
            ["API — Submit inquiry", "POST /api/v1/public/inquiries"],
            ["API — Login", "POST /api/v1/auth/login"],
            ["API — Register", "POST /api/v1/auth/register"],
            ["API — Confirm appt", "POST /api/v1/staff/appointments/[id]/confirm"],
            ["API — n8n Telegram", "POST /api/v1/internal/n8n/telegram"],
            ["API — n8n Reminders", "POST /api/v1/internal/n8n/reminders"],
            ["API — Admin promotions", "POST/PATCH/DELETE /api/v1/admin/promotions"],
            ["API — Admin inquiries", "PATCH /api/v1/admin/inquiries/[id]"],
            ["API — Admin packages", "POST/PATCH /api/v1/admin/packages"],
            ["API — Admin templates", "PATCH /api/v1/admin/templates/[key]"],
            ["API — Admin users", "PATCH /api/v1/admin/users/[id]"],
            ["API — Admin stats", "GET /api/v1/admin/stats"],
          ].map(([label, route]) => (
            <div key={route} className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-500 shrink-0">{label}</span>
              <code className="ml-auto text-xs text-[#0b4f9c] break-all">{route}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
