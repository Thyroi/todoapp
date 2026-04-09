import { useTimerPlanSync } from "@/src/features/dashboard/hooks/use-timer-plan-sync";
import { useWorkPhaseTransition } from "@/src/features/dashboard/hooks/use-work-phase-transition";
import type { TimerState } from "@/src/features/dashboard/types";
import { useCallback, type Dispatch, type SetStateAction } from "react";

type WorkPhaseProps = {
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  clearActiveTimer: () => void;
  refreshDashboard: () => Promise<void>;
  notify: (title: string, body: string) => void;
  playTimerSound: (variant: "transition" | "complete") => Promise<void>;
};

export function useWorkPhaseElapsed(props: WorkPhaseProps) {
  const syncPlanProgress = useTimerPlanSync(props.refreshDashboard);
  const finishWorkPhase = useWorkPhaseTransition(props);

  return useCallback(
    async (timer: TimerState, nextCompletedCycles: number) => {
      const isFinalCycle = nextCompletedCycles >= timer.totalCycles;
      void props.playTimerSound(isFinalCycle ? "complete" : "transition");
      await syncPlanProgress(timer, nextCompletedCycles);
      finishWorkPhase(timer, nextCompletedCycles);
    },
    [finishWorkPhase, props, syncPlanProgress],
  );
}
