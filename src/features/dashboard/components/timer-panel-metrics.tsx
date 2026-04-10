type TimerPanelMetricsProps = {
  remaining: string;
  completed: number;
  total: number;
  mode: string;
};

export function TimerPanelMetrics({
  remaining,
  completed,
  total,
  mode,
}: TimerPanelMetricsProps) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Remaining</p>
        <p className="mt-2 text-5xl font-semibold tracking-tight sm:text-6xl">
          {remaining}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TimerMetricCard label="Completed Cycles" value={`${completed} / ${total}`} />
        <TimerMetricCard label="Mode" value={mode} />
      </div>
    </div>
  );
}

function TimerMetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </article>
  );
}
