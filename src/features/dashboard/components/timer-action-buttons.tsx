import { useDashboard } from "@/src/features/dashboard/context";

export function TimerActionButtons() {
  const { state, actions } = useDashboard();

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={!state.timer}
        onClick={actions.handleTimerPauseToggle}
        type="button"
      >
        {state.timer?.isRunning ? "Pause" : "Resume"}
      </button>
      <button
        className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        disabled={!state.timer}
        onClick={actions.handleTimerStop}
        type="button"
      >
        Stop
      </button>
    </div>
  );
}
