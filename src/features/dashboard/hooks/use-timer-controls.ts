import { useTimerPause } from "@/src/features/dashboard/hooks/use-timer-pause";
import { useTimerStart } from "@/src/features/dashboard/hooks/use-timer-start";
import type { TimerState } from "@/src/features/dashboard/types";
import { setActiveTimerTaskId } from "@/src/store/slices/app-slice";
import type { Dispatch, SetStateAction } from "react";

type TimerControlsProps = {
  timer: TimerState | null;
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  dispatch: (action: ReturnType<typeof setActiveTimerTaskId>) => void;
  clearTimer: (message?: string) => void;
  ensureAudioContext: () => Promise<AudioContext | null>;
};

export function useTimerControls(props: TimerControlsProps) {
  const handleTimerStart = useTimerStart(props);
  const handleTimerPauseToggle = useTimerPause(props);

  return {
    handleTimerStart,
    handleTimerPauseToggle,
    handleTimerStop: () => props.clearTimer("Timer stopped."),
  };
}
