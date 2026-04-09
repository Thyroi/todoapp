import { TimerActionButtons } from "@/src/features/dashboard/components/timer-action-buttons";
import { useDashboard } from "@/src/features/dashboard/context";

export function TimerPanel() {
  const { state, utils } = useDashboard();
  const remaining = state.timer ? utils.getRemainingSeconds(state.timer) : 0;
  const completed =
    state.timer?.completedCycles ??
    state.activeTimerTask?.pomodoroPlan?.completedCycles ??
    0;
  const total =
    state.timer?.totalCycles ?? state.activeTimerTask?.pomodoroPlan?.totalCycles ?? 0;

  return (
    <div className="mt-5 rounded-4xl bg-slate-950 p-5 text-white">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Active Task</p>
      <h3 className="mt-2 text-2xl font-semibold">
        {state.timer?.taskTitle ?? state.activeTimerTask?.title ?? "No timer running"}
      </h3>
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Phase</p>
          <p className="mt-2 text-lg font-medium capitalize">
            {state.timer?.phase ?? "idle"}
          </p>
        </div>
        <p className="text-5xl font-semibold tracking-tight">
          {utils.formatSeconds(remaining)}
        </p>
      </div>
      <p className="mt-4 text-sm text-slate-300">
        Completed cycles: {completed} / {total}
      </p>
      <TimerActionButtons />
    </div>
  );
}
