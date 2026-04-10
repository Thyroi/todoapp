import { RoutineCard } from "@/src/features/dashboard/components/routine-card";
import type { RoutineDto } from "@/src/lib/contracts";

type RoutinesWorkspaceListProps = {
  routines: RoutineDto[];
};

export function RoutinesWorkspaceList({ routines }: RoutinesWorkspaceListProps) {
  if (routines.length === 0) {
    return (
      <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-600">
        No routines match the current filter.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} />
      ))}
    </div>
  );
}
