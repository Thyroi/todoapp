import type { TimerState } from "@/src/features/dashboard/types";
import { getRemainingSeconds } from "@/src/features/dashboard/utils/timer";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type TimerPauseProps = {
  timer: TimerState | null;
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  ensureAudioContext: () => Promise<AudioContext | null>;
};

export function useTimerPause(props: TimerPauseProps) {
  return function handleTimerPauseToggle() {
    if (!props.timer) return;
    const nextIsRunning = !props.timer.isRunning;
    if (nextIsRunning) void props.ensureAudioContext();
    props.setTimer((current) =>
      current
        ? {
            ...current,
            phaseEndsAt: nextIsRunning
              ? Date.now() + current.remainingSeconds * 1000
              : null,
            remainingSeconds: nextIsRunning
              ? current.remainingSeconds
              : getRemainingSeconds(current),
            isRunning: nextIsRunning,
          }
        : current,
    );
    toast.info(nextIsRunning ? "Timer resumed." : "Timer paused.");
  };
}
