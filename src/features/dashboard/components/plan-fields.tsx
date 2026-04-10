import { PlanActionButtons } from "@/src/features/dashboard/components/plan-action-buttons";
import { PlanCycleFields } from "@/src/features/dashboard/components/plan-cycle-fields";

type PlanFieldsProps = {
  taskId: string;
  className?: string;
  onAfterDelete?: () => void;
  onAfterSave?: () => void;
};

export function PlanFields({
  taskId,
  className = "mt-4 space-y-3",
  onAfterDelete,
  onAfterSave,
}: PlanFieldsProps) {
  return (
    <div className={className}>
      <PlanCycleFields taskId={taskId} />
      <PlanActionButtons
        onAfterDelete={onAfterDelete}
        onAfterSave={onAfterSave}
        taskId={taskId}
      />
    </div>
  );
}
