import { routineFieldConfigs } from "@/src/features/dashboard/constants";
import type { RoutineDraft } from "@/src/features/dashboard/types";

export function RoutineNumberFields(props: {
  draft: RoutineDraft;
  onChange: (key: keyof RoutineDraft, value: string) => void;
}) {
  return (
    <>
      {routineFieldConfigs
        .filter(({ key }) => key !== "name")
        .map(({ key, label }) => (
          <label key={key} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              {label}
            </span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
              min={1}
              type="number"
              value={props.draft[key]}
              onChange={(event) => props.onChange(key, event.target.value)}
            />
          </label>
        ))}
    </>
  );
}
