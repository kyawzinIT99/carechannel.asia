"use client";

export function ConfirmAppointmentButton({ id }: { id: string }) {
  async function confirm() {
    await fetch(`/api/v1/staff/appointments/${id}/confirm`, { method: "POST" });
    window.location.reload();
  }
  return (
    <button
      type="button"
      onClick={confirm}
      className="rounded-full bg-[#0b4f9c] px-3 py-1 text-xs font-semibold text-white"
    >
      Confirm
    </button>
  );
}
