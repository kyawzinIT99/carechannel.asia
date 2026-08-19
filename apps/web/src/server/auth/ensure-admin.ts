import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/server/db/prisma";

export function bootstrapAdminEmail() {
  return (process.env.ADMIN_EMAIL ?? "admin@chiangmairam.local").trim().toLowerCase();
}

export function bootstrapAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "ChangeMe_RamHospital_2026";
}

/** Creates or repairs the env admin account so an unseeded sqlite disk can still sign in. */
export async function ensureBootstrapAdmin(email: string, password: string) {
  const envEmail = bootstrapAdminEmail();
  const envPassword = bootstrapAdminPassword();
  if (email !== envEmail || password !== envPassword) return;

  const passwordHash = await bcrypt.hash(envPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: envEmail },
    update: { passwordHash, isActive: true, name: "Hospital Admin" },
    create: {
      email: envEmail,
      passwordHash,
      name: "Hospital Admin",
      locale: "en",
      isActive: true,
    },
  });
  await prisma.userRole.deleteMany({ where: { userId: admin.id } });
  await prisma.userRole.createMany({
    data: [
      { userId: admin.id, role: Role.SUPER_ADMIN },
      { userId: admin.id, role: Role.HOSPITAL_ADMIN },
      { userId: admin.id, role: Role.INTERNATIONAL_COORDINATOR },
    ],
  });
}
