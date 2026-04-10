import { Modal } from "@/src/components/ui/modal";
import { CreateRoutineSection } from "@/src/features/dashboard/components/create-routine-section";

type RoutinesCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export function RoutinesCreateModal({ open, onClose }: RoutinesCreateModalProps) {
  return (
    <Modal
      description="Create a reusable routine preset without leaving the routines workspace."
      onClose={onClose}
      open={open}
      title="New routine"
    >
      <CreateRoutineSection onSuccess={onClose} surface="plain" />
    </Modal>
  );
}
