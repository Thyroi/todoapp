import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { serializeRoutine } from "@/src/lib/serializers";
import { getOwnedRoutine } from "@/src/lib/dashboard";
import { updateRoutineSchema } from "@/src/modules/pomodoro/pomodoro.schemas";

type RoutineRouteContext = {
  params: Promise<{
    routineId: string;
  }>;
};

export const PATCH = createRouteHandler(
  async (request: Request, context: RoutineRouteContext) => {
    const user = await requireCurrentUser();
    const { routineId } = await context.params;
    const payload = updateRoutineSchema.parse(await readJsonBody(request));

    await getOwnedRoutine(routineId, user.id);

    const routine = await prisma.pomodoroRoutine.update({
      where: { id: routineId },
      data: payload,
    });

    return ok({ routine: serializeRoutine(routine) });
  },
);

export const DELETE = createRouteHandler(
  async (_request: Request, context: RoutineRouteContext) => {
    const user = await requireCurrentUser();
    const { routineId } = await context.params;

    await getOwnedRoutine(routineId, user.id);
    await prisma.pomodoroRoutine.delete({ where: { id: routineId } });

    return ok({ deletedRoutineId: routineId });
  },
);
