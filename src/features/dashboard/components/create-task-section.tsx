import { TaskFormFields } from "@/src/features/dashboard/components/task-form-fields";
import { useDashboard } from "@/src/features/dashboard/context";

type CreateTaskSectionProps = {
  surface?: "card" | "plain";
  onSuccess?: () => void;
};

export function CreateTaskSection({
  surface = "card",
  onSuccess,
}: CreateTaskSectionProps) {
  const { state, actions } = useDashboard();
  const containerClassName =
    surface === "card"
      ? "rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm"
      : "rounded-3xl bg-white";

  return (
    <section className={containerClassName}>
      <h2 className="text-xl font-semibold">Create Task</h2>
      <p className="mt-1 text-sm text-slate-600">
        Start with the core unit of work, then attach notes or a pomodoro plan.
      </p>
      <form
        className="mt-5 space-y-3"
        onSubmit={async (event) => {
          const success = await actions.handleCreateTask(event);
          if (success) {
            onSuccess?.();
          }
        }}
      >
        <TaskFormFields />
        <button
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={state.isPending}
          type="submit"
        >
          Create Task
        </button>
      </form>
    </section>
  );
}
