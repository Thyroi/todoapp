import { useDashboardNoteActions } from "@/src/features/dashboard/hooks/use-dashboard-note-actions";
import { useDashboardPlanActions } from "@/src/features/dashboard/hooks/use-dashboard-plan-actions";
import { useDashboardRoutineActions } from "@/src/features/dashboard/hooks/use-dashboard-routine-actions";
import type { useDashboardServices } from "@/src/features/dashboard/hooks/use-dashboard-services";
import { useDashboardTaskActions } from "@/src/features/dashboard/hooks/use-dashboard-task-actions";

type DashboardServices = ReturnType<typeof useDashboardServices>;

export function useDashboardDomainActions(parts: DashboardServices) {
  const taskActions = useDashboardTaskActions({
    ...parts.state,
    refreshDashboard: parts.refresh,
    runMutation: parts.runMutation,
    stopTimerForTask: parts.timer.stopTimerForTask,
  });
  const noteActions = useDashboardNoteActions({
    ...parts.state,
    refreshDashboard: parts.refresh,
    runMutation: parts.runMutation,
  });
  const planActions = useDashboardPlanActions({
    planDrafts: parts.state.planDrafts,
    refreshDashboard: parts.refresh,
    runMutation: parts.runMutation,
    stopTimerForTask: parts.timer.stopTimerForTask,
  });
  const routineActions = useDashboardRoutineActions({
    ...parts.state,
    refreshDashboard: parts.refresh,
    runMutation: parts.runMutation,
  });

  return { taskActions, noteActions, planActions, routineActions };
}
