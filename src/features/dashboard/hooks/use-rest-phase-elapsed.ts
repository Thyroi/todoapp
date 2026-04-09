import type { TimerState } from "@/src/features/dashboard/types";
import { buildRunningTimerState } from "@/src/features/dashboard/utils/timer";
import { useCallback, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";

type RestPhaseProps = {
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  notify: (title: string, body: string) => void;
};

export function useRestPhaseElapsed(props: RestPhaseProps) {
  return useCallback(
    (timer: TimerState) => {
      props.setTimer(buildRunningTimerState({ ...timer, phase: "work" }));
      props.notify("Work session started", `${timer.taskTitle} is back in focus mode.`);
      toast.info(`Work session resumed for "${timer.taskTitle}".`);
    },
    [props],
  );
}
