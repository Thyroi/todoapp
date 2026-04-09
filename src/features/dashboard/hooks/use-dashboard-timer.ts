import { useDashboardTimerRuntime } from "@/src/features/dashboard/hooks/use-dashboard-timer-runtime";
import { useTimerEffects } from "@/src/features/dashboard/hooks/use-timer-effects";
import { useTimerStatus } from "@/src/features/dashboard/hooks/use-timer-status";
import type { DashboardData } from "@/src/lib/contracts";

type UseDashboardTimerProps = {
  data: DashboardData;
  refreshDashboard: () => Promise<void>;
};

export function useDashboardTimer({ data, refreshDashboard }: UseDashboardTimerProps) {
  const status = useTimerStatus(data);
  const runtime = useDashboardTimerRuntime(status, refreshDashboard);
  useTimerEffects({
    timer: status.timer,
    setTimer: status.setTimer,
    timerRef: status.timerRef,
    handleTimerElapsed: runtime.handleTimerElapsed,
  });

  return {
    timer: status.timer,
    activeTimerTask: status.activeTimerTask,
    notificationsEnabled: status.notificationsEnabled,
    syncWithData: runtime.sync.syncWithData,
    stopTimerForTask: runtime.sync.stopTimerForTask,
    handleNotificationToggle: runtime.handleNotificationToggle,
    handleTimerStart: runtime.controls.handleTimerStart,
    handleTimerPauseToggle: runtime.controls.handleTimerPauseToggle,
    handleTimerStop: runtime.controls.handleTimerStop,
  };
}
