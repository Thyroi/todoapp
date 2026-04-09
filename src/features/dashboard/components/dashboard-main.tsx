import { RoutinesSection } from "@/src/features/dashboard/components/routines-section";
import { TasksSection } from "@/src/features/dashboard/components/tasks-section";

export function DashboardMain() {
  return (
    <div className="space-y-6">
      <TasksSection />
      <RoutinesSection />
    </div>
  );
}
