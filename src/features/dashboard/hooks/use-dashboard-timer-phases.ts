import { useRestPhaseElapsed } from "@/src/features/dashboard/hooks/use-rest-phase-elapsed";
import { useTimerElapsed } from "@/src/features/dashboard/hooks/use-timer-elapsed";
import type { useTimerStatus } from "@/src/features/dashboard/hooks/use-timer-status";
import { useWorkPhaseElapsed } from "@/src/features/dashboard/hooks/use-work-phase-elapsed";
import { setActiveTimerTaskId } from "@/src/store/slices/app-slice";

type TimerStatus = ReturnType<typeof useTimerStatus>;

export function useDashboardTimerPhases(
  status: TimerStatus,
  refreshDashboard: () => Promise<void>,
  notify: (title: string, body: string) => void,
  playTimerSound: (variant: "transition" | "complete") => Promise<void>,
) {
  const workPhase = useWorkPhaseElapsed({
    setTimer: status.setTimer,
    clearActiveTimer: () => status.dispatch(setActiveTimerTaskId(null)),
    refreshDashboard,
    notify,
    playTimerSound,
  });
  const restPhase = useRestPhaseElapsed({ setTimer: status.setTimer, notify });

  return useTimerElapsed({
    timerRef: status.timerRef,
    isTransitioningRef: status.isTransitioningRef,
    workPhase,
    restPhase,
  });
}
