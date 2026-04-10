"use client";

import { DashboardHeader } from "@/src/features/dashboard/components/dashboard-header";
import { DashboardMain } from "@/src/features/dashboard/components/dashboard-main";
import { TimerSection } from "@/src/features/dashboard/components/timer-section";
import { SignOutButton } from "./sign-out-button";
import { useState } from "react";

export function DashboardView() {
  const [activeWorkspace, setActiveWorkspace] = useState<"tasks" | "routines">("tasks");

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#f3eee4_35%,#eef2f7_100%)] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <DashboardHeader />
        <section className="space-y-6">
          <TimerSection
            activeWorkspace={activeWorkspace}
            onOpenRoutines={() => setActiveWorkspace("routines")}
          />
          <DashboardMain
            activeWorkspace={activeWorkspace}
            onBackToTasks={() => setActiveWorkspace("tasks")}
          />
        </section>
        <div className="flex justify-end">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
