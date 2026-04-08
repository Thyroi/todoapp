import { DashboardShell } from "@/src/components/dashboard/dashboard-shell";
import { loadDashboardData } from "@/src/lib/dashboard";
import { requirePageUser } from "@/src/lib/auth";

export default async function DashboardPage() {
  const user = await requirePageUser();
  const initialData = await loadDashboardData(user.id);

  return <DashboardShell initialData={initialData} />;
}
