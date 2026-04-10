import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { routineFieldConfigs } from "@/src/features/dashboard/constants";
import type { RoutineDraft } from "@/src/features/dashboard/types";

type RoutineCardMetricsProps = {
  draft?: RoutineDraft;
  isEditing: boolean;
  workMinutes: number;
  shortRestMinutes: number;
  longRestMinutes: number;
  cyclesBeforeLongRest: number;
  onChange: (key: keyof RoutineDraft, value: number) => void;
};

export function RoutineCardMetrics({
  draft,
  isEditing,
  workMinutes,
  shortRestMinutes,
  longRestMinutes,
  cyclesBeforeLongRest,
  onChange,
}: RoutineCardMetricsProps) {
  const helpByKey = Object.fromEntries(
    routineFieldConfigs.map((field) => [field.key, field.helpText]),
  ) as Record<keyof RoutineDraft, string>;

  return [
    ["workMinutes", "Work", draft?.workMinutes ?? workMinutes, "m"],
    ["shortRestMinutes", "Short", draft?.shortRestMinutes ?? shortRestMinutes, "m"],
    ["longRestMinutes", "Long", draft?.longRestMinutes ?? longRestMinutes, "m"],
    [
      "cyclesBeforeLongRest",
      "Cycles",
      draft?.cyclesBeforeLongRest ?? cyclesBeforeLongRest,
      "",
    ],
  ].map(([key, label, value, suffix]) => (
    <RoutineMetric
      helpText={helpByKey[key as keyof RoutineDraft]}
      key={String(key)}
      isEditing={isEditing}
      label={String(label)}
      suffix={String(suffix)}
      value={Number(value)}
      onChange={(nextValue) => onChange(key as keyof RoutineDraft, nextValue)}
    />
  ));
}

function RoutineMetric({
  label,
  value,
  suffix,
  helpText,
  isEditing,
  onChange,
}: {
  label: string;
  value: number;
  suffix: string;
  helpText: string;
  isEditing: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-3xl bg-white px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        <span>{label}</span>
        <FieldHelpIcon content={helpText} />
      </div>
      {isEditing ? (
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-lg font-semibold text-slate-900 outline-none focus:border-orange-500"
          min={1}
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      ) : (
        <p className="mt-2 text-lg font-semibold text-slate-900">
          {value}
          {suffix}
        </p>
      )}
    </div>
  );
}
