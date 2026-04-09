import { TaskCard } from "@/src/features/dashboard/components/task-card";
import { TaskFilters } from "@/src/features/dashboard/components/task-filters";
import { useDashboard } from "@/src/features/dashboard/context";

export function TasksSection() {
  const { state } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p className="mt-1 text-sm text-slate-600">
            Edit details inline, attach plans, write notes, and start focus sessions
            from each card.
          </p>
        </div>
        <TaskFilters />
      </div>
      <div className="mt-6 space-y-4">
        {state.filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-600">
            No tasks match the current filter.
          </div>
        ) : (
          state.filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}
