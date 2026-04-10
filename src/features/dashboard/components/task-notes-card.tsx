import { Tooltip } from "@/src/components/ui/tooltip";
import { MaskIcon } from "@/src/components/ui/mask-icon";
import { TaskNotesList } from "@/src/features/dashboard/components/task-notes-list";
import { useDashboard } from "@/src/features/dashboard/context";
import type { TaskDto } from "@/src/lib/contracts";

export function TaskNotesCard({ task }: { task: TaskDto }) {
  const { state, actions } = useDashboard();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
          Notes
        </h3>
        <span className="text-xs text-slate-500">{task.notes.length} items</span>
      </div>
      <div className="mt-4 grid gap-4 2xl:grid-cols-[minmax(0,3fr)_minmax(220px,1fr)] 2xl:items-stretch">
        <div className="min-h-32 rounded-3xl bg-slate-100/80 p-3">
          <div className="max-h-44 space-y-3 overflow-y-auto pr-1">
            {task.notes.length === 0 ? (
              <p className="text-sm italic leading-6 text-slate-400">
                No notes yet for this task.
              </p>
            ) : (
              <TaskNotesList task={task} />
            )}
          </div>
        </div>
        <div className="2xl:min-h-32">
          <div className="relative h-full min-h-32">
            <textarea
              className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-16 outline-none focus:border-orange-500 2xl:h-full"
              placeholder="Add an operational note for this task"
              value={state.noteDrafts[task.id] ?? ""}
              onChange={(event) => actions.setNoteDraft(task.id, event.target.value)}
            />
            <Tooltip content="Add note">
              <button
                aria-label="Add note"
                className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-900 bg-slate-950 text-white transition hover:bg-slate-800"
                onClick={() => void actions.handleNoteCreate(task.id)}
                type="button"
              >
                <MaskIcon src="/icons/plus.svg" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
}
