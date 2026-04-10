import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { taskFieldConfigs } from "@/src/features/dashboard/constants";

type TaskEditorBodyProps = {
  description: string;
  isEditing: boolean;
  isDeletingTask: boolean;
  shouldShowExpandedContent: boolean;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function TaskEditorBody({
  description,
  isEditing,
  isDeletingTask,
  shouldShowExpandedContent,
  onDescriptionChange,
  onSave,
  onCancel,
}: TaskEditorBodyProps) {
  const descriptionField = taskFieldConfigs.find(
    (field) => field.key === "description",
  );

  if (isEditing) {
    return (
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] 2xl:items-stretch">
        <label className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{descriptionField?.label ?? "Description"}</span>
            {descriptionField ? (
              <FieldHelpIcon content={descriptionField.helpText} />
            ) : null}
          </div>
          <textarea
            className="min-h-32 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500 2xl:h-full"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </label>
        <div className="flex flex-col gap-3 2xl:min-h-32">
          <TaskEditorPrimaryButton
            disabled={isDeletingTask}
            label="Save"
            onClick={onSave}
          />
          <TaskEditorSecondaryButton
            disabled={isDeletingTask}
            label="Cancel"
            onClick={onCancel}
          />
        </div>
      </div>
    );
  }

  if (!shouldShowExpandedContent) {
    return null;
  }

  return (
    <div className="min-h-24 rounded-3xl bg-slate-100/80 px-4 py-3">
      <p
        className={
          description
            ? "max-h-28 overflow-y-auto text-sm leading-6 text-slate-600"
            : "text-sm italic leading-6 text-slate-400"
        }
      >
        {description || "No description yet."}
      </p>
    </div>
  );
}

function TaskEditorPrimaryButton({
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

function TaskEditorSecondaryButton({
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
