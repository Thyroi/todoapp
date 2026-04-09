import type { TimerState } from "@/src/features/dashboard/types";
import {
  buildCompletedTimer,
  buildRunningTimerState,
} from "@/src/features/dashboard/utils/timer";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type TransitionProps = {
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  clearActiveTimer: () => void;
  notify: (title: string, body: string) => void;
};

export function useWorkPhaseTransition(props: TransitionProps) {
  return function finishWorkPhase(timer: TimerState, completedCycles: number) {
    if (completedCycles >= timer.totalCycles) {
      props.notify(
        "Pomodoro completed",
        `${timer.taskTitle} reached its target cycles.`,
      );
      toast.success(`Task "${timer.taskTitle}" completed all planned cycles.`);
      props.setTimer(buildCompletedTimer(timer, completedCycles));
      return props.clearActiveTimer();
    }

    const nextPhase =
      completedCycles % timer.routine.cyclesBeforeLongRest === 0
        ? "long-rest"
        : "short-rest";
    props.setTimer(
      buildRunningTimerState({ ...timer, completedCycles, phase: nextPhase }),
    );
    props.notify(
      nextPhase === "long-rest" ? "Long rest started" : "Short rest started",
      `${timer.taskTitle} finished a work cycle.`,
    );
    toast.info(
      nextPhase === "long-rest"
        ? `Long rest started for "${timer.taskTitle}".`
        : `Short rest started for "${timer.taskTitle}".`,
    );
  };
}
