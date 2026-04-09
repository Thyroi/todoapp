import type { NewTaskDraft, RoutineDraft } from "@/src/features/dashboard/types";

export const routineFieldConfigs = [
  { key: "name", label: "Name", inputType: "text" },
  { key: "workMinutes", label: "Work", inputType: "number" },
  { key: "shortRestMinutes", label: "Short rest", inputType: "number" },
  { key: "longRestMinutes", label: "Long rest", inputType: "number" },
  {
    key: "cyclesBeforeLongRest",
    label: "Cycles / long rest",
    inputType: "number",
  },
] satisfies Array<{
  key: keyof RoutineDraft;
  label: string;
  inputType: "text" | "number";
}>;

export function createEmptyTaskDraft(): NewTaskDraft {
  return { title: "", description: "", priority: "" };
}

export function createEmptyRoutineDraft(): RoutineDraft {
  return {
    name: "",
    workMinutes: 25,
    shortRestMinutes: 5,
    longRestMinutes: 15,
    cyclesBeforeLongRest: 4,
  };
}
