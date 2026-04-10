import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
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
        .map(({ key, label, helpText }) => (
          <label key={key} className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>{label}</span>
              <FieldHelpIcon content={helpText} />
            </div>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
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
