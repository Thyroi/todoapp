import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import {
  getRoutineForUser,
  getSerializedTaskForUser,
  getTaskForUser,
} from "@/src/lib/dashboard";
import { upsertPlanSchema } from "@/src/modules/pomodoro/pomodoro.schemas";

type TaskRouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export const PUT = createRouteHandler(
  async (request: Request, context: TaskRouteContext) => {
    const user = await requireCurrentUser();
    const { taskId } = await context.params;
    const payload = upsertPlanSchema.parse(await readJsonBody(request));

    await getTaskForUser(taskId, user.id);
    await getRoutineForUser(payload.routineId, user.id);

    await prisma.pomodoroPlan.upsert({
      where: { taskId },
      create: {
        taskId,
        routineId: payload.routineId,
        totalCycles: payload.totalCycles,
        completedCycles: payload.completedCycles ?? 0,
      },
      update: {
        routineId: payload.routineId,
        totalCycles: payload.totalCycles,
        completedCycles: payload.completedCycles ?? 0,
      },
    });

    return ok({ task: await getSerializedTaskForUser(taskId, user.id) });
  },
);

export const DELETE = createRouteHandler(
  async (_request: Request, context: TaskRouteContext) => {
    const user = await requireCurrentUser();
    const { taskId } = await context.params;

    const task = await getTaskForUser(taskId, user.id);

    if (!task.pomodoroPlan) {
      return ok({ task: await getSerializedTaskForUser(taskId, user.id) });
    }

    await prisma.pomodoroPlan.delete({ where: { taskId } });

    return ok({ task: await getSerializedTaskForUser(taskId, user.id) });
  },
);
