import { useDashboard } from "@/src/features/dashboard/context";

export function DashboardStats() {
  const { state } = useDashboard();
  const stats = [
    ["Total tasks", state.taskStats.total.toString()],
    ["In progress", state.taskStats.active.toString()],
    ["Completed", state.taskStats.done.toString()],
    ["Routines", state.data.routines.length.toString()],
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {stats.map(([label, value]) => (
        <article
          key={label}
          className="flex flex-col justify-between rounded-3xl border border-slate-900/10 bg-slate-950 px-4 py-3 text-white"
        >
          <p className="text-xs uppercase tracking-[0.18em] text-slate-300">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{value}</p>
        </article>
      ))}
    </div>
  );
}
