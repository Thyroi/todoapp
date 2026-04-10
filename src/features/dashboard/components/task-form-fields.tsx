import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { taskFieldConfigs } from "@/src/features/dashboard/constants";
import { TaskPrioritySelect } from "@/src/features/dashboard/components/task-priority-select";
import { useDashboard } from "@/src/features/dashboard/context";

export function TaskFormFields() {
  const { state, actions } = useDashboard();
  const titleField = taskFieldConfigs.find((field) => field.key === "title");
  const descriptionField = taskFieldConfigs.find(
    (field) => field.key === "description",
  );
  const priorityField = taskFieldConfigs.find((field) => field.key === "priority");

  return (
    <>
      <label className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>{titleField?.label ?? "Title"}</span>
          {titleField ? <FieldHelpIcon content={titleField.helpText} /> : null}
        </div>
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
          placeholder="Name the task"
          required
          value={state.newTask.title}
          onChange={(event) =>
            actions.setNewTask((current) => ({ ...current, title: event.target.value }))
          }
        />
      </label>
      <label className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>{descriptionField?.label ?? "Description"}</span>
          {descriptionField ? (
            <FieldHelpIcon content={descriptionField.helpText} />
          ) : null}
        </div>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
          placeholder="Add context, constraints or the expected result"
          value={state.newTask.description}
          onChange={(event) =>
            actions.setNewTask((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
        />
      </label>
      <label className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>{priorityField?.label ?? "Priority"}</span>
          {priorityField ? <FieldHelpIcon content={priorityField.helpText} /> : null}
        </div>
        <TaskPrioritySelect
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
          value={state.newTask.priority}
          onChange={(value) =>
            actions.setNewTask((current) => ({
              ...current,
              priority: value as typeof current.priority,
            }))
          }
        />
      </label>
    </>
  );
}
