import { apiRequest } from "@/src/features/dashboard/utils/api-request";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function useDashboardSessionActions(
  runMutation: (work: () => Promise<void>) => Promise<boolean>,
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    await runMutation(async () => {
      await apiRequest<{ success: true }>("/api/auth/logout", {
        method: "POST",
        body: "{}",
      });
      startTransition(() => {
        router.push("/login");
        router.refresh();
      });
    });
  }

  return { isPending, handleLogout };
}
