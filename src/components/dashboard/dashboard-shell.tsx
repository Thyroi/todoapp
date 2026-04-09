"use client";

import { DashboardView } from "@/src/features/dashboard/components/dashboard-view";
import { DashboardProvider } from "@/src/features/dashboard/context";
import type { DashboardShellProps } from "@/src/features/dashboard/types";

export function DashboardShell({ initialData }: DashboardShellProps) {
  return (
    <DashboardProvider initialData={initialData}>
      <DashboardView />
    </DashboardProvider>
  );
}
