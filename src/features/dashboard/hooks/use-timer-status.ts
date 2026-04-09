import type { TimerState } from "@/src/features/dashboard/types";
import type { DashboardData } from "@/src/lib/contracts";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useEffect, useRef, useState } from "react";

export function useTimerStatus(data: DashboardData) {
  const dispatch = useAppDispatch();
  const notificationsEnabled = useAppSelector(
    (state) => state.app.notificationsEnabled,
  );
  const activeTimerTaskId = useAppSelector((state) => state.app.activeTimerTaskId);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<TimerState | null>(null);
  const isTransitioningRef = useRef(false);
  const [timer, setTimer] = useState<TimerState | null>(null);
  const activeTimerTask =
    data.tasks.find((task) => task.id === activeTimerTaskId) ?? null;

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  return {
    dispatch,
    notificationsEnabled,
    audioContextRef,
    timerRef,
    isTransitioningRef,
    timer,
    setTimer,
    activeTimerTask,
  };
}
