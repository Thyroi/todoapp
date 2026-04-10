import { RoutineFieldGrid } from "@/src/features/dashboard/components/routine-field-grid";
import type { RoutineDraft } from "@/src/features/dashboard/types";
import type { RoutineDto } from "@/src/lib/contracts";

type RoutineCardEditorProps = {
  routine: RoutineDto;
  draft?: RoutineDraft;
  isDeletingRoutine: boolean;
  onChange: (key: keyof RoutineDraft, value: number | string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function RoutineCardEditor({
  routine,
  draft,
  isDeletingRoutine,
  onChange,
  onSave,
  onCancel,
}: RoutineCardEditorProps) {
  return (
    <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] 2xl:items-stretch">
      <RoutineFieldGrid draft={draft} routine={routine} onChange={onChange} />
      <div className="flex flex-col gap-3 2xl:min-h-32">
        <RoutineCardPrimaryButton
          disabled={isDeletingRoutine}
          label="Save"
          onClick={onSave}
        />
        <RoutineCardSecondaryButton
          disabled={isDeletingRoutine}
          label="Cancel"
          onClick={onCancel}
        />
      </div>
    </div>
  );
}

function RoutineCardPrimaryButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-900 bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 2xl:flex-1"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function RoutineCardSecondaryButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 2xl:flex-1"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}
