import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { routineFieldConfigs } from "@/src/features/dashboard/constants";
import { RoutineNumberFields } from "@/src/features/dashboard/components/routine-number-fields";
import { useDashboard } from "@/src/features/dashboard/context";

type CreateRoutineSectionProps = {
  surface?: "card" | "plain";
  onSuccess?: () => void;
};

export function CreateRoutineSection({
  surface = "card",
  onSuccess,
}: CreateRoutineSectionProps) {
  const { state, actions } = useDashboard();
  const nameField = routineFieldConfigs.find((field) => field.key === "name");
  const containerClassName =
    surface === "card"
      ? "rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm"
      : "rounded-3xl bg-white";

  return (
    <section className={containerClassName}>
      <h2 className="text-xl font-semibold">Create Routine</h2>
      <p className="mt-1 text-sm text-slate-600">
        Build private presets you can reuse across your tasks.
      </p>
      <form
        className="mt-5 grid gap-3 sm:grid-cols-2"
        onSubmit={async (event) => {
          const success = await actions.handleCreateRoutine(event);
          if (success) {
            onSuccess?.();
          }
        }}
      >
        <label className="space-y-2 sm:col-span-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <span>{nameField?.label ?? "Name"}</span>
            {nameField ? <FieldHelpIcon content={nameField.helpText} /> : null}
          </div>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
            placeholder="Name the routine"
            required
            value={state.newRoutine.name}
            onChange={(event) =>
              actions.setNewRoutine((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
          />
        </label>
        <RoutineNumberFields
          draft={state.newRoutine}
          onChange={(key, value) =>
            actions.setNewRoutine((current) => ({ ...current, [key]: Number(value) }))
          }
        />
        <button
          className="sm:col-span-2 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="submit"
        >
          Save Routine
        </button>
      </form>
    </section>
  );
}
