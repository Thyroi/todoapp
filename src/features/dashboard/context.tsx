"use client";

import { useDashboardController } from "@/src/features/dashboard/hooks/use-dashboard-controller";
import type { DashboardShellProps } from "@/src/features/dashboard/types";
import { createContext, useContext, type ReactNode } from "react";

type DashboardContextValue = ReturnType<typeof useDashboardController>;

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({
  initialData,
  children,
}: DashboardShellProps & { children: ReactNode }) {
  const value = useDashboardController(initialData);
  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const value = useContext(DashboardContext);
  if (!value)
    throw new Error("Dashboard context is only available inside DashboardProvider.");
  return value;
}
