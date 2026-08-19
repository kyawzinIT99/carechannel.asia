import { prisma } from "@/server/db/prisma";

export const dynamic = "force-dynamic";

const STATUS_CLASS: Record<string, string> = {
  SENT:    "bg-emerald-100 text-emerald-700",
  QUEUED:  "bg-amber-100  text-amber-700",
  FAILED:  "bg-red-100    text-red-700",
  SKIPPED: "bg-slate-100  text-slate-500",
};

export default async function AdminOutboxPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const messages = await prisma.outboundMessage.findMany({
    where: status ? { status: status as "SENT" | "QUEUED" | "FAILED" | "SKIPPED" } : undefined,
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const counts = await prisma.outboundMessage.groupBy({
    by: ["status"],
    _count: { status: true },
  });
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count.status]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Outbox log</h1>
        <p className="mt-1 text-sm text-slate-500">
          Every email and Telegram dispatch routed through n8n inquiry-alert or Nodemailer fallback.
          <strong className="text-slate-700"> BCC, PDF, and SDDP live in your n8n instance — not managed here.</strong>
        </p>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 text-sm">
        {["", "SENT", "QUEUED", "FAILED", "SKIPPED"].map((s) => (
          <a
            key={s}
            href={s ? `?status=${s}` : "?"}
            className={`rounded-full px-3 py-1 ${(!status && !s) || status === s ? "bg-[#0b4f9c] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            {s || "All"} {s && countMap[s] ? `(${countMap[s]})` : ""}
          </a>
        ))}
      </div>

      {/* n8n flow reminder */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold">Automation flow (read-only)</p>
        <ol className="mt-2 space-y-1 list-decimal list-inside text-blue-700">
          <li><strong>Inquiry submitted</strong> → AI reply built → <code>N8N_INQUIRY_WEBHOOK</code> → Gmail + Staff Telegram (inquiry-alert)</li>
          <li><strong>Telegram message in</strong> → telegram-ingress → <code>/api/v1/internal/n8n/telegram</code> → reply back</li>
          <li><strong>Daily 08:00 Bangkok</strong> → appointment-reminder → <code>/api/v1/internal/n8n/reminders</code> → Gmail reminder</li>
          <li><strong>Appointment confirmed</strong> by coordinator → <code>dispatchApprovedMessage</code> → same webhook → Gmail</li>
        </ol>
        <p className="mt-2 text-xs text-blue-600">Fallback: if n8n webhook fails, Nodemailer sends directly. Status reflects which path was used.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Locale</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Error</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No messages yet.</td>
              </tr>
            ) : null}
            {messages.map((msg) => (
              <tr key={msg.id} className="align-top hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {msg.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                </td>
                <td className="max-w-[180px] truncate px-4 py-3 text-slate-700">{msg.toAddress}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-mono">
                    {msg.channel}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{msg.templateKey}</td>
                <td className="px-4 py-3 text-xs font-semibold uppercase text-slate-500">{msg.locale}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_CLASS[msg.status] ?? "bg-slate-100 text-slate-500"}`}>
                    {msg.status}
                  </span>
                </td>
                <td className="max-w-[200px] px-4 py-3 text-xs text-red-600">{msg.error ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
