import { createEmptyTaskDraft } from "@/src/features/dashboard/constants";
import type { NewTaskDraft, TaskDraft } from "@/src/features/dashboard/types";
import { apiRequest } from "@/src/features/dashboard/utils/api-request";
import type { Dispatch, SetStateAction } from "react";

type TaskActionsProps = {
  newTask: NewTaskDraft;
  setNewTask: Dispatch<SetStateAction<NewTaskDraft>>;
  taskDrafts: Record<string, TaskDraft>;
  refreshDashboard: (successMessage?: string) => Promise<void>;
  runMutation: (work: () => Promise<void>) => Promise<boolean>;
  stopTimerForTask: (taskId: string) => void;
};

export function useDashboardTaskActions(props: TaskActionsProps) {
  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    return props.runMutation(async () => {
      await apiRequest("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          ...props.newTask,
          priority: props.newTask.priority || null,
        }),
      });
      props.setNewTask(createEmptyTaskDraft());
      await props.refreshDashboard("Task created.");
    });
  }
  async function handleTaskSave(taskId: string) {
    return props.runMutation(async () => {
      const draft = props.taskDrafts[taskId];
      await apiRequest(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ ...draft, priority: draft.priority || null }),
      });
      await props.refreshDashboard("Task updated.");
    });
  }
  async function handleTaskDelete(taskId: string) {
    return props.runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}`, { method: "DELETE" });
      props.stopTimerForTask(taskId);
      await props.refreshDashboard("Task deleted.");
    });
  }
  return { handleCreateTask, handleTaskSave, handleTaskDelete };
}
