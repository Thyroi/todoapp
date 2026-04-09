import type { TimerState } from "@/src/features/dashboard/types";
import { getRemainingSeconds } from "@/src/features/dashboard/utils/timer";
import {
  useEffect,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

type TimerVisibilitySyncProps = {
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  timerRef: MutableRefObject<TimerState | null>;
  handleTimerElapsed: () => void | Promise<void>;
};

export function useTimerVisibilitySync(props: TimerVisibilitySyncProps) {
  const { setTimer, timerRef, handleTimerElapsed } = props;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleVisibilityChange = () => {
      const currentTimer = timerRef.current;
      if (!currentTimer?.isRunning || document.hidden) return;
      const remainingSeconds = getRemainingSeconds(currentTimer);
      if (remainingSeconds <= 0) return void handleTimerElapsed();
      setTimer((latestTimer) =>
        latestTimer ? { ...latestTimer, remainingSeconds } : latestTimer,
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleTimerElapsed, setTimer, timerRef]);
}
