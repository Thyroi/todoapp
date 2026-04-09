import {
  createEmptyRoutineDraft,
  createEmptyTaskDraft,
} from "@/src/features/dashboard/constants";
import {
  buildPlanDrafts,
  buildRoutineDrafts,
  buildTaskDrafts,
} from "@/src/features/dashboard/utils/drafts";
import type { DashboardData } from "@/src/lib/contracts";
import { useState } from "react";

export function useDashboardState(initialData: DashboardData) {
  const [data, setData] = useState(initialData);
  const [newTask, setNewTask] = useState(createEmptyTaskDraft);
  const [newRoutine, setNewRoutine] = useState(createEmptyRoutineDraft);
  const [taskDrafts, setTaskDrafts] = useState(() =>
    buildTaskDrafts(initialData.tasks),
  );
  const [planDrafts, setPlanDrafts] = useState(() =>
    buildPlanDrafts(initialData.tasks, initialData.routines),
  );
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});
  const [routineDrafts, setRoutineDrafts] = useState(() =>
    buildRoutineDrafts(initialData.routines),
  );

  return {
    data,
    setData,
    newTask,
    setNewTask,
    newRoutine,
    setNewRoutine,
    taskDrafts,
    setTaskDrafts,
    planDrafts,
    setPlanDrafts,
    noteDrafts,
    setNoteDrafts,
    routineDrafts,
    setRoutineDrafts,
  };
}
