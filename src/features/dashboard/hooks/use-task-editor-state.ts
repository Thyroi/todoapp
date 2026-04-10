import { useDashboard } from "@/src/features/dashboard/context";
import {
  getTaskPriorityMeta,
  getTaskStatusMeta,
} from "@/src/features/dashboard/utils/task-meta";
import type { TaskDto } from "@/src/lib/contracts";
import { useState } from "react";

export function useTaskEditorState(
  task: TaskDto,
  isExpanded: boolean,
  onSelect: () => void,
) {
  const { state, actions } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const draft = state.taskDrafts[task.id];
  const description = draft?.description ?? task.description ?? "";
  const status = draft?.status ?? task.status;
  const priority = draft?.priority ?? task.priority ?? "";

  async function handleSave() {
    const success = await actions.handleTaskSave(task.id);
    if (success) {
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    setIsDeletingTask(true);
    const success = await actions.handleTaskDelete(task.id);

    if (!success) {
      setIsDeletingTask(false);
      return;
    }

    setIsDeleteModalOpen(false);
  }

  const title = draft?.title ?? task.title;
  const statusMeta = getTaskStatusMeta(status);
  const priorityMeta = getTaskPriorityMeta(priority);
  const shouldShowExpandedContent = isExpanded || isEditing;

  const handleCancelEdit = () => {
    actions.replaceTaskDraft(task.id, {
      title: task.title,
      description: task.description ?? "",
      status: task.status,
      priority: task.priority ?? "",
    });
    setIsEditing(false);
  };

  return {
    contentProps: {
      description,
      isDeleteModalOpen,
      isDeletingTask,
      isEditing,
      onCancel: handleCancelEdit,
      onCollapse: undefined as (() => void) | undefined,
      onDeleteClose: () => setIsDeleteModalOpen(false),
      onDeleteConfirm: () => void handleDelete(),
      onDeleteOpen: () => setIsDeleteModalOpen(true),
      onDescriptionChange: (value: string) =>
        actions.setTaskDraft(task.id, "description", value),
      onEdit: () => {
        onSelect();
        setIsEditing(true);
      },
      onPriorityChange: (value: string) =>
        actions.setTaskDraft(task.id, "priority", value),
      onSave: () => void handleSave(),
      onStatusChange: (value: TaskDto["status"]) =>
        actions.setTaskDraft(task.id, "status", value),
      onTitleChange: (value: string) => actions.setTaskDraft(task.id, "title", value),
      priority,
      priorityClassName: `w-full rounded-2xl border px-3 py-2 text-sm font-semibold tracking-[0.08em] outline-none transition focus:border-orange-500 ${priorityMeta.selectClassName}`,
      shouldShowExpandedContent,
      status,
      statusClassName: `w-full rounded-2xl border px-3 py-2 text-sm font-semibold tracking-[0.08em] outline-none transition focus:border-orange-500 ${statusMeta.selectClassName}`,
      task,
      title,
    },
    withCollapse: (onCollapse?: () => void) => ({ onCollapse }),
  };
}
