import type { TaskDto } from "@/src/lib/contracts";

export function PlanSummary({ task }: { task: TaskDto }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Pomodoro Plan
      </p>
      <p className="mt-1 text-sm text-slate-600">
        {task.pomodoroPlan
          ? `${task.pomodoroPlan.completedCycles}/${task.pomodoroPlan.totalCycles} cycles completed`
          : "No plan attached yet"}
      </p>
    </div>
  );
}
