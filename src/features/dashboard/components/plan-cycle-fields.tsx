import { useDashboard } from "@/src/features/dashboard/context";

export function PlanCycleFields({ taskId }: { taskId: string }) {
  const { state, actions } = useDashboard();
  const draft = state.planDrafts[taskId];

  return (
    <>
      <select
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
        value={draft?.routineId ?? ""}
        onChange={(event) =>
          actions.setPlanDraft(taskId, "routineId", event.target.value)
        }
      >
        {state.data.routines.map((routine) => (
          <option key={routine.id} value={routine.id}>
            {routine.name}
            {routine.isGlobal ? " • global" : " • mine"}
          </option>
        ))}
      </select>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
          min={1}
          type="number"
          value={draft?.totalCycles ?? 4}
          onChange={(event) =>
            actions.setPlanDraft(taskId, "totalCycles", event.target.value)
          }
        />
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
          min={0}
          type="number"
          value={draft?.completedCycles ?? 0}
          onChange={(event) =>
            actions.setPlanDraft(taskId, "completedCycles", event.target.value)
          }
        />
      </div>
    </>
  );
}
