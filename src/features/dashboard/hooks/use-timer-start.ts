import type { TimerState } from "@/src/features/dashboard/types";
import { buildRunningTimerState } from "@/src/features/dashboard/utils/timer";
import type { TaskDto } from "@/src/lib/contracts";
import { setActiveTimerTaskId } from "@/src/store/slices/app-slice";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type TimerStartProps = {
  setTimer: Dispatch<SetStateAction<TimerState | null>>;
  dispatch: (action: ReturnType<typeof setActiveTimerTaskId>) => void;
  ensureAudioContext: () => Promise<AudioContext | null>;
};

export function useTimerStart(props: TimerStartProps) {
  return function handleTimerStart(task: TaskDto) {
    if (!task.pomodoroPlan)
      return toast.error("Attach a pomodoro plan before starting the timer.");
    void props.ensureAudioContext();
    props.setTimer(
      buildRunningTimerState({
        taskId: task.id,
        taskTitle: task.title,
        routine: task.pomodoroPlan.routine,
        totalCycles: task.pomodoroPlan.totalCycles,
        completedCycles: task.pomodoroPlan.completedCycles,
        phase: "work",
      }),
    );
    props.dispatch(setActiveTimerTaskId(task.id));
    toast.success(`Timer started for "${task.title}".`);
  };
}
