import { useTimerVisibilitySync } from "@/src/features/dashboard/hooks/use-timer-visibility-sync";
import type { TimerState } from "@/src/features/dashboard/types";
import { getRemainingSeconds } from "@/src/features/dashboard/utils/timer";
import {
  useEffect,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

type TimerEffectsProps = {
  timer: TimerState | null;
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  timerRef: MutableRefObject<TimerState | null>;
  handleTimerElapsed: () => void | Promise<void>;
};

export function useTimerEffects(props: TimerEffectsProps) {
  const { timer, setTimer, handleTimerElapsed } = props;

  useEffect(() => {
    if (!timer?.isRunning) return;
    const remainingSeconds = getRemainingSeconds(timer);
    if (remainingSeconds <= 0) return void handleTimerElapsed();
    const delay = timer.phaseEndsAt
      ? Math.max(50, Math.min(timer.phaseEndsAt - Date.now(), 1000))
      : 1000;
    const timeoutId = window.setTimeout(
      () =>
        setTimer((current) =>
          current
            ? { ...current, remainingSeconds: getRemainingSeconds(current) }
            : null,
        ),
      delay,
    );
    return () => window.clearTimeout(timeoutId);
  }, [handleTimerElapsed, setTimer, timer]);
  useTimerVisibilitySync(props);
}
