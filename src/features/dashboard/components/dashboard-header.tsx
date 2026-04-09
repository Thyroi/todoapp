import { DashboardStats } from "@/src/features/dashboard/components/dashboard-stats";
import { useDashboard } from "@/src/features/dashboard/context";

export function DashboardHeader() {
  const { state } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-900/10 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
            Authenticated Workspace
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Control de tareas, pomodoros y foco en un solo panel.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
              Tu sesión actual es <strong>{state.data.user.email}</strong>. Desde aquí
              puedes crear tareas, asignar planes pomodoro, editar rutinas propias y
              llevar notas operativas sin salir del flujo.
            </p>
          </div>
        </div>
        <DashboardStats />
      </div>
    </section>
  );
}
