import type { NewTaskDraft, TaskDraft } from "@/src/features/dashboard/types";
import { taskPriorityOptions } from "@/src/lib/contracts";

type PriorityValue = NewTaskDraft["priority"] | TaskDraft["priority"];

export function TaskPrioritySelect(props: {
  className: string;
  value: PriorityValue;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className={props.className}
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
