import { RoutinesCreateModal } from "@/src/features/dashboard/components/routines-create-modal";
import { RoutinesOwnershipFilter } from "@/src/features/dashboard/components/routines-ownership-filter";
import { RoutinesWorkspaceList } from "@/src/features/dashboard/components/routines-workspace-list";
import { RoutinesWorkspaceHeader } from "@/src/features/dashboard/components/routines-workspace-header";
import { useRoutinesWorkspaceState } from "@/src/features/dashboard/hooks/use-routines-workspace-state";

type RoutinesWorkspaceProps = {
  onBackToTasks: () => void;
};

export function RoutinesWorkspace({ onBackToTasks }: RoutinesWorkspaceProps) {
  const {
    filteredRoutines,
    globalCount,
    isCreateRoutineModalOpen,
    mineCount,
    ownershipFilter,
    routines,
    setIsCreateRoutineModalOpen,
    setOwnershipFilter,
  } = useRoutinesWorkspaceState();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <RoutinesWorkspaceHeader
        onBackToTasks={onBackToTasks}
        onCreateRoutine={() => setIsCreateRoutineModalOpen(true)}
      />
      <RoutinesOwnershipFilter
        globalCount={globalCount}
        mineCount={mineCount}
        onChange={setOwnershipFilter}
        ownershipFilter={ownershipFilter}
        totalCount={routines.length}
      />

      <RoutinesWorkspaceList routines={filteredRoutines} />
      <RoutinesCreateModal
        onClose={() => setIsCreateRoutineModalOpen(false)}
        open={isCreateRoutineModalOpen}
      />
    </section>
  );
}
