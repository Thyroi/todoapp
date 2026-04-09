import { PlanActionButtons } from "@/src/features/dashboard/components/plan-action-buttons";
import { PlanCycleFields } from "@/src/features/dashboard/components/plan-cycle-fields";

export function PlanFields({ taskId }: { taskId: string }) {
  return (
    <div className="mt-4 space-y-3">
      <PlanCycleFields taskId={taskId} />
      <PlanActionButtons taskId={taskId} />
    </div>
  );
}
