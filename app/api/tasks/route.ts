import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { createTaskSchema } from "@/src/modules/tasks/task.schemas";
import { loadDashboardData } from "@/src/lib/dashboard";

export const GET = createRouteHandler(async () => {
  const user = await requireCurrentUser();
  const data = await loadDashboardData(user.id);

  return ok({ tasks: data.tasks });
});

export const POST = createRouteHandler(async (request: Request) => {
  const user = await requireCurrentUser();
  const payload = createTaskSchema.parse(await readJsonBody(request));

  const task = await prisma.task.create({
    data: {
      userId: user.id,
      title: payload.title,
      description: payload.description,
      priority: payload.priority ?? null,
    },
  });

  return ok({ task }, { status: 201 });
});
