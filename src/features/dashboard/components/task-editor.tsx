import { TaskEditorButtons } from "@/src/features/dashboard/components/task-editor-buttons";
import { TaskPrioritySelect } from "@/src/features/dashboard/components/task-priority-select";
import { TaskStatusSelect } from "@/src/features/dashboard/components/task-status-select";
import { useDashboard } from "@/src/features/dashboard/context";
import type { TaskDto } from "@/src/lib/contracts";

export function TaskEditor({ task }: { task: TaskDto }) {
  const { state, actions } = useDashboard();
  const draft = state.taskDrafts[task.id];

  return (
    <div className="flex-1 space-y-3">
      <input
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold outline-none focus:border-orange-500"
        value={draft?.title ?? task.title}
        onChange={(event) => actions.setTaskDraft(task.id, "title", event.target.value)}
      />
      <textarea
        className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
        value={draft?.description ?? task.description ?? ""}
        onChange={(event) =>
          actions.setTaskDraft(task.id, "description", event.target.value)
        }
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <TaskStatusSelect
          value={draft?.status ?? task.status}
          onChange={(value) => actions.setTaskDraft(task.id, "status", value)}
        />
        <TaskPrioritySelect
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
          value={draft?.priority ?? task.priority ?? ""}
          onChange={(value) => actions.setTaskDraft(task.id, "priority", value)}
        />
        <TaskEditorButtons
          onSave={() => void actions.handleTaskSave(task.id)}
          onDelete={() => void actions.handleTaskDelete(task.id)}
        />
      </div>
    </div>
  );
}
