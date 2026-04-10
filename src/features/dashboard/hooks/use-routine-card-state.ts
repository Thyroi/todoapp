import { useDashboard } from "@/src/features/dashboard/context";
import type { RoutineDraft } from "@/src/features/dashboard/types";
import type { RoutineDto } from "@/src/lib/contracts";
import { useState } from "react";

export function useRoutineCardState(routine: RoutineDto) {
  const { state, actions } = useDashboard();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingRoutine, setIsDeletingRoutine] = useState(false);
  const draft = state.routineDrafts[routine.id];

  async function handleSave() {
    const success = await actions.handleRoutineSave(routine.id);
    if (success) {
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    setIsDeletingRoutine(true);
    const success = await actions.handleRoutineDelete(routine.id);

    if (!success) {
      setIsDeletingRoutine(false);
      return;
    }

    setIsDeleteModalOpen(false);
  }

  return {
    actions,
    draft,
    handleDelete,
    handleSave,
    isDeletingRoutine,
    isDeleteModalOpen,
    isEditing,
    name: draft?.name ?? routine.name,
    setIsDeleteModalOpen,
    setIsEditing,
    handleCancelEdit: () => {
      const nextDraft: RoutineDraft = {
        name: routine.name,
        workMinutes: routine.workMinutes,
        shortRestMinutes: routine.shortRestMinutes,
        longRestMinutes: routine.longRestMinutes,
        cyclesBeforeLongRest: routine.cyclesBeforeLongRest,
      };

      actions.replaceRoutineDraft(routine.id, nextDraft);
      setIsEditing(false);
    },
    handleFieldChange: (key: keyof RoutineDraft, value: number | string) =>
      actions.setRoutineDraft(routine.id, key, value),
    handleNameChange: (value: string) =>
      actions.setRoutineDraft(routine.id, "name", value),
  };
}
