type OwnershipFilter = "ALL" | "GLOBAL" | "MINE";

type RoutinesOwnershipFilterProps = {
  ownershipFilter: OwnershipFilter;
  totalCount: number;
  mineCount: number;
  globalCount: number;
  onChange: (value: OwnershipFilter) => void;
};

export function RoutinesOwnershipFilter({
  ownershipFilter,
  totalCount,
  mineCount,
  globalCount,
  onChange,
}: RoutinesOwnershipFilterProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="grid grid-cols-3 gap-2 rounded-3xl bg-slate-100 p-1">
        {[
          ["ALL", `All · ${totalCount}`],
          ["MINE", `Mine · ${mineCount}`],
          ["GLOBAL", `Global · ${globalCount}`],
        ].map(([key, label]) => (
          <OwnershipFilterButton
            key={key}
            active={ownershipFilter === key}
            label={label}
            onClick={() => onChange(key as OwnershipFilter)}
          />
        ))}
      </div>
      <p className="text-sm text-slate-500">{getOwnershipCopy(ownershipFilter)}</p>
    </div>
  );
}

function OwnershipFilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white shadow-sm" : "text-slate-700 hover:bg-white"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function getOwnershipCopy(filter: OwnershipFilter) {
  if (filter === "GLOBAL") return "Viewing the shared preset library only.";
  if (filter === "MINE") return "Viewing only routines you can edit and remove.";
  return "Viewing every preset available to your workspace.";
}
