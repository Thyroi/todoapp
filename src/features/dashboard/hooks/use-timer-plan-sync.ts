import type { TimerState } from "@/src/features/dashboard/types";
import { apiRequest } from "@/src/features/dashboard/utils/api-request";
import { toast } from "sonner";

export function useTimerPlanSync(refreshDashboard: () => Promise<void>) {
  return async function syncPlanProgress(timer: TimerState, completedCycles: number) {
    try {
      await apiRequest(`/api/tasks/${timer.taskId}/plan`, {
        method: "PUT",
        body: JSON.stringify({
          routineId: timer.routine.id,
          totalCycles: timer.totalCycles,
          completedCycles,
        }),
      });
      await refreshDashboard();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not sync plan progress.",
      );
    }
  };
}
