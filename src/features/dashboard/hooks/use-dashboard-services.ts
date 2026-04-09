import { useDashboardDraftActions } from "@/src/features/dashboard/hooks/use-dashboard-draft-actions";
import { useDashboardFilters } from "@/src/features/dashboard/hooks/use-dashboard-filters";
import { useDashboardMutation } from "@/src/features/dashboard/hooks/use-dashboard-mutation";
import { useDashboardRefresh } from "@/src/features/dashboard/hooks/use-dashboard-refresh";
import { useDashboardSessionActions } from "@/src/features/dashboard/hooks/use-dashboard-session-actions";
import { useDashboardState } from "@/src/features/dashboard/hooks/use-dashboard-state";
import { useDashboardTimer } from "@/src/features/dashboard/hooks/use-dashboard-timer";
import type { DashboardData } from "@/src/lib/contracts";

export function useDashboardServices(initialData: DashboardData) {
  const state = useDashboardState(initialData);
  const filters = useDashboardFilters(state.data.tasks);
  const timer = useDashboardTimer({
    data: state.data,
    refreshDashboard: () => refresh(),
  });
  const refresh = useDashboardRefresh({
    setData: state.setData,
    setTaskDrafts: state.setTaskDrafts,
    setPlanDrafts: state.setPlanDrafts,
    setRoutineDrafts: state.setRoutineDrafts,
    syncWithData: timer.syncWithData,
  });
  const runMutation = useDashboardMutation();
  const session = useDashboardSessionActions(runMutation);
  const drafts = useDashboardDraftActions(state);

  return { state, filters, timer, refresh, runMutation, session, drafts };
}
