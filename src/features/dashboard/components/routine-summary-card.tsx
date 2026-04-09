import type { TaskDto } from "@/src/lib/contracts";

export function RoutineSummaryCard({ task }: { task: TaskDto }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
        Routine Summary
      </h3>
      {task.pomodoroPlan ? (
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p>
            <strong>{task.pomodoroPlan.routine.name}</strong>
          </p>
          <p>
            Work {task.pomodoroPlan.routine.workMinutes}m, short rest{" "}
            {task.pomodoroPlan.routine.shortRestMinutes}m, long rest{" "}
            {task.pomodoroPlan.routine.longRestMinutes}m.
          </p>
          <p>
            Long rest every {task.pomodoroPlan.routine.cyclesBeforeLongRest} cycles.
          </p>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          This task still works as a plain todo. Attach a plan when you want timeboxing.
        </p>
      )}
    </section>
  );
}
