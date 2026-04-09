import { useRestPhaseElapsed } from "@/src/features/dashboard/hooks/use-rest-phase-elapsed";
import { useWorkPhaseElapsed } from "@/src/features/dashboard/hooks/use-work-phase-elapsed";
import type { TimerState } from "@/src/features/dashboard/types";
import { useCallback, type MutableRefObject } from "react";

type TimerElapsedProps = {
  timerRef: MutableRefObject<TimerState | null>;
  isTransitioningRef: MutableRefObject<boolean>;
  workPhase: ReturnType<typeof useWorkPhaseElapsed>;
  restPhase: ReturnType<typeof useRestPhaseElapsed>;
};

export function useTimerElapsed(props: TimerElapsedProps) {
  return useCallback(async () => {
    const currentTimer = props.timerRef.current;
    if (!currentTimer || props.isTransitioningRef.current) return;
    props.isTransitioningRef.current = true;

    try {
      const nextCompletedCycles = Math.min(
        currentTimer.completedCycles + (currentTimer.phase === "work" ? 1 : 0),
        currentTimer.totalCycles,
      );
      if (currentTimer.phase === "work") {
        await props.workPhase(currentTimer, nextCompletedCycles);
        return;
      }
      props.restPhase(currentTimer);
    } finally {
      props.isTransitioningRef.current = false;
    }
  }, [props]);
}
