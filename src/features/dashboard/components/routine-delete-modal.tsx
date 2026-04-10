import { MaskIcon } from "@/src/components/ui/mask-icon";
import { Modal } from "@/src/components/ui/modal";

type RoutineDeleteModalProps = {
  open: boolean;
  isDeletingRoutine: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function RoutineDeleteModal({
  open,
  isDeletingRoutine,
  onClose,
  onConfirm,
}: RoutineDeleteModalProps) {
  return (
    <Modal
      className="max-w-md"
      description="This will permanently remove the routine from your private presets."
      onClose={() => {
        if (!isDeletingRoutine) {
          onClose();
        }
      }}
      open={open}
      title="Delete routine?"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <RoutineDeleteModalCancel disabled={isDeletingRoutine} onClose={onClose} />
        <RoutineDeleteModalConfirm
          isDeletingRoutine={isDeletingRoutine}
          onConfirm={onConfirm}
        />
      </div>
    </Modal>
  );
}

function RoutineDeleteModalCancel({
  disabled,
  onClose,
}: {
  disabled: boolean;
  onClose: () => void;
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={disabled}
      onClick={onClose}
      type="button"
    >
      Cancel
    </button>
  );
}

function RoutineDeleteModalConfirm({
  isDeletingRoutine,
  onConfirm,
}: {
  isDeletingRoutine: boolean;
  onConfirm: () => void;
}) {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-600 bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-80"
      disabled={isDeletingRoutine}
      onClick={onConfirm}
      type="button"
    >
      {isDeletingRoutine ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
      ) : (
        <MaskIcon className="h-4 w-4" src="/icons/delete.svg" />
      )}
      <span>{isDeletingRoutine ? "Deleting..." : "Delete routine"}</span>
    </button>
  );
}
