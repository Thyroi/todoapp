export function TaskEditorButtons(props: { onSave: () => void; onDelete: () => void }) {
  return (
    <>
      <button
        className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        onClick={props.onSave}
        type="button"
      >
        Save Task
      </button>
      <button
        className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
        onClick={props.onDelete}
        type="button"
      >
        Delete
      </button>
    </>
  );
}
