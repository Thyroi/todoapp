import type { TimerState } from "@/src/features/dashboard/types";
import type { DashboardData } from "@/src/lib/contracts";
import type { MutableRefObject } from "react";

export function useTimerSync(
  timerRef: MutableRefObject<TimerState | null>,
  clearTimer: (message?: string) => void,
) {
  function syncWithData(nextData: DashboardData) {
    const currentTimer = timerRef.current;
    if (!currentTimer) return;
    if (!nextData.tasks.some((task) => task.id === currentTimer.taskId)) clearTimer();
  }

  function stopTimerForTask(taskId: string) {
    if (timerRef.current?.taskId === taskId) clearTimer();
  }

  return { syncWithData, stopTimerForTask };
}
