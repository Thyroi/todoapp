import { RoutineSummaryCard } from "@/src/features/dashboard/components/routine-summary-card";
import { TaskEditor } from "@/src/features/dashboard/components/task-editor";
import { TaskNotesCard } from "@/src/features/dashboard/components/task-notes-card";
import { TaskPlanCard } from "@/src/features/dashboard/components/task-plan-card";
import type { TaskDto } from "@/src/lib/contracts";

export function TaskCard({ task }: { task: TaskDto }) {
  return (
    <article className="rounded-4xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
        <TaskEditor task={task} />
        <TaskPlanCard task={task} />
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <TaskNotesCard task={task} />
        <RoutineSummaryCard task={task} />
      </div>
    </article>
  );
}
