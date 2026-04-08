import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { AppError } from "@/src/lib/errors/app-error";
import { getSerializedTaskForUser, getTaskForUser } from "@/src/lib/dashboard";

type NoteRouteContext = {
  params: Promise<{
    taskId: string;
    noteId: string;
  }>;
};

export const DELETE = createRouteHandler(
  async (_request: Request, context: NoteRouteContext) => {
    const user = await requireCurrentUser();
    const { taskId, noteId } = await context.params;

    await getTaskForUser(taskId, user.id);

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        taskId,
      },
      select: { id: true },
    });

    if (!note) {
      throw new AppError("NOTE_NOT_FOUND", "The note was not found.", 404);
    }

    await prisma.note.delete({ where: { id: noteId } });
    return ok({ task: await getSerializedTaskForUser(taskId, user.id) });
  },
);
