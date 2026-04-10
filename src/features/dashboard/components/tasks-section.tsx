import { Modal } from "@/src/components/ui/modal";
import { Tooltip } from "@/src/components/ui/tooltip";
import { CreateTaskSection } from "@/src/features/dashboard/components/create-task-section";
import { TaskCard } from "@/src/features/dashboard/components/task-card";
import { TaskFilters } from "@/src/features/dashboard/components/task-filters";
import { useDashboard } from "@/src/features/dashboard/context";
import { useState } from "react";

export function TasksSection() {
  const { state } = useDashboard();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask =
    state.filteredTasks.find((task) => task.id === selectedTaskId) ?? null;
  const collapsedTasks = state.filteredTasks.filter(
    (task) => task.id !== selectedTask?.id,
  );

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tasks</h2>
          <p className="mt-1 text-sm text-slate-600">
            Edit details inline, attach plans, write notes, and start focus sessions
            from each card.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center lg:justify-end">
          <TaskFilters />
          <div className="flex justify-end lg:flex-none">
            <Tooltip content="Create a new task">
              <button
                aria-label="Create a new task"
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-2xl font-medium leading-none text-white transition hover:bg-slate-800"
                onClick={() => setIsCreateTaskModalOpen(true)}
                type="button"
              >
                +
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {selectedTask ? (
        <div className="mt-6">
          <TaskCard
            isExpanded
            onCollapse={() => setSelectedTaskId(null)}
            onSelect={() => setSelectedTaskId(selectedTask.id)}
            task={selectedTask}
          />
        </div>
      ) : null}

      <div className={`${selectedTask ? "mt-4" : "mt-6"} space-y-4`}>
        {state.filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-600">
            No tasks match the current filter.
          </div>
        ) : (
          collapsedTasks.map((task) => (
            <TaskCard
              key={task.id}
              isExpanded={false}
              onSelect={() => setSelectedTaskId(task.id)}
              task={task}
            />
          ))
        )}
      </div>
      <Modal
        description="Create a task without leaving the active board. Once saved, it will appear immediately in the tasks column."
        onClose={() => setIsCreateTaskModalOpen(false)}
        open={isCreateTaskModalOpen}
        title="New task"
      >
        <CreateTaskSection
          onSuccess={() => setIsCreateTaskModalOpen(false)}
          surface="plain"
        />
      </Modal>
    </section>
  );
}
