import { TaskDeleteModal } from "@/src/features/dashboard/components/task-delete-modal";
import { TaskEditorBody } from "@/src/features/dashboard/components/task-editor-body";
import { TaskEditorHeader } from "@/src/features/dashboard/components/task-editor-header";
import type { TaskDto } from "@/src/lib/contracts";

type TaskEditorContentProps = {
  task: TaskDto;
  title: string;
  description: string;
  status: TaskDto["status"];
  priority: string;
  statusClassName: string;
  priorityClassName: string;
  isEditing: boolean;
  isDeletingTask: boolean;
  isDeleteModalOpen: boolean;
  shouldShowExpandedContent: boolean;
  onEdit: () => void;
  onDeleteOpen: () => void;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
  onTitleChange: (value: string) => void;
  onStatusChange: (value: TaskDto["status"]) => void;
  onPriorityChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onCollapse?: () => void;
};

export function TaskEditorContent({
  task,
  title,
  description,
  status,
  priority,
  statusClassName,
  priorityClassName,
  isEditing,
  isDeletingTask,
  isDeleteModalOpen,
  shouldShowExpandedContent,
  onEdit,
  onDeleteOpen,
  onDeleteClose,
  onDeleteConfirm,
  onTitleChange,
  onStatusChange,
  onPriorityChange,
  onDescriptionChange,
  onSave,
  onCancel,
  onCollapse,
}: TaskEditorContentProps) {
  return (
    <div className="space-y-4">
      <TaskEditorHeader
        description={description}
        isDeletingTask={isDeletingTask}
        isEditing={isEditing}
        onCollapse={onCollapse}
        onDelete={onDeleteOpen}
        onEdit={onEdit}
        onPriorityChange={onPriorityChange}
        onStatusChange={onStatusChange}
        onTitleChange={onTitleChange}
        priority={priority}
        priorityClassName={priorityClassName}
        shouldShowExpandedContent={shouldShowExpandedContent}
        status={status}
        statusClassName={statusClassName}
        task={task}
        title={title}
      />
      <TaskEditorBody
        description={description}
        isDeletingTask={isDeletingTask}
        isEditing={isEditing}
        onCancel={onCancel}
        onDescriptionChange={onDescriptionChange}
        onSave={onSave}
        shouldShowExpandedContent={shouldShowExpandedContent}
      />
      <TaskDeleteModal
        isDeletingTask={isDeletingTask}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
        open={isDeleteModalOpen}
      />
    </div>
  );
}
