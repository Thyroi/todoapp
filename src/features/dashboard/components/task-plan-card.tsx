import { Modal } from "@/src/components/ui/modal";
import { Tooltip } from "@/src/components/ui/tooltip";
import { PlanFields } from "@/src/features/dashboard/components/plan-fields";
import { useDashboard } from "@/src/features/dashboard/context";
import type { TaskDto } from "@/src/lib/contracts";
import { useState } from "react";

export function TaskPlanCard({ task }: { task: TaskDto }) {
  const { actions } = useDashboard();
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const hasPlan = Boolean(task.pomodoroPlan);

  return (
    <>
      <Tooltip content={hasPlan ? "Start pomodoro timer" : "Assign pomodoro plan"}>
        <button
          aria-label={hasPlan ? "Start pomodoro timer" : "Assign pomodoro plan"}
          className="inline-flex h-11 items-center justify-center px-4 text-sm font-semibold transition 
              rounded-full text-orange-700 hover:bg-orange-300"
          onClick={(event) => {
            event.stopPropagation();

            if (hasPlan) {
              actions.handleTimerStart(task);
              return;
            }

            setIsPlanModalOpen(true);
          }}
          type="button"
        >
          {hasPlan ? "⏳" : "🍅"}
        </button>
      </Tooltip>
      <Modal
        className="max-w-xl"
        description="Attach a routine and define the cycle counts for this task."
        onClose={() => setIsPlanModalOpen(false)}
        open={isPlanModalOpen}
        title={`Pomodoro Plan · ${task.title}`}
      >
        <PlanFields
          className="space-y-3"
          onAfterDelete={() => setIsPlanModalOpen(false)}
          onAfterSave={() => setIsPlanModalOpen(false)}
          taskId={task.id}
        />
      </Modal>
    </>
  );
}
