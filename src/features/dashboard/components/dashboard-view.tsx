import { DashboardHeader } from "@/src/features/dashboard/components/dashboard-header";
import { DashboardMain } from "@/src/features/dashboard/components/dashboard-main";
import { DashboardSidebar } from "@/src/features/dashboard/components/dashboard-sidebar";
import { SignOutButton } from "./sign-out-button";

export function DashboardView() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#f3eee4_35%,#eef2f7_100%)] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <DashboardHeader />
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.45fr]">
          <DashboardSidebar />
          <DashboardMain />
        </section>
        <div className="flex justify-end">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
