import type {
  PlanDraft,
  RoutineDraft,
  TaskDraft,
} from "@/src/features/dashboard/types";
import type { Dispatch, SetStateAction } from "react";

type DraftActionsProps = {
  setTaskDrafts: Dispatch<SetStateAction<Record<string, TaskDraft>>>;
  setPlanDrafts: Dispatch<SetStateAction<Record<string, PlanDraft>>>;
  setNoteDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  setRoutineDrafts: Dispatch<SetStateAction<Record<string, RoutineDraft>>>;
};

export function useDashboardDraftActions(props: DraftActionsProps) {
  function setTaskDraft(taskId: string, key: keyof TaskDraft, value: string) {
    props.setTaskDrafts((current) => ({
      ...current,
      [taskId]: { ...current[taskId], [key]: value },
    }));
  }

  function replaceTaskDraft(taskId: string, nextDraft: TaskDraft) {
    props.setTaskDrafts((current) => ({
      ...current,
      [taskId]: nextDraft,
    }));
  }

  function setPlanDraft(taskId: string, key: keyof PlanDraft, value: string) {
    props.setPlanDrafts((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        [key]: key === "routineId" ? value : Number(value),
      },
    }));
  }

  function setNoteDraft(taskId: string, value: string) {
    props.setNoteDrafts((current) => ({ ...current, [taskId]: value }));
  }

  function setRoutineDraft(routineId: string, key: keyof RoutineDraft, value: string) {
    props.setRoutineDrafts((current) => ({
      ...current,
      [routineId]: {
        ...current[routineId],
        [key]: key === "name" ? value : Number(value),
      },
    }));
  }

  function replaceRoutineDraft(routineId: string, nextDraft: RoutineDraft) {
    props.setRoutineDrafts((current) => ({
      ...current,
      [routineId]: nextDraft,
    }));
  }

  return {
    setTaskDraft,
    replaceTaskDraft,
    setPlanDraft,
    setNoteDraft,
    setRoutineDraft,
    replaceRoutineDraft,
  };
}
