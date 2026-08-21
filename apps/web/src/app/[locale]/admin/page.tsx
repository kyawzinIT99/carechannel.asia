import { prisma } from "@/server/db/prisma";
import { Link } from "@/i18n/routing";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { loadPublicPackages } from "@/server/content/public";

export const dynamic = "force-dynamic";

async function stats() {
  const [totalInquiries, newInquiries, packagesLive, promotions, users] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    loadPublicPackages().then((rows) => rows.length),
    prisma.promotion.count({ where: { published: true } }),
    prisma.user.count(),
  ]);
  return { totalInquiries, newInquiries, packagesLive, promotions, users };
}

const CONNECTIONS = [
  {
    title: "Homepage",
    hint: "Hero copy, LINE, Telegram, Viber, pickup and stay text.",
    edit: "/admin/home",
    live: "/",
    liveLabel: "/en",
  },
  {
    title: "Packages",
    hint: "Prices and tests on /packages and the visit form.",
    edit: "/admin/packages",
    live: "/packages",
    liveLabel: "/en/packages",
  },
  {
    title: "Announcements",
    hint: "Published cards on the homepage and packages page.",
    edit: "/admin/promotions",
    live: "/",
    liveLabel: "/en",
  },
  {
    title: "Centres",
    hint: "Specialty list on the homepage and /specialties.",
    edit: "/admin/specialties",
    live: "/specialties",
    liveLabel: "/en/specialties",
  },
  {
    title: "Campuses",
    hint: "Sripoom and Charoen Mueang on the contact page.",
    edit: "/admin/branches",
    live: "/contact",
    liveLabel: "/en/contact",
  },
  {
    title: "About",
    hint: "Public about-page copy in English and Myanmar.",
    edit: "/admin/about",
    live: "/about",
    liveLabel: "/en/about",
  },
];

export default async function AdminDashboard() {
  const s = await stats();

  const cards = [
    { label: "Inquiries", value: s.totalInquiries, href: "/admin/inquiries", note: `${s.newInquiries} new` },
    { label: "Live packages", value: s.packagesLive, href: "/admin/packages", note: "Public website" },
    { label: "Announcements", value: s.promotions, href: "/admin/promotions", note: "Published" },
    { label: "Users", value: s.users, href: "/admin/users", note: "Staff accounts" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        hint="This panel writes the same records the public website and visit form read. Save in admin, then open the live page to confirm."
        liveHref="/"
        liveLabel="Open website"
        actions={
          <Link href="/admin/inquiries" className="rounded-full bg-[#1a2330] px-4 py-2 text-sm font-semibold text-white hover:bg-[#111820]">
            Open inquiries
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl bg-white p-5 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-3xl font-semibold text-[#1a2330]">{c.value}</p>
            <p className="mt-1 text-sm font-semibold text-[#1a2330]">{c.label}</p>
            <p className="mt-1 text-xs text-slate-500">{c.note}</p>
          </Link>
        ))}
      </div>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#c4a35a]">Connected to the website</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {CONNECTIONS.map((row) => (
            <div key={row.title} className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <div>
                <p className="font-semibold text-[#1a2330]">{row.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{row.hint}</p>
                <Link href={row.live} className="mt-2 inline-block text-xs font-semibold text-[#c4a35a]">
                  {row.liveLabel} →
                </Link>
              </div>
              <Link
                href={row.edit}
                className="shrink-0 rounded-full bg-[#1a2330] px-3 py-1.5 text-xs font-semibold text-white"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
