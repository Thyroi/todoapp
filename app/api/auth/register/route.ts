import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { AppError } from "@/src/lib/errors/app-error";
import { createSessionCookie, hashPassword, signSessionToken } from "@/src/lib/auth";
import { serializeUser } from "@/src/lib/serializers";
import { registerSchema } from "@/src/modules/auth/auth.schemas";

export const POST = createRouteHandler(async (request: Request) => {
  const payload = registerSchema.parse(await readJsonBody(request));

  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError(
      "EMAIL_IN_USE",
      "An account with that email already exists.",
      409,
    );
  }

  const passwordHash = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      email: payload.email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  await createSessionCookie(signSessionToken(user));

  return ok({ user: serializeUser(user) }, { status: 201 });
});
