import { useDashboard } from "@/src/features/dashboard/context";
import { useState } from "react";

export type OwnershipFilter = "ALL" | "GLOBAL" | "MINE";

export function useRoutinesWorkspaceState() {
  const { state } = useDashboard();
  const [isCreateRoutineModalOpen, setIsCreateRoutineModalOpen] = useState(false);
  const [ownershipFilter, setOwnershipFilter] = useState<OwnershipFilter>("ALL");
  const routines = state.data.routines;

  return {
    filteredRoutines: routines.filter((routine) => {
      if (ownershipFilter === "GLOBAL") return routine.isGlobal;
      if (ownershipFilter === "MINE") return !routine.isGlobal;
      return true;
    }),
    globalCount: routines.filter((routine) => routine.isGlobal).length,
    isCreateRoutineModalOpen,
    mineCount: routines.filter((routine) => !routine.isGlobal).length,
    ownershipFilter,
    routines,
    setIsCreateRoutineModalOpen,
    setOwnershipFilter,
  };
}
