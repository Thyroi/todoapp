import { prisma } from "@/src/lib/prisma";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler, readJsonBody } from "@/src/lib/http";
import { AppError } from "@/src/lib/errors/app-error";
import { createSessionCookie, signSessionToken, verifyPassword } from "@/src/lib/auth";
import { serializeUser } from "@/src/lib/serializers";
import { loginSchema } from "@/src/modules/auth/auth.schemas";

export const POST = createRouteHandler(async (request: Request) => {
  const payload = loginSchema.parse(await readJsonBody(request));

  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      email: true,
      passwordHash: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
  }

  const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
  }

  await createSessionCookie(signSessionToken(user));

  return ok({
    user: serializeUser(user),
  });
});
