import { useDashboard } from "@/src/features/dashboard/context";
import type { TaskDto } from "@/src/lib/contracts";

export function TaskNotesList({ task }: { task: TaskDto }) {
  const { actions } = useDashboard();

  return task.notes.map((note) => (
    <article
      key={note.id}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
    >
      <p className="text-sm leading-6 text-slate-700">{note.content}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500">
          {new Date(note.createdAt).toLocaleString()}
        </span>
        <button
          className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600"
          onClick={() => void actions.handleNoteDelete(task.id, note.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  ));
}
