import type { PlanDraft } from "@/src/features/dashboard/types";
import { apiRequest } from "@/src/features/dashboard/utils/api-request";

type PlanActionsProps = {
  planDrafts: Record<string, PlanDraft>;
  refreshDashboard: (successMessage?: string) => Promise<void>;
  runMutation: (work: () => Promise<void>) => Promise<void>;
  stopTimerForTask: (taskId: string) => void;
};

export function useDashboardPlanActions(props: PlanActionsProps) {
  async function handlePlanSave(taskId: string) {
    await props.runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/plan`, {
        method: "PUT",
        body: JSON.stringify(props.planDrafts[taskId]),
      });
      await props.refreshDashboard("Pomodoro plan saved.");
    });
  }

  async function handlePlanDelete(taskId: string) {
    await props.runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/plan`, { method: "DELETE" });
      props.stopTimerForTask(taskId);
      await props.refreshDashboard("Pomodoro plan removed.");
    });
  }

  return { handlePlanSave, handlePlanDelete };
}
