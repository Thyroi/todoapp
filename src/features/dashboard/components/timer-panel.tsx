import { TimerActionButtons } from "@/src/features/dashboard/components/timer-action-buttons";
import { TimerPanelMetrics } from "@/src/features/dashboard/components/timer-panel-metrics";
import { TimerPanelSession } from "@/src/features/dashboard/components/timer-panel-session";
import { TimerPanelStatus } from "@/src/features/dashboard/components/timer-panel-status";
import { useDashboard } from "@/src/features/dashboard/context";

export function TimerPanel() {
  const { state, utils } = useDashboard();
  const remaining = state.timer ? utils.getRemainingSeconds(state.timer) : 0;
  const timerStatus = state.timer?.isRunning
    ? "Running"
    : state.timer
      ? "Paused"
      : "Idle";
  const completed =
    state.timer?.completedCycles ??
    state.activeTimerTask?.pomodoroPlan?.completedCycles ??
    0;
  const total =
    state.timer?.totalCycles ?? state.activeTimerTask?.pomodoroPlan?.totalCycles ?? 0;
  const routineName =
    state.timer?.routine.name ??
    state.activeTimerTask?.pomodoroPlan?.routine.name ??
    "No routine attached";

  return (
    <div className="mt-5 rounded-4xl bg-[radial-gradient(circle_at_top,#1f2937_0%,#0f172a_55%,#020617_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)]">
      <div className="flex flex-col gap-5">
        <TimerPanelStatus
          notificationsEnabled={state.notificationsEnabled}
          taskTitle={state.timer?.taskTitle ?? state.activeTimerTask?.title ?? "None"}
          timerStatus={timerStatus}
        />
        <TimerPanelSession
          phase={state.timer?.phase ?? "idle"}
          routineName={routineName}
          taskTitle={
            state.timer?.taskTitle ?? state.activeTimerTask?.title ?? "No timer running"
          }
        />
        <TimerPanelMetrics
          completed={completed}
          mode={state.timer?.isRunning ? "Live" : state.timer ? "Paused" : "Waiting"}
          remaining={utils.formatSeconds(remaining)}
          total={total}
        />
      </div>

      <TimerActionButtons />
    </div>
  );
}
