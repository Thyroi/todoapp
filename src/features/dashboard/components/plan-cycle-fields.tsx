import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { planFieldConfigs } from "@/src/features/dashboard/constants";
import { useDashboard } from "@/src/features/dashboard/context";

export function PlanCycleFields({ taskId }: { taskId: string }) {
  const { state, actions } = useDashboard();
  const draft = state.planDrafts[taskId];
  const routineField = planFieldConfigs.find((field) => field.key === "routineId");
  const totalCyclesField = planFieldConfigs.find(
    (field) => field.key === "totalCycles",
  );
  const completedCyclesField = planFieldConfigs.find(
    (field) => field.key === "completedCycles",
  );

  return (
    <>
      <label className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>{routineField?.label ?? "Routine"}</span>
          {routineField ? <FieldHelpIcon content={routineField.helpText} /> : null}
        </div>
        <select
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
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
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{totalCyclesField?.label ?? "Total cycles"}</span>
            {totalCyclesField ? (
              <FieldHelpIcon content={totalCyclesField.helpText} />
            ) : null}
          </div>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
            min={1}
            type="number"
            value={draft?.totalCycles ?? 4}
            onChange={(event) =>
              actions.setPlanDraft(taskId, "totalCycles", event.target.value)
            }
          />
        </label>
        <label className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{completedCyclesField?.label ?? "Completed cycles"}</span>
            {completedCyclesField ? (
              <FieldHelpIcon content={completedCyclesField.helpText} />
            ) : null}
          </div>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
            min={0}
            type="number"
            value={draft?.completedCycles ?? 0}
            onChange={(event) =>
              actions.setPlanDraft(taskId, "completedCycles", event.target.value)
            }
          />
        </label>
      </div>
    </>
  );
}
