import { ok } from "@/src/lib/api/response";
import { createRouteHandler } from "@/src/lib/http";
import { requireCurrentUser } from "@/src/lib/auth";
import { serializeUser } from "@/src/lib/serializers";

export const GET = createRouteHandler(async () => {
  const user = await requireCurrentUser();
  return ok({ user: serializeUser(user) });
});
