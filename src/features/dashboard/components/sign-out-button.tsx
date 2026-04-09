import { useDashboard } from "@/src/features/dashboard/context";

export function SignOutButton() {
  const { actions } = useDashboard();

  return (
    <button
      className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      onClick={() => void actions.handleLogout()}
      type="button"
    >
      Sign Out
    </button>
  );
}
