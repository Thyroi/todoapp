import type { NewTaskDraft, RoutineDraft } from "@/src/features/dashboard/types";

export const taskFieldConfigs = [
  {
    key: "title",
    label: "Title",
    helpText: "This is the main label you will scan in the task list.",
  },
  {
    key: "status",
    label: "Status",
    helpText: "Shows the current stage of the task in your workflow.",
  },
  {
    key: "description",
    label: "Description",
    helpText: "Use this for context, constraints or the expected outcome.",
  },
  {
    key: "priority",
    label: "Priority",
    helpText: "Sets how urgent or important the task should feel in the workflow.",
  },
] as const;

export const planFieldConfigs = [
  {
    key: "routineId",
    label: "Routine",
    helpText: "Chooses the focus preset that defines work and rest timing.",
  },
  {
    key: "totalCycles",
    label: "Total cycles",
    helpText: "Sets how many focus cycles this task should complete in total.",
  },
  {
    key: "completedCycles",
    label: "Completed cycles",
    helpText: "Tracks progress if part of the plan was already completed.",
  },
] as const;

export const routineFieldConfigs = [
  {
    key: "name",
    label: "Name",
    inputType: "text",
    helpText: "This is the name you will see when assigning the routine to a task.",
  },
  {
    key: "workMinutes",
    label: "Work",
    inputType: "number",
    helpText: "Sets how long each focus block lasts.",
  },
  {
    key: "shortRestMinutes",
    label: "Short rest",
    inputType: "number",
    helpText: "Sets the short break between focus blocks.",
  },
  {
    key: "longRestMinutes",
    label: "Long rest",
    inputType: "number",
    helpText: "Sets the long break after the cycle target is reached.",
  },
  {
    key: "cyclesBeforeLongRest",
    label: "Cycles / long rest",
    inputType: "number",
    helpText: "Triggers the long break after this many focus cycles.",
  },
] satisfies Array<{
  key: keyof RoutineDraft;
  label: string;
  inputType: "text" | "number";
  helpText: string;
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
