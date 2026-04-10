import type { TaskStatusOption } from "@/src/lib/contracts";
import { taskStatusOptions } from "@/src/lib/contracts";

export function TaskStatusSelect(props: {
  className?: string;
  value: TaskStatusOption;
  onChange: (value: TaskStatusOption) => void;
}) {
  return (
    <select
      className={
        props.className ??
        "w-full appearance-none rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold tracking-[0.08em] text-slate-700 outline-none transition focus:border-orange-500"
      }
      value={props.value}
      onChange={(event) => props.onChange(event.target.value as TaskStatusOption)}
    >
      {taskStatusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
