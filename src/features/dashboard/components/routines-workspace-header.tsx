import { Tooltip } from "@/src/components/ui/tooltip";

type RoutinesWorkspaceHeaderProps = {
  onBackToTasks: () => void;
  onCreateRoutine: () => void;
};

export function RoutinesWorkspaceHeader({
  onBackToTasks,
  onCreateRoutine,
}: RoutinesWorkspaceHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 className="text-xl font-semibold">Routines</h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage reusable focus presets in a dedicated workspace, then attach them to
          tasks only when you need them.
        </p>
      </div>
      <div className="flex flex-row items-center justify-end gap-3 self-end">
        <button
          className="rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
          onClick={onBackToTasks}
          type="button"
        >
          Back to tasks
        </button>
        <Tooltip content="Create a new routine">
          <button
            aria-label="Create a new routine"
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-2xl font-medium leading-none text-white transition hover:bg-slate-800"
            onClick={onCreateRoutine}
            type="button"
          >
            +
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
