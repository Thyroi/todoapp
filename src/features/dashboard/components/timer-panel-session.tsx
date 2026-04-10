type TimerPanelSessionProps = {
  taskTitle: string;
  routineName: string;
  phase: string;
};

export function TimerPanelSession({
  taskTitle,
  routineName,
  phase,
}: TimerPanelSessionProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
          Focus Session
        </p>
        <h3 className="mt-2 text-2xl font-semibold">{taskTitle}</h3>
        <p className="mt-3 text-sm text-slate-300">{routineName}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-right">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Phase</p>
        <p className="mt-2 text-lg font-medium capitalize">{phase}</p>
      </div>
    </div>
  );
}
