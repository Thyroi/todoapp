import { RoutineCardActions } from "@/src/features/dashboard/components/routine-card-actions";
import { RoutineDeleteModal } from "@/src/features/dashboard/components/routine-delete-modal";
import { RoutineCardHeader } from "@/src/features/dashboard/components/routine-card-header";
import { RoutineCardMetrics } from "@/src/features/dashboard/components/routine-card-metrics";
import type { RoutineDraft } from "@/src/features/dashboard/types";
import type { RoutineDto } from "@/src/lib/contracts";

type RoutineCardContentProps = {
  routine: RoutineDto;
  name: string;
  draft?: RoutineDraft;
  isEditing: boolean;
  isDeletingRoutine: boolean;
  isDeleteModalOpen: boolean;
  onEdit: () => void;
  onDeleteOpen: () => void;
  onDeleteClose: () => void;
  onDeleteConfirm: () => void;
  onNameChange: (value: string) => void;
  onFieldChange: (key: keyof RoutineDraft, value: number | string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function RoutineCardContent({
  routine,
  name,
  draft,
  isEditing,
  isDeletingRoutine,
  isDeleteModalOpen,
  onEdit,
  onDeleteOpen,
  onDeleteClose,
  onDeleteConfirm,
  onNameChange,
  onFieldChange,
  onSave,
  onCancel,
}: RoutineCardContentProps) {
  return (
    <>
      <div className="grid gap-3 2xl:grid-cols-[minmax(0,2fr)_repeat(4,minmax(120px,0.6fr))_auto] 2xl:items-center">
        <RoutineCardHeader
          isEditing={isEditing}
          isGlobal={routine.isGlobal}
          name={name}
          onNameChange={onNameChange}
        />
        <RoutineCardMetrics
          draft={draft}
          isEditing={isEditing && !routine.isGlobal}
          cyclesBeforeLongRest={routine.cyclesBeforeLongRest}
          longRestMinutes={routine.longRestMinutes}
          onChange={(key, value) => onFieldChange(key, value)}
          shortRestMinutes={routine.shortRestMinutes}
          workMinutes={routine.workMinutes}
        />
        <RoutineCardActions
          isDeletingRoutine={isDeletingRoutine}
          isEditing={isEditing}
          isGlobal={routine.isGlobal}
          onCancel={onCancel}
          onDelete={onDeleteOpen}
          onEdit={onEdit}
          onSave={onSave}
        />
      </div>

      <RoutineDeleteModal
        isDeletingRoutine={isDeletingRoutine}
        onClose={onDeleteClose}
        onConfirm={onDeleteConfirm}
        open={isDeleteModalOpen}
      />
    </>
  );
}
