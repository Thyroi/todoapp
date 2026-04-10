import { useDashboard } from "@/src/features/dashboard/context";

type PlanActionButtonsProps = {
  taskId: string;
  onAfterDelete?: () => void;
  onAfterSave?: () => void;
};

export function PlanActionButtons({
  taskId,
  onAfterDelete,
  onAfterSave,
}: PlanActionButtonsProps) {
  const { actions, state } = useDashboard();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        disabled={state.isPending}
        onClick={async () => {
          const success = await actions.handlePlanSave(taskId);
          if (success) {
            onAfterSave?.();
          }
        }}
        type="button"
      >
        Save Plan
      </button>
      <button
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        disabled={state.isPending}
        onClick={async () => {
          const success = await actions.handlePlanDelete(taskId);
          if (success) {
            onAfterDelete?.();
          }
        }}
        type="button"
      >
        Remove Plan
      </button>
    </div>
  );
}
