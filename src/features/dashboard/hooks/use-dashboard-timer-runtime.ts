import { useDashboardTimerPhases } from "@/src/features/dashboard/hooks/use-dashboard-timer-phases";
import { useNotificationToggle } from "@/src/features/dashboard/hooks/use-notification-toggle";
import { useTimerAudio } from "@/src/features/dashboard/hooks/use-timer-audio";
import { useTimerControls } from "@/src/features/dashboard/hooks/use-timer-controls";
import { useTimerNotify } from "@/src/features/dashboard/hooks/use-timer-notify";
import type { useTimerStatus } from "@/src/features/dashboard/hooks/use-timer-status";
import { useTimerSync } from "@/src/features/dashboard/hooks/use-timer-sync";
import { setActiveTimerTaskId } from "@/src/store/slices/app-slice";
import { toast } from "sonner";

type TimerStatus = ReturnType<typeof useTimerStatus>;

export function useDashboardTimerRuntime(
  status: TimerStatus,
  refreshDashboard: () => Promise<void>,
) {
  const { ensureAudioContext, playTimerSound } = useTimerAudio(status.audioContextRef);
  const notify = useTimerNotify(status.notificationsEnabled);
  const clearTimer = (message?: string) => {
    status.setTimer(null);
    status.dispatch(setActiveTimerTaskId(null));
    if (message) toast.info(message);
  };
  const handleTimerElapsed = useDashboardTimerPhases(
    status,
    refreshDashboard,
    notify,
    playTimerSound,
  );

  return {
    sync: useTimerSync(status.timerRef, clearTimer),
    controls: useTimerControls({
      timer: status.timer,
      setTimer: status.setTimer,
      dispatch: status.dispatch,
      clearTimer,
      ensureAudioContext,
    }),
    handleNotificationToggle: useNotificationToggle({
      notificationsEnabled: status.notificationsEnabled,
      dispatch: status.dispatch,
      ensureAudioContext,
    }),
    handleTimerElapsed,
  };
}
