import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { hasRole, readSession, STAFF_ROLES } from "@/server/auth/session";
import { prisma } from "@/server/db/prisma";
import { PageContainer } from "@/components/page-container";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, { en: string; my: string; cls: string }> = {
  NEW:       { en: "Received",  my: "လက်ခံပြီး",   cls: "bg-amber-100 text-amber-700" },
  CONTACTED: { en: "Contacted", my: "ဆက်သွယ်ပြီး", cls: "bg-blue-100 text-blue-700"   },
  CLOSED:    { en: "Closed",    my: "ပိတ်ပြီး",    cls: "bg-slate-100 text-slate-500"  },
  REQUESTED: { en: "Requested", my: "တောင်းဆိုပြီး", cls: "bg-amber-100 text-amber-700" },
  CONFIRMED: { en: "Confirmed", my: "အတည်ပြုပြီး",  cls: "bg-emerald-100 text-emerald-700" },
  COMPLETED: { en: "Completed", my: "ပြီးဆုံးပြီး",  cls: "bg-emerald-100 text-emerald-700" },
  CANCELLED: { en: "Cancelled", my: "ပယ်ဖျက်ပြီး",  cls: "bg-red-100 text-red-600" },
};

function badge(key: string, my: boolean) {
  const s = STATUS_LABEL[key] ?? { en: key, my: key, cls: "bg-slate-100 text-slate-500" };
  return { label: my ? s.my : s.en, cls: s.cls };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await readSession();
  if (!session) redirect(`/${locale}/login`);
  if (hasRole(session, STAFF_ROLES) && !hasRole(session, ["PATIENT"])) {
    redirect(`/${locale}/staff`);
  }
  const my = locale === "my";

  const inquiries = await prisma.inquiry.findMany({
    where: { OR: [{ patientUserId: session.sub }, { email: session.email }] },
    orderBy: { createdAt: "desc" },
    include: { appointments: true, package: true },
  });

  return (
    <PageContainer>
      <p className="text-xs font-bold uppercase tracking-widest text-[#0b4f9c]">
        {my ? "ကျွန်ုပ်၏ အကောင့်" : "My account"}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">
        {my ? "ကျွန်ုပ်၏ တောင်းဆိုမှုများ" : "My visit requests"}
      </h1>
      <p className="mt-3 text-sm text-slate-500">
        {my
          ? "ဤစာမျက်နှာသည် သင်ပေးပို့သော တောင်းဆိုမှု အခြေအနေကိုသာ ပြသည်။ ဆေးစစ်ရလဒ် မပြပါ။"
          : "This page shows only the status of requests you sent. Lab results and diagnoses are not shown here."}
      </p>

      {inquiries.length === 0 ? (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">{my ? "တောင်းဆိုမှု မရှိသေးပါ" : "No requests yet"}</p>
          <a href={`/${locale}/contact`} className="mt-4 inline-flex rounded-full bg-[#0b4f9c] px-5 py-2 text-sm font-semibold text-white">
            {my ? "တောင်းဆိုမည်" : "Send a request"}
          </a>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {inquiries.map((row) => {
            const appt = row.appointments[0];
            const statusKey = appt?.status ?? row.status;
            const { label, cls } = badge(statusKey, my);
            return (
              <li key={row.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{row.fullName}</p>
                    <p className="text-xs text-slate-400">{row.createdAt.toISOString().slice(0, 10)}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>
                </div>
                {row.specialtySlug && (
                  <p className="mt-2 text-sm text-slate-600">{row.specialtySlug}</p>
                )}
                <p className="mt-3 text-sm leading-7 text-slate-700">{row.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </PageContainer>
  );
}
