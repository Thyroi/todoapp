import { RoutinesWorkspace } from "@/src/features/dashboard/components/routines-workspace";
import { TasksSection } from "@/src/features/dashboard/components/tasks-section";

type DashboardMainProps = {
  activeWorkspace: "tasks" | "routines";
  onBackToTasks: () => void;
};

export function DashboardMain({ activeWorkspace, onBackToTasks }: DashboardMainProps) {
  return (
    <div key={activeWorkspace} className="animate-workspace-swap">
      {activeWorkspace === "tasks" ? (
        <TasksSection />
      ) : (
        <RoutinesWorkspace onBackToTasks={onBackToTasks} />
      )}
    </div>
  );
}
