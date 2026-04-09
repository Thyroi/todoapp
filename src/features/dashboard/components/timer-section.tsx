import { TimerPanel } from "@/src/features/dashboard/components/timer-panel";
import { useDashboard } from "@/src/features/dashboard/context";

export function TimerSection() {
  const { state, actions } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Timer</h2>
          <p className="mt-1 text-sm text-slate-600">
            Run work and rest phases from any task that already has a plan.
          </p>
        </div>
        <button
          className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
          onClick={actions.handleNotificationToggle}
          type="button"
        >
          {state.notificationsEnabled ? "Disable Alerts" : "Enable Alerts"}
        </button>
      </div>
      <TimerPanel />
    </section>
  );
}
