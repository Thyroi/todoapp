import type {
  PlanDraft,
  RoutineDraft,
  TaskDraft,
} from "@/src/features/dashboard/types";
import type { RoutineDto, TaskDto } from "@/src/lib/contracts";

export function buildTaskDrafts(tasks: TaskDto[]) {
  return Object.fromEntries(
    tasks.map((task) => [
      task.id,
      {
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority ?? "",
      },
    ]),
  ) as Record<string, TaskDraft>;
}
export function buildPlanDrafts(tasks: TaskDto[], routines: RoutineDto[]) {
  const defaultRoutineId = routines[0]?.id ?? "";
  return Object.fromEntries(
    tasks.map((task) => [
      task.id,
      {
        routineId: task.pomodoroPlan?.routineId ?? defaultRoutineId,
        totalCycles: task.pomodoroPlan?.totalCycles ?? 4,
        completedCycles: task.pomodoroPlan?.completedCycles ?? 0,
      },
    ]),
  ) as Record<string, PlanDraft>;
}
export function buildRoutineDrafts(routines: RoutineDto[]) {
  return Object.fromEntries(
    routines
      .filter((routine) => !routine.isGlobal)
      .map((routine) => [
        routine.id,
        {
          name: routine.name,
          workMinutes: routine.workMinutes,
          shortRestMinutes: routine.shortRestMinutes,
          longRestMinutes: routine.longRestMinutes,
          cyclesBeforeLongRest: routine.cyclesBeforeLongRest,
        },
      ]),
  ) as Record<string, RoutineDraft>;
}
