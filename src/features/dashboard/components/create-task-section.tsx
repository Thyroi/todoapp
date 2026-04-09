import { TaskFormFields } from "@/src/features/dashboard/components/task-form-fields";
import { useDashboard } from "@/src/features/dashboard/context";

export function CreateTaskSection() {
  const { state, actions } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Create Task</h2>
      <p className="mt-1 text-sm text-slate-600">
        Start with the core unit of work, then attach notes or a pomodoro plan.
      </p>
      <form className="mt-5 space-y-3" onSubmit={actions.handleCreateTask}>
        <TaskFormFields />
        <button
          className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300"
          disabled={state.isPending}
          type="submit"
        >
          Create Task
        </button>
      </form>
    </section>
  );
}
