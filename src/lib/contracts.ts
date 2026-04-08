export const taskStatusOptions = ["TODO", "IN_PROGRESS", "DONE", "ARCHIVED"] as const;

export const taskPriorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export type TaskStatusOption = (typeof taskStatusOptions)[number];
export type TaskPriorityOption = (typeof taskPriorityOptions)[number];

export type SessionUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type RoutineDto = {
  id: string;
  userId: string | null;
  name: string;
  workMinutes: number;
  shortRestMinutes: number;
  longRestMinutes: number;
  cyclesBeforeLongRest: number;
  createdAt: string;
  updatedAt: string;
  isGlobal: boolean;
};

export type NoteDto = {
  id: string;
  taskId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type PomodoroPlanDto = {
  id: string;
  taskId: string;
  routineId: string;
  totalCycles: number;
  completedCycles: number;
  createdAt: string;
  updatedAt: string;
  routine: RoutineDto;
};

export type TaskDto = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  status: TaskStatusOption;
  priority: TaskPriorityOption | null;
  createdAt: string;
  updatedAt: string;
  notes: NoteDto[];
  pomodoroPlan: PomodoroPlanDto | null;
};

export type DashboardData = {
  user: SessionUser;
  tasks: TaskDto[];
  routines: RoutineDto[];
};
