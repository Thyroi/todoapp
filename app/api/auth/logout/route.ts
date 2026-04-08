import { clearSessionCookie } from "@/src/lib/auth";
import { ok } from "@/src/lib/api/response";
import { createRouteHandler } from "@/src/lib/http";

export const POST = createRouteHandler(async () => {
  await clearSessionCookie();
  return ok({ success: true });
});
