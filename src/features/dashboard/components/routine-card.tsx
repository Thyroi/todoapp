import { RoutineCardActions } from "@/src/features/dashboard/components/routine-card-actions";
import { RoutineFieldGrid } from "@/src/features/dashboard/components/routine-field-grid";
import { useDashboard } from "@/src/features/dashboard/context";
import type { RoutineDto } from "@/src/lib/contracts";

export function RoutineCard({ routine }: { routine: RoutineDto }) {
  const { state, actions } = useDashboard();
  const draft = state.routineDrafts[routine.id];

  return (
    <article className="rounded-4xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {routine.isGlobal ? "Global preset" : "My routine"}
          </p>
          <h3 className="mt-1 text-lg font-semibold">{routine.name}</h3>
        </div>
        {routine.isGlobal ? (
          <button
            className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 shadow-sm"
            onClick={() => actions.cloneRoutineIntoForm(routine)}
            type="button"
          >
            Clone
          </button>
        ) : null}
      </div>
      <RoutineFieldGrid
        routine={routine}
        draft={draft}
        onChange={(key, value) => actions.setRoutineDraft(routine.id, key, value)}
      />
      {!routine.isGlobal ? (
        <RoutineCardActions
          onSave={() => void actions.handleRoutineSave(routine.id)}
          onDelete={() => void actions.handleRoutineDelete(routine.id)}
        />
      ) : null}
    </article>
  );
}
