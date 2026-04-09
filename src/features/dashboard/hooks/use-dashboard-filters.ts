import type { StatusFilter } from "@/src/features/dashboard/types";
import type { DashboardData } from "@/src/lib/contracts";
import { useDeferredValue, useMemo, useState } from "react";

export function useDashboardFilters(tasks: DashboardData["tasks"]) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const deferredSearch = useDeferredValue(search);

  const filteredTasks = useMemo(() => {
    const needle = deferredSearch.trim().toLowerCase();

    return tasks.filter((task) => {
      const haystack = `${task.title} ${task.description ?? ""}`.toLowerCase();
      return (
        (!needle || haystack.includes(needle)) &&
        (statusFilter === "ALL" || task.status === statusFilter)
      );
    });
  }, [deferredSearch, statusFilter, tasks]);

  const taskStats = useMemo(
    () => ({
      total: tasks.length,
      active: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "DONE").length,
    }),
    [tasks],
  );

  return { search, setSearch, statusFilter, setStatusFilter, filteredTasks, taskStats };
}
