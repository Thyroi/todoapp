import { routineFieldConfigs } from "@/src/features/dashboard/constants";
import type { RoutineDraft } from "@/src/features/dashboard/types";
import type { RoutineDto } from "@/src/lib/contracts";

export function RoutineFieldGrid(props: {
  routine: RoutineDto;
  draft: RoutineDraft | undefined;
  onChange: (key: keyof RoutineDraft, value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {routineFieldConfigs.map(({ key, label, inputType }) => (
        <label
          key={key}
          className={key === "name" ? "space-y-2 sm:col-span-2" : "space-y-2"}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {label}
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500 disabled:bg-slate-100"
            disabled={props.routine.isGlobal}
            type={inputType}
            value={
              props.routine.isGlobal ? props.routine[key] : (props.draft?.[key] ?? "")
            }
            onChange={(event) => props.onChange(key, event.target.value)}
          />
        </label>
      ))}
    </div>
  );
}
