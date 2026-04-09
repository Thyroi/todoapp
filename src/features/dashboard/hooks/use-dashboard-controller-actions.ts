import type { useDashboardDomainActions } from "@/src/features/dashboard/hooks/use-dashboard-domain-actions";
import type { useDashboardServices } from "@/src/features/dashboard/hooks/use-dashboard-services";
import { useMemo } from "react";

type DashboardControllerActionsParts = ReturnType<typeof useDashboardServices> &
  ReturnType<typeof useDashboardDomainActions>;

export function useDashboardControllerActions(parts: DashboardControllerActionsParts) {
  return useMemo(
    () => ({
      setSearch: parts.filters.setSearch,
      setStatusFilter: parts.filters.setStatusFilter,
      setNewTask: parts.state.setNewTask,
      setNewRoutine: parts.state.setNewRoutine,
      ...parts.drafts,
      refreshDashboard: parts.refresh,
      handleLogout: parts.session.handleLogout,
      ...parts.taskActions,
      ...parts.noteActions,
      ...parts.planActions,
      ...parts.routineActions,
      handleNotificationToggle: parts.timer.handleNotificationToggle,
      handleTimerStart: parts.timer.handleTimerStart,
      handleTimerPauseToggle: parts.timer.handleTimerPauseToggle,
      handleTimerStop: parts.timer.handleTimerStop,
    }),
    [parts],
  );
}
