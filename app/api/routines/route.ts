import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { serializeRoutine } from "@/src/lib/serializers";
import { createRoutineSchema } from "@/src/modules/pomodoro/pomodoro.schemas";

export const GET = createRouteHandler(async () => {
  const user = await requireCurrentUser();

  const [globalRoutines, userRoutines] = await Promise.all([
    prisma.pomodoroRoutine.findMany({
      where: { userId: null },
      orderBy: [{ name: "asc" }],
    }),
    prisma.pomodoroRoutine.findMany({
      where: { userId: user.id },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
    }),
  ]);

  return ok({ routines: [...globalRoutines, ...userRoutines].map(serializeRoutine) });
});

export const POST = createRouteHandler(async (request: Request) => {
  const user = await requireCurrentUser();
  const payload = createRoutineSchema.parse(await readJsonBody(request));

  const routine = await prisma.pomodoroRoutine.create({
    data: {
      userId: user.id,
      ...payload,
    },
  });

  return ok({ routine: serializeRoutine(routine) }, { status: 201 });
});
