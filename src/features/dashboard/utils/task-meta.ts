import type { TaskPriorityOption, TaskStatusOption } from "@/src/lib/contracts";

const statusMeta: Record<
  TaskStatusOption,
  {
    label: string;
    pillClassName: string;
    selectClassName: string;
    cardBorderClassName: string;
  }
> = {
  TODO: {
    label: "To do",
    pillClassName: "border-slate-300 bg-slate-100 text-slate-700",
    selectClassName: "border-slate-200 bg-slate-50 text-slate-700",
    cardBorderClassName: "border-l-slate-300",
  },
  IN_PROGRESS: {
    label: "In progress",
    pillClassName: "border-amber-200 bg-amber-50 text-amber-800",
    selectClassName: "border-amber-200 bg-amber-50/70 text-amber-900",
    cardBorderClassName: "border-l-amber-300",
  },
  DONE: {
    label: "Done",
    pillClassName: "border-emerald-200 bg-emerald-50 text-emerald-800",
    selectClassName: "border-emerald-200 bg-emerald-50/70 text-emerald-900",
    cardBorderClassName: "border-l-emerald-300",
  },
  ARCHIVED: {
    label: "Archived",
    pillClassName: "border-slate-400 bg-slate-200 text-slate-700",
    selectClassName: "border-slate-300 bg-slate-100 text-slate-700",
    cardBorderClassName: "border-l-slate-400",
  },
};

const priorityMeta: Record<
  TaskPriorityOption | "NONE",
  { label: string; pillClassName: string; selectClassName: string }
> = {
  NONE: {
    label: "No priority",
    pillClassName: "border-slate-300 bg-slate-100 text-slate-600",
    selectClassName: "border-slate-200 bg-slate-50 text-slate-700",
  },
  LOW: {
    label: "Low",
    pillClassName: "border-sky-200 bg-sky-50 text-sky-800",
    selectClassName: "border-sky-200 bg-sky-50/70 text-sky-900",
  },
  MEDIUM: {
    label: "Medium",
    pillClassName: "border-yellow-200 bg-yellow-50 text-yellow-800",
    selectClassName: "border-yellow-200 bg-yellow-50/70 text-yellow-900",
  },
  HIGH: {
    label: "High",
    pillClassName: "border-orange-200 bg-orange-50 text-orange-800",
    selectClassName: "border-orange-200 bg-orange-50/70 text-orange-900",
  },
  URGENT: {
    label: "Urgent",
    pillClassName: "border-red-200 bg-red-50 text-red-800",
    selectClassName: "border-red-200 bg-red-50/70 text-red-900",
  },
};

export function getTaskStatusMeta(status: TaskStatusOption) {
  return statusMeta[status];
}

export function getTaskPriorityMeta(priority: TaskPriorityOption | "") {
  return priorityMeta[priority || "NONE"];
}
