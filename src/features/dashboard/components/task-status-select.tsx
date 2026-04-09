import { taskStatusOptions } from "@/src/lib/contracts";

export function TaskStatusSelect(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
      value={props.value}
      onChange={(event) => props.onChange(event.target.value)}
    >
      {taskStatusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
