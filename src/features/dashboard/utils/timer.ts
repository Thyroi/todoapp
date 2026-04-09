import type { TimerPhase, TimerState } from "@/src/features/dashboard/types";
import type { RoutineDto } from "@/src/lib/contracts";

type RunningBase = Omit<
  TimerState,
  "phaseDurationSeconds" | "phaseEndsAt" | "remainingSeconds" | "isRunning"
> & { phase: TimerPhase };

export function getPhaseDurationSeconds(routine: RoutineDto, phase: TimerPhase) {
  if (phase === "work") return routine.workMinutes * 60;
  if (phase === "short-rest") return routine.shortRestMinutes * 60;
  return routine.longRestMinutes * 60;
}

export function getRemainingSeconds(timer: TimerState) {
  if (!timer.isRunning || timer.phaseEndsAt === null) return timer.remainingSeconds;
  return Math.max(0, Math.ceil((timer.phaseEndsAt - Date.now()) / 1000));
}

export function buildRunningTimerState(baseTimer: RunningBase): TimerState {
  const phaseDurationSeconds = getPhaseDurationSeconds(
    baseTimer.routine,
    baseTimer.phase,
  );

  return {
    ...baseTimer,
    phaseDurationSeconds,
    phaseEndsAt: Date.now() + phaseDurationSeconds * 1000,
    remainingSeconds: phaseDurationSeconds,
    isRunning: true,
  };
}

export function buildCompletedTimer(
  timer: TimerState,
  completedCycles: number,
): TimerState {
  const remainingSeconds = timer.routine.workMinutes * 60;

  return {
    ...timer,
    completedCycles,
    phaseDurationSeconds: remainingSeconds,
    phaseEndsAt: null,
    remainingSeconds,
    isRunning: false,
  };
}
