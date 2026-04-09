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
      <div className="mt-4 space-y-3">
        <TaskNotesList task={task} />
        <textarea
          className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
          placeholder="Write a note linked to this task"
          value={state.noteDrafts[task.id] ?? ""}
          onChange={(event) => actions.setNoteDraft(task.id, event.target.value)}
        />
        <button
          className="w-full rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          onClick={() => void actions.handleNoteCreate(task.id)}
          type="button"
        >
          Add Note
        </button>
      </div>
    </section>
  );
}
