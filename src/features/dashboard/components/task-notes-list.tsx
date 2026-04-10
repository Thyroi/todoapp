import { MaskIcon } from "@/src/components/ui/mask-icon";
import { Modal } from "@/src/components/ui/modal";
import { Tooltip } from "@/src/components/ui/tooltip";
import { useDashboard } from "@/src/features/dashboard/context";
import type { TaskDto } from "@/src/lib/contracts";
import { useState } from "react";

export function TaskNotesList({ task }: { task: TaskDto }) {
  const { actions } = useDashboard();
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  return (
    <>
      {task.notes.map((note) => (
        <article
          key={note.id}
          className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
        >
          <p className="text-sm leading-6 text-slate-700">{note.content}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {new Date(note.createdAt).toLocaleString()}
            </span>
            <Tooltip content="Delete note">
              <button
                aria-label="Delete note"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-wait disabled:bg-red-600 disabled:text-white"
                disabled={deletingNoteId === note.id}
                onClick={() => setNoteToDelete(note.id)}
                type="button"
              >
                {deletingNoteId === note.id ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                ) : (
                  <MaskIcon className="h-4 w-4" src="/icons/delete.svg" />
                )}
              </button>
            </Tooltip>
          </div>
        </article>
      ))}

      <Modal
        className="max-w-md"
        description="This note will be permanently removed from the task history."
        onClose={() => {
          if (!deletingNoteId) {
            setNoteToDelete(null);
          }
        }}
        open={Boolean(noteToDelete)}
        title="Delete note?"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={Boolean(deletingNoteId)}
            onClick={() => setNoteToDelete(null)}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-600 bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-80"
            disabled={Boolean(deletingNoteId) || !noteToDelete}
            onClick={async () => {
              if (!noteToDelete) return;

              setDeletingNoteId(noteToDelete);
              const success = await actions.handleNoteDelete(task.id, noteToDelete);

              if (!success) {
                setDeletingNoteId(null);
                return;
              }

              setNoteToDelete(null);
            }}
            type="button"
          >
            {deletingNoteId ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            ) : (
              <MaskIcon className="h-4 w-4" src="/icons/delete.svg" />
            )}
            <span>{deletingNoteId ? "Deleting..." : "Delete note"}</span>
          </button>
        </div>
      </Modal>
    </>
  );
}
