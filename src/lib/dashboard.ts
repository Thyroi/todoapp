import { prisma } from "@/src/lib/prisma";
import { AppError } from "@/src/lib/errors/app-error";
import { serializeDashboardData, serializeTask } from "@/src/lib/serializers";

const taskInclude = {
  notes: {
    orderBy: {
      createdAt: "desc" as const,
    },
  },
  pomodoroPlan: {
    include: {
      routine: true,
    },
  },
} as const;

export async function loadDashboardData(userId: string) {
  const [user, tasks, globalRoutines, userRoutines] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    }),
    prisma.task.findMany({
      where: { userId },
      include: taskInclude,
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.pomodoroRoutine.findMany({
      where: { userId: null },
      orderBy: [{ name: "asc" }],
    }),
    prisma.pomodoroRoutine.findMany({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    }),
  ]);

  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "The authenticated user no longer exists.",
      404,
    );
  }

  return serializeDashboardData({
    user,
    tasks,
    routines: [...globalRoutines, ...userRoutines],
  });
}

export async function getTaskForUser(taskId: string, userId: string) {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
    include: taskInclude,
  });

  if (!task) {
    throw new AppError("TASK_NOT_FOUND", "The requested task was not found.", 404);
  }

  return task;
}

export async function getRoutineForUser(routineId: string, userId: string) {
  const routine = await prisma.pomodoroRoutine.findFirst({
    where: {
      id: routineId,
      OR: [{ userId: null }, { userId }],
    },
  });

  if (!routine) {
    throw new AppError(
      "ROUTINE_NOT_FOUND",
      "The selected routine does not exist.",
      404,
    );
  }

  return routine;
}

export async function getOwnedRoutine(routineId: string, userId: string) {
  const routine = await prisma.pomodoroRoutine.findFirst({
    where: {
      id: routineId,
      userId,
    },
  });

  if (!routine) {
    throw new AppError(
      "ROUTINE_NOT_FOUND",
      "The routine was not found or does not belong to the current user.",
      404,
    );
  }

  return routine;
}

export async function getSerializedTaskForUser(taskId: string, userId: string) {
  return serializeTask(await getTaskForUser(taskId, userId));
}
