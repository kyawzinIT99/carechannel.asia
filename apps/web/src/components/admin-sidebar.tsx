"use client";

import { Link, usePathname } from "@/i18n/routing";

const NAV = [
  { href: "/admin",            label: "Dashboard" },
  { href: "/admin/home",       label: "Homepage copy" },
  { href: "/admin/about",      label: "About page" },
  { href: "/admin/promotions", label: "Public promotions" },
  { href: "/admin/packages",   label: "Packages" },
  { href: "/admin/specialties",label: "Specialties" },
  { href: "/admin/branches",   label: "Branches" },
  { href: "/admin/inquiries",  label: "Inquiries" },
  { href: "/admin/inquiries/passports", label: "Passport list" },
  { href: "/admin/templates",  label: "Templates" },
  { href: "/admin/outbox",     label: "Outbox / n8n log" },
  { href: "/admin/users",      label: "Users" },
  { href: "/staff",            label: "Coordinator inbox" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white print:hidden md:block">
      <p className="border-b border-slate-100 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
        Admin panel
      </p>
      <nav className="flex flex-col py-2">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "px-4 py-2.5 text-sm",
                active
                  ? "bg-[#eef3f8] font-semibold text-[#0b4f9c]"
                  : "text-slate-600 hover:bg-slate-50",
              ].join(" ")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
