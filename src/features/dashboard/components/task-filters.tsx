import { useDashboard } from "@/src/features/dashboard/context";
import { taskStatusOptions } from "@/src/lib/contracts";

export function TaskFilters() {
  const { state, actions } = useDashboard();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
        placeholder="Search task"
        value={state.search}
        onChange={(event) => actions.setSearch(event.target.value)}
      />
      <select
        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
        value={state.statusFilter}
        onChange={(event) =>
          actions.setStatusFilter(event.target.value as typeof state.statusFilter)
        }
      >
        <option value="ALL">All statuses</option>
        {taskStatusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}
