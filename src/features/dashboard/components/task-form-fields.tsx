import { TaskPrioritySelect } from "@/src/features/dashboard/components/task-priority-select";
import { useDashboard } from "@/src/features/dashboard/context";

export function TaskFormFields() {
  const { state, actions } = useDashboard();

  return (
    <>
      <input
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
        placeholder="Task title"
        required
        value={state.newTask.title}
        onChange={(event) =>
          actions.setNewTask((current) => ({ ...current, title: event.target.value }))
        }
      />
      <textarea
        className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
        placeholder="Short context, constraints, or expected result"
        value={state.newTask.description}
        onChange={(event) =>
          actions.setNewTask((current) => ({
            ...current,
            description: event.target.value,
          }))
        }
      />
      <TaskPrioritySelect
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
        value={state.newTask.priority}
        onChange={(value) =>
          actions.setNewTask((current) => ({
            ...current,
            priority: value as typeof current.priority,
          }))
        }
      />
    </>
  );
}
