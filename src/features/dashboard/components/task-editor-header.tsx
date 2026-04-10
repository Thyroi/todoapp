import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { taskFieldConfigs } from "@/src/features/dashboard/constants";
import { MaskIcon } from "@/src/components/ui/mask-icon";
import { Tooltip } from "@/src/components/ui/tooltip";
import { TaskPrioritySelect } from "@/src/features/dashboard/components/task-priority-select";
import { TaskPlanCard } from "@/src/features/dashboard/components/task-plan-card";
import { TaskStatusSelect } from "@/src/features/dashboard/components/task-status-select";
import type { TaskStatusOption } from "@/src/lib/contracts";
import type { TaskDto } from "@/src/lib/contracts";

type TaskEditorHeaderProps = {
  task: TaskDto;
  title: string;
  description: string;
  status: TaskStatusOption;
  priority: string;
  statusClassName: string;
  priorityClassName: string;
  isEditing: boolean;
  isDeletingTask: boolean;
  shouldShowExpandedContent: boolean;
  onStatusChange: (value: TaskStatusOption) => void;
  onPriorityChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onCollapse?: () => void;
};

export function TaskEditorHeader({
  task,
  title,
  description,
  status,
  priority,
  statusClassName,
  priorityClassName,
  isEditing,
  isDeletingTask,
  shouldShowExpandedContent,
  onStatusChange,
  onPriorityChange,
  onTitleChange,
  onEdit,
  onDelete,
  onCollapse,
}: TaskEditorHeaderProps) {
  return (
    <div className="grid gap-3 2xl:grid-cols-[minmax(0,2fr)_minmax(170px,0.7fr)_minmax(170px,0.7fr)_auto] 2xl:items-center">
      <TaskEditorTitle
        description={description}
        isEditing={isEditing}
        shouldShowExpandedContent={shouldShowExpandedContent}
        title={title}
        onTitleChange={onTitleChange}
      />
      <TaskEditorStatus
        className={statusClassName}
        isEditing={isEditing}
        status={status}
        onChange={onStatusChange}
      />
      <TaskEditorPriority
        className={priorityClassName}
        isEditing={isEditing}
        priority={priority}
        onChange={onPriorityChange}
      />
      <TaskEditorActions
        isDeletingTask={isDeletingTask}
        isEditing={isEditing}
        shouldShowExpandedContent={shouldShowExpandedContent}
        task={task}
        onCollapse={onCollapse}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </div>
  );
}

function TaskEditorTitle({
  title,
  description,
  isEditing,
  shouldShowExpandedContent,
  onTitleChange,
}: {
  title: string;
  description: string;
  isEditing: boolean;
  shouldShowExpandedContent: boolean;
  onTitleChange: (value: string) => void;
}) {
  const titleField = taskFieldConfigs.find((field) => field.key === "title");

  if (isEditing) {
    return (
      <label className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>{titleField?.label ?? "Title"}</span>
          {titleField ? <FieldHelpIcon content={titleField.helpText} /> : null}
        </div>
        <input
          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xl font-semibold outline-none focus:border-orange-500"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
      </label>
    );
  }

  return (
    <div className="min-w-0">
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
      {!shouldShowExpandedContent ? (
        <p className="mt-1 truncate text-sm text-slate-500">
          {description || "Select this task to view description and notes."}
        </p>
      ) : null}
    </div>
  );
}

function TaskEditorStatus({
  className,
  isEditing,
  status,
  onChange,
}: {
  className: string;
  isEditing: boolean;
  status: TaskStatusOption;
  onChange: (value: TaskStatusOption) => void;
}) {
  const statusField = taskFieldConfigs.find((field) => field.key === "status");

  return (
    <div className="flex items-center" onClick={(event) => event.stopPropagation()}>
      <label className="w-full space-y-2">
        {isEditing ? (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{statusField?.label ?? "Status"}</span>
            {statusField ? <FieldHelpIcon content={statusField.helpText} /> : null}
          </div>
        ) : null}
        <TaskStatusSelect className={className} value={status} onChange={onChange} />
      </label>
    </div>
  );
}

function TaskEditorPriority({
  className,
  isEditing,
  priority,
  onChange,
}: {
  className: string;
  isEditing: boolean;
  priority: string;
  onChange: (value: string) => void;
}) {
  const priorityField = taskFieldConfigs.find((field) => field.key === "priority");

  return (
    <div className="flex items-center" onClick={(event) => event.stopPropagation()}>
      <label className="w-full space-y-2">
        {isEditing ? (
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{priorityField?.label ?? "Priority"}</span>
            {priorityField ? <FieldHelpIcon content={priorityField.helpText} /> : null}
          </div>
        ) : null}
        <TaskPrioritySelect
          className={className}
          value={priority}
          onChange={onChange}
        />
      </label>
    </div>
  );
}

function TaskEditorActions({
  task,
  isEditing,
  isDeletingTask,
  shouldShowExpandedContent,
  onEdit,
  onDelete,
  onCollapse,
}: {
  task: TaskDto;
  isEditing: boolean;
  isDeletingTask: boolean;
  shouldShowExpandedContent: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCollapse?: () => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-end gap-2 self-center"
      onClick={(event) => event.stopPropagation()}
    >
      <TaskPlanCard task={task} />
      <TaskEditButton
        isDeletingTask={isDeletingTask}
        isEditing={isEditing}
        onEdit={onEdit}
      />
      <TaskDeleteButton isDeletingTask={isDeletingTask} onDelete={onDelete} />
      {shouldShowExpandedContent && !isEditing && onCollapse ? (
        <TaskCollapseButton onCollapse={onCollapse} />
      ) : null}
    </div>
  );
}

function TaskEditButton({
  isEditing,
  isDeletingTask,
  onEdit,
}: {
  isEditing: boolean;
  isDeletingTask: boolean;
  onEdit: () => void;
}) {
  return (
    <Tooltip content="Edit task">
      <button
        aria-label="Edit task"
        className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
          isEditing
            ? "bg-blue-600 text-white"
            : "bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white"
        }`}
        disabled={isDeletingTask}
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        type="button"
      >
        <MaskIcon src="/icons/edit.svg" />
      </button>
    </Tooltip>
  );
}

function TaskDeleteButton({
  isDeletingTask,
  onDelete,
}: {
  isDeletingTask: boolean;
  onDelete: () => void;
}) {
  return (
    <Tooltip content="Delete task">
      <button
        aria-label="Delete task"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:bg-red-600 disabled:text-white"
        disabled={isDeletingTask}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        type="button"
      >
        {isDeletingTask ? (
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        ) : (
          <MaskIcon src="/icons/delete.svg" />
        )}
      </button>
    </Tooltip>
  );
}

function TaskCollapseButton({ onCollapse }: { onCollapse: () => void }) {
  return (
    <Tooltip content="Collapse">
      <button
        aria-label="Collapse"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100"
        onClick={(event) => {
          event.stopPropagation();
          onCollapse();
        }}
        type="button"
      >
        <MaskIcon src="/icons/chevron-up.svg" />
      </button>
    </Tooltip>
  );
}
