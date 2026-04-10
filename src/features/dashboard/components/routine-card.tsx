import { RoutineCardContent } from "@/src/features/dashboard/components/routine-card-content";
import { useRoutineCardState } from "@/src/features/dashboard/hooks/use-routine-card-state";
import type { RoutineDto } from "@/src/lib/contracts";

type RoutineCardProps = {
  routine: RoutineDto;
};

export function RoutineCard({ routine }: RoutineCardProps) {
  const {
    draft,
    handleCancelEdit,
    handleDelete,
    handleFieldChange,
    handleNameChange,
    handleSave,
    isDeletingRoutine,
    isDeleteModalOpen,
    isEditing,
    name,
    setIsDeleteModalOpen,
    setIsEditing,
  } = useRoutineCardState(routine);

  return (
    <article className="animate-card-enter rounded-4xl border border-slate-200 bg-slate-50/90 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:p-5">
      <RoutineCardContent
        draft={draft}
        isDeleteModalOpen={isDeleteModalOpen}
        isDeletingRoutine={isDeletingRoutine}
        isEditing={isEditing}
        name={name}
        onCancel={handleCancelEdit}
        onDeleteClose={() => setIsDeleteModalOpen(false)}
        onDeleteConfirm={() => void handleDelete()}
        onDeleteOpen={() => setIsDeleteModalOpen(true)}
        onEdit={() => setIsEditing(true)}
        onFieldChange={handleFieldChange}
        onNameChange={handleNameChange}
        onSave={() => void handleSave()}
        routine={routine}
      />
    </article>
  );
}
