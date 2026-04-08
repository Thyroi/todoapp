import type {
  Note,
  PomodoroPlan,
  PomodoroRoutine,
  Task,
  User,
} from "@/src/generated/prisma/client";
import type {
  DashboardData,
  NoteDto,
  PomodoroPlanDto,
  RoutineDto,
  SessionUser,
  TaskDto,
} from "@/src/lib/contracts";

type TaskWithRelations = Task & {
  notes: Note[];
  pomodoroPlan: (PomodoroPlan & { routine: PomodoroRoutine }) | null;
};

export function serializeUser(
  user: Pick<User, "id" | "email" | "createdAt">,
): SessionUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}

export function serializeRoutine(routine: PomodoroRoutine): RoutineDto {
  return {
    id: routine.id,
    userId: routine.userId,
    name: routine.name,
    workMinutes: routine.workMinutes,
    shortRestMinutes: routine.shortRestMinutes,
    longRestMinutes: routine.longRestMinutes,
    cyclesBeforeLongRest: routine.cyclesBeforeLongRest,
    createdAt: routine.createdAt.toISOString(),
    updatedAt: routine.updatedAt.toISOString(),
    isGlobal: routine.userId === null,
  };
}

export function serializeNote(note: Note): NoteDto {
  return {
    id: note.id,
    taskId: note.taskId,
    content: note.content,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function serializePlan(
  plan: PomodoroPlan & { routine: PomodoroRoutine },
): PomodoroPlanDto {
  return {
    id: plan.id,
    taskId: plan.taskId,
    routineId: plan.routineId,
    totalCycles: plan.totalCycles,
    completedCycles: plan.completedCycles,
    createdAt: plan.createdAt.toISOString(),
    updatedAt: plan.updatedAt.toISOString(),
    routine: serializeRoutine(plan.routine),
  };
}

export function serializeTask(task: TaskWithRelations): TaskDto {
  return {
    id: task.id,
    userId: task.userId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    notes: task.notes.map(serializeNote),
    pomodoroPlan: task.pomodoroPlan ? serializePlan(task.pomodoroPlan) : null,
  };
}

export function serializeDashboardData(input: {
  user: Pick<User, "id" | "email" | "createdAt">;
  tasks: TaskWithRelations[];
  routines: PomodoroRoutine[];
}): DashboardData {
  return {
    user: serializeUser(input.user),
    tasks: input.tasks.map(serializeTask),
    routines: input.routines.map(serializeRoutine),
  };
}
