import { FieldHelpIcon } from "@/src/features/dashboard/components/field-help-icon";
import { MaskIcon } from "@/src/components/ui/mask-icon";
import { TimerPanel } from "@/src/features/dashboard/components/timer-panel";
import { useDashboard } from "@/src/features/dashboard/context";

type TimerSectionProps = {
  activeWorkspace: "tasks" | "routines";
  onOpenRoutines: () => void;
};

export function TimerSection({ activeWorkspace, onOpenRoutines }: TimerSectionProps) {
  const { state, actions } = useDashboard();

  return (
    <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Focus Engine
            </span>
            <div className="mt-3 flex items-center gap-2">
              <h2 className="text-xl font-semibold">Timer</h2>
              <FieldHelpIcon content="Runs the active pomodoro plan attached to a task and tracks its progress." />
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Run work and rest phases from any task that already has a plan.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-900 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={onOpenRoutines}
              type="button"
            >
              <MaskIcon className="h-4 w-4" src="/icons/settings.svg" />
              <span>
                {activeWorkspace === "routines"
                  ? "Configuring routines"
                  : "Configure routines"}
              </span>
            </button>
            <button
              className="rounded-full border border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
              onClick={actions.handleNotificationToggle}
              type="button"
            >
              {state.notificationsEnabled ? "Disable Alerts" : "Enable Alerts"}
            </button>
          </div>
        </div>
      </div>
      <TimerPanel />
    </section>
  );
}
