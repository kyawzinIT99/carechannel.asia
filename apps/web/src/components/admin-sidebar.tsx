"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";

const GROUPS = [
  {
    label: "Website",
    items: [
      { href: "/admin/home", label: "Homepage", live: true },
      { href: "/admin/about", label: "About" },
      { href: "/admin/promotions", label: "Announcements" },
      { href: "/admin/packages", label: "Packages" },
      { href: "/admin/specialties", label: "Centres" },
      { href: "/admin/branches", label: "Campuses" },
    ],
  },
  {
    label: "Visitors",
    items: [
      { href: "/admin/inquiries", label: "Inquiries" },
      { href: "/admin/inquiries/passports", label: "Passports" },
      { href: "/admin/outbox", label: "Outbox" },
      { href: "/admin/templates", label: "Mail templates" },
    ],
  },
  {
    label: "Team",
    items: [
      { href: "/admin/users", label: "Users" },
      { href: "/staff", label: "Coordinator inbox" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, onPick }: { pathname: string; onPick?: () => void }) {
  return (
    <>
      <Link
        href="/admin"
        onClick={onPick}
        className={[
          "mx-2 mb-3 rounded-xl px-3 py-2.5 text-sm",
          pathname === "/admin" ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
        ].join(" ")}
      >
        Dashboard
      </Link>
      {GROUPS.map((group) => (
        <div key={group.label} className="mb-4">
          <p className="px-5 pb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4a35a]">
            {group.label}
          </p>
          {group.items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onPick}
                className={[
                  "mx-2 block rounded-xl px-3 py-2 text-sm",
                  active ? "bg-white/10 font-semibold text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between bg-[#1a2330] px-4 py-3 print:hidden md:hidden">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c4a35a]">CareChannel</p>
          <p className="text-sm font-semibold text-white">Admin</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-white/20 px-3 py-1.5 text-sm text-white"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>
      {open ? (
        <nav className="space-y-1 bg-[#1a2330] pb-4 print:hidden md:hidden">
          <NavLinks pathname={pathname} onPick={() => setOpen(false)} />
          <Link href="/" className="mx-5 mt-2 block text-xs text-[#c4a35a]">
            Open public website →
          </Link>
        </nav>
      ) : null}

      <aside className="hidden w-60 shrink-0 bg-[#1a2330] print:hidden md:flex md:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a35a]">CareChannel</p>
          <p className="mt-1 text-base font-semibold text-white">Hospital admin</p>
          <p className="mt-1 text-xs leading-5 text-white/50">Edits here go live on the public site.</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <NavLinks pathname={pathname} />
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <Link href="/" className="text-xs font-semibold text-[#c4a35a] hover:text-[#e0c57a]">
            View public website →
          </Link>
        </div>
      </aside>
    </>
  );
}
