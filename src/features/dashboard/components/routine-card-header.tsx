type RoutineCardHeaderProps = {
  name: string;
  isGlobal: boolean;
  isEditing: boolean;
  onNameChange: (value: string) => void;
};

export function RoutineCardHeader({
  name,
  isGlobal,
  isEditing,
  onNameChange,
}: RoutineCardHeaderProps) {
  return (
    <RoutineCardTitle
      isEditing={isEditing}
      isGlobal={isGlobal}
      name={name}
      onNameChange={onNameChange}
    />
  );
}

function RoutineCardTitle({
  name,
  isGlobal,
  isEditing,
  onNameChange,
}: {
  name: string;
  isGlobal: boolean;
  isEditing: boolean;
  onNameChange: (value: string) => void;
}) {
  if (isEditing && !isGlobal) {
    return (
      <input
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-xl font-semibold outline-none focus:border-orange-500"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
      />
    );
  }

  return (
    <div className="min-w-0">
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
          isGlobal
            ? "border-slate-300 bg-slate-100 text-slate-700"
            : "border-sky-200 bg-sky-50 text-sky-800"
        }`}
      >
        {isGlobal ? "Global preset" : "My routine"}
      </span>
      <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
        {name}
      </h3>
    </div>
  );
}
