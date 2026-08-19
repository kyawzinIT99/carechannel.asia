import { redirect } from "next/navigation";

/** /admin and /admin/* → /en/admin/* so the address bar never 404s. */
export default async function AdminAliasPage({
  params,
}: {
  params: Promise<{ rest?: string[] }>;
}) {
  const { rest } = await params;
  redirect(rest?.length ? `/en/admin/${rest.join("/")}` : "/en/admin");
}
