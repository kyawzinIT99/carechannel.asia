import { prisma } from "@/server/db/prisma";

export async function listInquiryReports(status?: string) {
  const where = status === "NEW" ? { status: "NEW" as const } : undefined;
  const rows = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { package: true, appointments: true, assignedTo: true },
  });
  return rows.map((row) => {
    const appt = row.appointments[0];
    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      visitorCode: row.visitorCode || "",
      fullName: row.fullName,
      phone: row.phone,
      email: row.email || "",
      country: row.country || "",
      returningPatient: row.returningPatient ? "yes" : "no",
      locale: row.locale,
      specialty: row.specialtySlug || "",
      packageName: row.package?.nameEn || "",
      packageCode: row.package?.code || "",
      status: row.status,
      assignedTo: row.assignedTo?.name || "",
      message: row.message,
      airportPickup: appt?.airportPickup ? "yes" : "no",
      accommodationHelp: appt?.accommodationHelp ? "yes" : "no",
      visaHelp: appt?.visaHelp ? "yes" : "no",
      interpreter: appt?.interpreterNeeded ? appt.interpreterLang || "yes" : "no",
      preferredDate: appt?.preferredDate ? appt.preferredDate.toISOString().slice(0, 10) : "",
    };
  });
}

export function inquiriesToCsv(rows: Awaited<ReturnType<typeof listInquiryReports>>) {
  const headers = [
    "Date",
    "Code",
    "Name",
    "Phone",
    "Email",
    "Country",
    "Returning",
    "Locale",
    "Specialty",
    "Package",
    "Status",
    "Assigned",
    "Pickup",
    "Apartment help",
    "Visa help",
    "Interpreter",
    "Preferred date",
    "Message",
  ];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = rows.map((row) =>
    [
      row.createdAt.slice(0, 16).replace("T", " "),
      row.visitorCode,
      row.fullName,
      row.phone,
      row.email,
      row.country,
      row.returningPatient,
      row.locale,
      row.specialty,
      row.packageName,
      row.status,
      row.assignedTo,
      row.airportPickup,
      row.accommodationHelp,
      row.visaHelp,
      row.interpreter,
      row.preferredDate,
      row.message,
    ]
      .map((cell) => escape(String(cell)))
      .join(","),
  );
  return `\uFEFF${headers.join(",")}\n${lines.join("\n")}\n`;
}
