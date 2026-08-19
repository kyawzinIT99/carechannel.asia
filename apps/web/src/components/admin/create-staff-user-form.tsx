"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CreateStaffUserForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setErr("");
    setOk("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/v1/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });
    setBusy(false);
    if (res.status === 409) {
      setErr("That email already exists.");
      return;
    }
    if (!res.ok) {
      setErr("Could not create the user. Use a valid email and a password of at least 8 characters.");
      return;
    }
    setOk("User created. They can sign in at Staff login.");
    event.currentTarget.reset();
    router.refresh();
  }

  const field = "mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-[#0b4f9c] focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <h2 className="text-base font-semibold text-[#1a2330]">Add a staff or admin user</h2>
      <p className="mt-1 text-sm text-slate-500">
        HOSPITAL_ADMIN and SUPER_ADMIN can open the admin panel. INTERNATIONAL_COORDINATOR can open the coordinator inbox.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Name
          <input name="name" required minLength={2} className={field} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Email
          <input name="email" type="email" required className={field} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Password
          <input name="password" type="password" required minLength={8} className={field} />
        </label>
        <label className="text-sm font-medium text-slate-600">
          Role
          <select name="role" defaultValue="HOSPITAL_ADMIN" className={field}>
            <option value="HOSPITAL_ADMIN">HOSPITAL_ADMIN — admin panel</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN — full admin</option>
            <option value="INTERNATIONAL_COORDINATOR">INTERNATIONAL_COORDINATOR — staff inbox</option>
            <option value="RECEPTION">RECEPTION — staff inbox</option>
          </select>
        </label>
      </div>
      <button
        disabled={busy}
        className="mt-5 rounded-full bg-[#0b4f9c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#083a73] disabled:opacity-50"
      >
        {busy ? "Creating…" : "Create user"}
      </button>
      {ok ? <p className="mt-3 text-sm font-medium text-emerald-700">{ok}</p> : null}
      {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
    </form>
  );
}
