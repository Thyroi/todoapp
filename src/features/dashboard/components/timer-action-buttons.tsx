import { useDashboard } from "@/src/features/dashboard/context";

export function TimerActionButtons() {
  const { state, actions } = useDashboard();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:text-slate-700"
        disabled={!state.timer}
        onClick={actions.handleTimerPauseToggle}
        type="button"
      >
        {state.timer?.isRunning ? "Pause" : "Resume"}
      </button>
      <button
        className="rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
        disabled={!state.timer}
        onClick={actions.handleTimerStop}
        type="button"
      >
        Stop
      </button>
    </div>
  );
}
