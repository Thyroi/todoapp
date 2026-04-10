type TimerPanelStatusProps = {
  timerStatus: string;
  notificationsEnabled: boolean;
  taskTitle: string;
};

export function TimerPanelStatus({
  timerStatus,
  notificationsEnabled,
  taskTitle,
}: TimerPanelStatusProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
      <TimerPanelChip label="Status" value={timerStatus} />
      <TimerPanelChip
        label="Alerts"
        value={notificationsEnabled ? "Enabled" : "Disabled"}
      />
      <TimerPanelChip label="Task" value={taskTitle} />
    </div>
  );
}

function TimerPanelChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200">
      {label} · {value}
    </span>
  );
}
