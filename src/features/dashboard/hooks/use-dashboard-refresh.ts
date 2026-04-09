import { apiRequest } from "@/src/features/dashboard/utils/api-request";
import {
  buildPlanDrafts,
  buildRoutineDrafts,
  buildTaskDrafts,
} from "@/src/features/dashboard/utils/drafts";
import type { DashboardData } from "@/src/lib/contracts";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type RefreshProps = {
  setData: Dispatch<SetStateAction<DashboardData>>;
  setTaskDrafts: Dispatch<SetStateAction<ReturnType<typeof buildTaskDrafts>>>;
  setPlanDrafts: Dispatch<SetStateAction<ReturnType<typeof buildPlanDrafts>>>;
  setRoutineDrafts: Dispatch<SetStateAction<ReturnType<typeof buildRoutineDrafts>>>;
  syncWithData: (nextData: DashboardData) => void;
};

export function useDashboardRefresh(props: RefreshProps) {
  return async function refreshDashboard(successMessage?: string) {
    const nextData = await apiRequest<DashboardData>("/api/dashboard");
    props.setData(nextData);
    props.setTaskDrafts(buildTaskDrafts(nextData.tasks));
    props.setPlanDrafts(buildPlanDrafts(nextData.tasks, nextData.routines));
    props.setRoutineDrafts(buildRoutineDrafts(nextData.routines));
    props.syncWithData(nextData);
    if (successMessage) toast.success(successMessage);
  };
}
