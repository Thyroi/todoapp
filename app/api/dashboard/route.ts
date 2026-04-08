import { ok } from "@/src/lib/api/response";
import { createRouteHandler } from "@/src/lib/http";
import { loadDashboardData } from "@/src/lib/dashboard";
import { requireCurrentUser } from "@/src/lib/auth";

export const GET = createRouteHandler(async () => {
  const user = await requireCurrentUser();
  const data = await loadDashboardData(user.id);

  return ok(data);
});
