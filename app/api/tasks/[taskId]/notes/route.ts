import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { getSerializedTaskForUser, getTaskForUser } from "@/src/lib/dashboard";
import { createNoteSchema } from "@/src/modules/tasks/task.schemas";

type TaskRouteContext = {
  params: Promise<{
    taskId: string;
  }>;
};

export const POST = createRouteHandler(
  async (request: Request, context: TaskRouteContext) => {
    const user = await requireCurrentUser();
    const { taskId } = await context.params;
    const payload = createNoteSchema.parse(await readJsonBody(request));

    await getTaskForUser(taskId, user.id);

    await prisma.note.create({
      data: {
        taskId,
        content: payload.content,
      },
    });

    return ok(
      { task: await getSerializedTaskForUser(taskId, user.id) },
      { status: 201 },
    );
  },
);
