import { useDashboard } from "@/src/features/dashboard/context";

export function PlanActionButtons({ taskId }: { taskId: string }) {
  const { actions } = useDashboard();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button
        className="rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        onClick={() => void actions.handlePlanSave(taskId)}
        type="button"
      >
        Save Plan
      </button>
      <button
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        onClick={() => void actions.handlePlanDelete(taskId)}
        type="button"
      >
        Remove Plan
      </button>
    </div>
  );
}
