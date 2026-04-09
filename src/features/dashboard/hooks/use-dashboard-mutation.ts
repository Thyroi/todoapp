import { toast } from "sonner";

export function useDashboardMutation() {
  return async function runMutation(work: () => Promise<void>) {
    try {
      await work();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The operation failed.");
    }
  };
}
