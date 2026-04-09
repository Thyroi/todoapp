import { RoutineCard } from "@/src/features/dashboard/components/routine-card";
import { useDashboard } from "@/src/features/dashboard/context";

export function RoutinesSection() {
  const { state, actions } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Routines</h2>
          <p className="mt-1 text-sm text-slate-600">
            Global presets are read-only. Your own routines can be edited or removed
            here.
          </p>
        </div>
        <button
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
          onClick={() => void actions.refreshDashboard("Dashboard refreshed.")}
          type="button"
        >
          Refresh
        </button>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {state.data.routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>
    </section>
  );
}
