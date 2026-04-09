import { RoutineNumberFields } from "@/src/features/dashboard/components/routine-number-fields";
import { useDashboard } from "@/src/features/dashboard/context";

export function CreateRoutineSection() {
  const { state, actions } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold">Create Routine</h2>
      <p className="mt-1 text-sm text-slate-600">
        Build private presets or clone a global one into your own space.
      </p>
      <form
        className="mt-5 grid gap-3 sm:grid-cols-2"
        onSubmit={actions.handleCreateRoutine}
      >
        <input
          className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
          placeholder="Routine name"
          required
          value={state.newRoutine.name}
          onChange={(event) =>
            actions.setNewRoutine((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
        />
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
