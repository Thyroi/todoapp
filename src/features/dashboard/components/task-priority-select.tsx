import type { NewTaskDraft, TaskDraft } from "@/src/features/dashboard/types";
import { taskPriorityOptions } from "@/src/lib/contracts";

type PriorityValue = NewTaskDraft["priority"] | TaskDraft["priority"];

export function TaskPrioritySelect(props: {
  className?: string;
  value: PriorityValue;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className={
        props.className ??
        "w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold tracking-[0.08em] text-slate-700 outline-none transition focus:border-orange-500"
      }
      value={props.value ?? ""}
      onChange={(event) => props.onChange(event.target.value)}
    >
      <option value="">No priority</option>
      {taskPriorityOptions.map((priority) => (
        <option key={priority} value={priority}>
          {priority}
        </option>
      ))}
    </select>
  );
}
