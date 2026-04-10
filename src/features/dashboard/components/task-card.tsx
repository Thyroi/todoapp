import { TaskEditor } from "@/src/features/dashboard/components/task-editor";
import { TaskNotesCard } from "@/src/features/dashboard/components/task-notes-card";
import { getTaskStatusMeta } from "@/src/features/dashboard/utils/task-meta";
import type { TaskDto } from "@/src/lib/contracts";

type TaskCardProps = {
  task: TaskDto;
  isExpanded: boolean;
  onSelect: () => void;
  onCollapse?: () => void;
};

export function TaskCard({ task, isExpanded, onSelect, onCollapse }: TaskCardProps) {
  const statusMeta = getTaskStatusMeta(task.status);

  return (
    <article
      className={`animate-card-enter rounded-4xl border bg-slate-50/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition ${
        isExpanded
          ? "border-slate-200 p-4 sm:p-5"
          : `cursor-pointer border-slate-200 border-l-4 px-4 py-3 hover:bg-white ${statusMeta.cardBorderClassName}`
      }`}
      onClick={() => {
        if (!isExpanded) {
          onSelect();
        }
      }}
    >
      <TaskEditor
        isExpanded={isExpanded}
        onCollapse={onCollapse}
        onSelect={onSelect}
        task={task}
      />
      {isExpanded ? (
        <div className="mt-5">
          <TaskNotesCard task={task} />
        </div>
      ) : null}
    </article>
  );
}
