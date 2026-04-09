import { useDashboardControllerActions } from "@/src/features/dashboard/hooks/use-dashboard-controller-actions";
import { useDashboardControllerState } from "@/src/features/dashboard/hooks/use-dashboard-controller-state";
import { useDashboardDomainActions } from "@/src/features/dashboard/hooks/use-dashboard-domain-actions";
import { useDashboardServices } from "@/src/features/dashboard/hooks/use-dashboard-services";
import { formatSeconds } from "@/src/features/dashboard/utils/format-seconds";
import { getRemainingSeconds } from "@/src/features/dashboard/utils/timer";
import type { DashboardData } from "@/src/lib/contracts";

export function useDashboardController(initialData: DashboardData) {
  const services = useDashboardServices(initialData);
  const domainActions = useDashboardDomainActions(services);
  const controllerState = useDashboardControllerState(services);
  const controllerActions = useDashboardControllerActions({
    ...services,
    ...domainActions,
  });

  return {
    state: controllerState,
    actions: controllerActions,
    utils: { formatSeconds, getRemainingSeconds },
  };
}
