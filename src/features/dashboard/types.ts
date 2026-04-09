import type {
  DashboardData,
  RoutineDto,
  TaskPriorityOption,
  TaskStatusOption,
} from "@/src/lib/contracts";

export type DashboardShellProps = { initialData: DashboardData };
export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = { success: false; error: { message: string } };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
export type TimerPhase = "work" | "short-rest" | "long-rest";

export type TimerState = {
  taskId: string;
  taskTitle: string;
  routine: RoutineDto;
  totalCycles: number;
  completedCycles: number;
  phase: TimerPhase;
  phaseDurationSeconds: number;
  phaseEndsAt: number | null;
  remainingSeconds: number;
  isRunning: boolean;
};

export type RoutineDraft = {
  name: string;
  workMinutes: number;
  shortRestMinutes: number;
  longRestMinutes: number;
  cyclesBeforeLongRest: number;
};

export type NewTaskDraft = {
  title: string;
  description: string;
  priority: TaskPriorityOption | "";
};

export type TaskDraft = NewTaskDraft & { status: TaskStatusOption };
export type PlanDraft = {
  routineId: string;
  totalCycles: number;
  completedCycles: number;
};
export type StatusFilter = "ALL" | TaskStatusOption;
export type DashboardStats = { total: number; active: number; done: number };
