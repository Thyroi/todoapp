import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { getSerializedTaskForUser, getTaskForUser } from "@/src/lib/dashboard";
import { updateTaskSchema } from "@/src/modules/tasks/task.schemas";

type TaskRouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export const PATCH = createRouteHandler(
  async (request: Request, context: TaskRouteContext) => {
    const user = await requireCurrentUser();
    const { taskId } = await context.params;
    const payload = updateTaskSchema.parse(await readJsonBody(request));

    await getTaskForUser(taskId, user.id);

    await prisma.task.update({
      where: { id: taskId },
      data: {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
      },
    });

    return ok({ task: await getSerializedTaskForUser(taskId, user.id) });
  },
);

export const DELETE = createRouteHandler(
  async (_request: Request, context: TaskRouteContext) => {
    const user = await requireCurrentUser();
    const { taskId } = await context.params;

    await getTaskForUser(taskId, user.id);
    await prisma.task.delete({ where: { id: taskId } });

    return ok({ deletedTaskId: taskId });
  },
);
