import { createEmptyRoutineDraft } from "@/src/features/dashboard/constants";
import type { RoutineDraft } from "@/src/features/dashboard/types";
import { apiRequest } from "@/src/features/dashboard/utils/api-request";
import type { Dispatch, SetStateAction } from "react";

type RoutineActionsProps = {
  newRoutine: RoutineDraft;
  setNewRoutine: Dispatch<SetStateAction<RoutineDraft>>;
  routineDrafts: Record<string, RoutineDraft>;
  refreshDashboard: (successMessage?: string) => Promise<void>;
  runMutation: (work: () => Promise<void>) => Promise<boolean>;
};

export function useDashboardRoutineActions(props: RoutineActionsProps) {
  async function handleCreateRoutine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return props.runMutation(async () => {
      await apiRequest("/api/routines", {
        method: "POST",
        body: JSON.stringify(props.newRoutine),
      });
      props.setNewRoutine(createEmptyRoutineDraft());
      await props.refreshDashboard("Routine created.");
    });
  }
  async function handleRoutineSave(routineId: string) {
    return props.runMutation(async () => {
      await apiRequest(`/api/routines/${routineId}`, {
        method: "PATCH",
        body: JSON.stringify(props.routineDrafts[routineId]),
      });
      await props.refreshDashboard("Routine updated.");
    });
  }
  async function handleRoutineDelete(routineId: string) {
    return props.runMutation(async () => {
      await apiRequest(`/api/routines/${routineId}`, { method: "DELETE" });
      await props.refreshDashboard("Routine deleted.");
    });
  }

  return {
    handleCreateRoutine,
    handleRoutineSave,
    handleRoutineDelete,
  };
}
