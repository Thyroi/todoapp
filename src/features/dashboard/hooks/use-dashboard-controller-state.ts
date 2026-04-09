import type { useDashboardServices } from "@/src/features/dashboard/hooks/use-dashboard-services";
import { useMemo } from "react";

type DashboardControllerStateParts = ReturnType<typeof useDashboardServices>;

export function useDashboardControllerState(parts: DashboardControllerStateParts) {
  return useMemo(
    () => ({
      data: parts.state.data,
      search: parts.filters.search,
      statusFilter: parts.filters.statusFilter,
      newTask: parts.state.newTask,
      newRoutine: parts.state.newRoutine,
      taskDrafts: parts.state.taskDrafts,
      planDrafts: parts.state.planDrafts,
      noteDrafts: parts.state.noteDrafts,
      routineDrafts: parts.state.routineDrafts,
      filteredTasks: parts.filters.filteredTasks,
      taskStats: parts.filters.taskStats,
      timer: parts.timer.timer,
      activeTimerTask: parts.timer.activeTimerTask,
      notificationsEnabled: parts.timer.notificationsEnabled,
      isPending: parts.session.isPending,
    }),
    [parts],
  );
}
