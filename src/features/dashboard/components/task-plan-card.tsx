import { PlanFields } from "@/src/features/dashboard/components/plan-fields";
import { PlanSummary } from "@/src/features/dashboard/components/plan-summary";
import { useDashboard } from "@/src/features/dashboard/context";
import type { TaskDto } from "@/src/lib/contracts";

export function TaskPlanCard({ task }: { task: TaskDto }) {
  const { actions } = useDashboard();

  return (
    <div className="w-full xl:max-w-sm">
      <div className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <PlanSummary task={task} />
          <button
            className="rounded-full bg-orange-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-orange-500"
            onClick={() => actions.handleTimerStart(task)}
            type="button"
          >
            Start
          </button>
        </div>
        <PlanFields taskId={task.id} />
      </div>
    </div>
  );
}
