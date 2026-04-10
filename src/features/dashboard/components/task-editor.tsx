import { TaskEditorContent } from "@/src/features/dashboard/components/task-editor-content";
import { useTaskEditorState } from "@/src/features/dashboard/hooks/use-task-editor-state";
import type { TaskDto } from "@/src/lib/contracts";

type TaskEditorProps = {
  task: TaskDto;
  isExpanded: boolean;
  onSelect: () => void;
  onCollapse?: () => void;
};

export function TaskEditor({
  task,
  isExpanded,
  onSelect,
  onCollapse,
}: TaskEditorProps) {
  const { contentProps } = useTaskEditorState(task, isExpanded, onSelect);
  return <TaskEditorContent {...contentProps} onCollapse={onCollapse} />;
}
