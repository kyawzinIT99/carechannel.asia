import { prisma } from "@/server/db/prisma";
import { TemplateEditor } from "@/components/admin/template-editor";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const templates = await prisma.messageTemplate.findMany({ orderBy: [{ key: "asc" }, { locale: "asc" }] });

  const grouped: Record<string, typeof templates> = {};
  for (const t of templates) {
    grouped[t.key] = grouped[t.key] ?? [];
    grouped[t.key].push(t);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Message templates</h1>
      <p className="text-sm text-slate-500">
        These are the auto-reply templates sent when a visitor submits a request.
        Edit the subject and body. Variables like <code>{"{{name}}"}</code>, <code>{"{{email}}"}</code> are replaced automatically.
        Changes take effect for the next inquiry.
      </p>

      {Object.entries(grouped).length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-slate-500">No templates. Run <code>npm run db:seed</code>.</p>
      ) : (
        Object.entries(grouped).map(([key, rows]) => (
          <div key={key} className="rounded-2xl bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <p className="font-mono text-sm font-semibold text-[#0b4f9c]">{key}</p>
            </div>
            <div className="divide-y divide-slate-100">
              {rows.map((tpl) => (
                <TemplateEditor key={tpl.id} template={tpl} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
