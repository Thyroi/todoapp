import { CreateRoutineSection } from "@/src/features/dashboard/components/create-routine-section";
import { CreateTaskSection } from "@/src/features/dashboard/components/create-task-section";
import { TimerSection } from "@/src/features/dashboard/components/timer-section";

export function DashboardSidebar() {
  return (
    <div className="space-y-6">
      <CreateTaskSection />
      <TimerSection />
      <CreateRoutineSection />
    </div>
  );
}
