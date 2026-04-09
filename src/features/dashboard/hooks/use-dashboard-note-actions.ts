import { apiRequest } from "@/src/features/dashboard/utils/api-request";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

type NoteActionsProps = {
  noteDrafts: Record<string, string>;
  setNoteDrafts: Dispatch<SetStateAction<Record<string, string>>>;
  refreshDashboard: (successMessage?: string) => Promise<void>;
  runMutation: (work: () => Promise<void>) => Promise<void>;
};

export function useDashboardNoteActions(props: NoteActionsProps) {
  async function handleNoteCreate(taskId: string) {
    const content = props.noteDrafts[taskId]?.trim();
    if (!content) return toast.error("Write a note before saving it.");

    await props.runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/notes`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      props.setNoteDrafts((current) => ({ ...current, [taskId]: "" }));
      await props.refreshDashboard("Note added.");
    });
  }

  async function handleNoteDelete(taskId: string, noteId: string) {
    await props.runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/notes/${noteId}`, { method: "DELETE" });
      await props.refreshDashboard("Note deleted.");
    });
  }

  return { handleNoteCreate, handleNoteDelete };
}
