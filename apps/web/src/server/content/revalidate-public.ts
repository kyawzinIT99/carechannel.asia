import { revalidatePath } from "next/cache";

/** After an admin save, refresh the public pages that read the same records. */
export function revalidatePublicSite() {
  for (const locale of ["en", "my"] as const) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/packages`);
    revalidatePath(`/${locale}/contact`);
    revalidatePath(`/${locale}/about`);
    revalidatePath(`/${locale}/specialties`);
    revalidatePath(`/${locale}/visit`);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(`/${locale}/admin/packages`);
    revalidatePath(`/${locale}/admin/home`);
    revalidatePath(`/${locale}/admin/promotions`);
  }
}
