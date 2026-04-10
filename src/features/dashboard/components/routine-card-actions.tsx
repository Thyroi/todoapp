import { MaskIcon } from "@/src/components/ui/mask-icon";
import { Tooltip } from "@/src/components/ui/tooltip";

type RoutineCardActionsProps = {
  isGlobal: boolean;
  isEditing: boolean;
  isDeletingRoutine: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function RoutineCardActions({
  isGlobal,
  isEditing,
  isDeletingRoutine,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: RoutineCardActionsProps) {
  if (isGlobal) {
    return <div className="hidden self-center 2xl:block" />;
  }

  if (isEditing) {
    return (
      <div className="flex flex-wrap items-center justify-start gap-2 self-center">
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          disabled={isDeletingRoutine}
          onClick={onSave}
          type="button"
        >
          Save
        </button>
        <button
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          disabled={isDeletingRoutine}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 self-center 2xl:justify-end">
      <Tooltip content="Edit routine">
        <button
          aria-label="Edit routine"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition ${
            isEditing
              ? "bg-blue-600 text-white"
              : "bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
          disabled={isDeletingRoutine}
          onClick={onEdit}
          type="button"
        >
          <MaskIcon src="/icons/edit.svg" />
        </button>
      </Tooltip>
      <Tooltip content="Delete routine">
        <button
          aria-label="Delete routine"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-transparent text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:bg-red-600 disabled:text-white"
          disabled={isDeletingRoutine}
          onClick={onDelete}
          type="button"
        >
          {isDeletingRoutine ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
          ) : (
            <MaskIcon src="/icons/delete.svg" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}
