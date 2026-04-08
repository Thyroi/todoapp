"use client";

import {
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useTransition,
  useDeferredValue,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  type DashboardData,
  type RoutineDto,
  type TaskDto,
  taskPriorityOptions,
  taskStatusOptions,
} from "@/src/lib/contracts";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import {
  setActiveTimerTaskId,
  setNotificationsEnabled,
} from "@/src/store/slices/app-slice";

type DashboardShellProps = {
  initialData: DashboardData;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
};

type ApiFailure = {
  success: false;
  error: {
    message: string;
  };
};

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

type TimerState = {
  taskId: string;
  taskTitle: string;
  routine: RoutineDto;
  totalCycles: number;
  completedCycles: number;
  phase: "work" | "short-rest" | "long-rest";
  phaseDurationSeconds: number;
  phaseEndsAt: number | null;
  remainingSeconds: number;
  isRunning: boolean;
};

type RoutineDraft = {
  name: string;
  workMinutes: number;
  shortRestMinutes: number;
  longRestMinutes: number;
  cyclesBeforeLongRest: number;
};

const routineFieldConfigs: Array<{
  key: keyof RoutineDraft;
  label: string;
  inputType: "text" | "number";
}> = [
  { key: "name", label: "Name", inputType: "text" },
  { key: "workMinutes", label: "Work", inputType: "number" },
  { key: "shortRestMinutes", label: "Short rest", inputType: "number" },
  { key: "longRestMinutes", label: "Long rest", inputType: "number" },
  {
    key: "cyclesBeforeLongRest",
    label: "Cycles / long rest",
    inputType: "number",
  },
];

function buildTaskDrafts(tasks: TaskDto[]) {
  return Object.fromEntries(
    tasks.map((task) => [
      task.id,
      {
        title: task.title,
        description: task.description ?? "",
        status: task.status,
        priority: task.priority ?? "",
      },
    ]),
  );
}

function buildPlanDrafts(tasks: TaskDto[], routines: RoutineDto[]) {
  const defaultRoutineId = routines[0]?.id ?? "";

  return Object.fromEntries(
    tasks.map((task) => [
      task.id,
      {
        routineId: task.pomodoroPlan?.routineId ?? defaultRoutineId,
        totalCycles: task.pomodoroPlan?.totalCycles ?? 4,
        completedCycles: task.pomodoroPlan?.completedCycles ?? 0,
      },
    ]),
  );
}

function buildRoutineDrafts(routines: RoutineDto[]) {
  return Object.fromEntries(
    routines
      .filter((routine) => !routine.isGlobal)
      .map((routine) => [
        routine.id,
        {
          name: routine.name,
          workMinutes: routine.workMinutes,
          shortRestMinutes: routine.shortRestMinutes,
          longRestMinutes: routine.longRestMinutes,
          cyclesBeforeLongRest: routine.cyclesBeforeLongRest,
        },
      ]),
  );
}

function formatSeconds(seconds: number) {
  const minutesPart = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secondsPart = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutesPart}:${secondsPart}`;
}

function getPhaseDurationSeconds(routine: RoutineDto, phase: TimerState["phase"]) {
  if (phase === "work") {
    return routine.workMinutes * 60;
  }

  if (phase === "short-rest") {
    return routine.shortRestMinutes * 60;
  }

  return routine.longRestMinutes * 60;
}

function getRemainingSeconds(timer: TimerState) {
  if (!timer.isRunning || timer.phaseEndsAt === null) {
    return timer.remainingSeconds;
  }

  return Math.max(0, Math.ceil((timer.phaseEndsAt - Date.now()) / 1000));
}

function buildRunningTimerState(
  baseTimer: Omit<
    TimerState,
    "phaseDurationSeconds" | "phaseEndsAt" | "remainingSeconds" | "isRunning"
  > & {
    phase: TimerState["phase"];
  },
) {
  const phaseDurationSeconds = getPhaseDurationSeconds(
    baseTimer.routine,
    baseTimer.phase,
  );

  return {
    ...baseTimer,
    phaseDurationSeconds,
    phaseEndsAt: Date.now() + phaseDurationSeconds * 1000,
    remainingSeconds: phaseDurationSeconds,
    isRunning: true,
  } satisfies TimerState;
}

export function DashboardShell({ initialData }: DashboardShellProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<TimerState | null>(null);
  const isTimerTransitioningRef = useRef(false);
  const notificationsEnabled = useAppSelector(
    (state) => state.app.notificationsEnabled,
  );
  const activeTimerTaskId = useAppSelector((state) => state.app.activeTimerTaskId);
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | (typeof taskStatusOptions)[number]
  >("ALL");
  const deferredSearch = useDeferredValue(search);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "",
  });
  const [newRoutine, setNewRoutine] = useState<RoutineDraft>({
    name: "",
    workMinutes: 25,
    shortRestMinutes: 5,
    longRestMinutes: 15,
    cyclesBeforeLongRest: 4,
  });
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
  const [timer, setTimer] = useState<TimerState | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  async function apiRequest<T>(input: string, init?: RequestInit) {
    const response = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    const payload = (await response.json()) as ApiResponse<T>;

    if (!response.ok || !payload.success) {
      throw new Error(payload.success ? "Unexpected response." : payload.error.message);
    }

    return payload.data;
  }

  async function refreshDashboard(successMessage?: string) {
    const nextData = await apiRequest<DashboardData>("/api/dashboard");
    setData(nextData);
    setTaskDrafts(buildTaskDrafts(nextData.tasks));
    setPlanDrafts(buildPlanDrafts(nextData.tasks, nextData.routines));
    setRoutineDrafts(buildRoutineDrafts(nextData.routines));

    if (timer && !nextData.tasks.some((task) => task.id === timer.taskId)) {
      setTimer(null);
      dispatch(setActiveTimerTaskId(null));
    }

    if (successMessage) {
      toast.success(successMessage);
    }
  }

  function setTaskDraft(taskId: string, key: string, value: string) {
    setTaskDrafts((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        [key]: value,
      },
    }));
  }

  function setPlanDraft(taskId: string, key: string, value: string) {
    setPlanDrafts((current) => ({
      ...current,
      [taskId]: {
        ...current[taskId],
        [key]: key === "routineId" ? value : Number(value),
      },
    }));
  }

  function setRoutineDraft(routineId: string, key: keyof RoutineDraft, value: string) {
    setRoutineDrafts((current) => ({
      ...current,
      [routineId]: {
        ...current[routineId],
        [key]: key === "name" ? value : Number(value),
      },
    }));
  }

  async function runMutation(work: () => Promise<void>, successMessage?: string) {
    try {
      await work();
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (mutationError) {
      toast.error(
        mutationError instanceof Error
          ? mutationError.message
          : "The operation failed.",
      );
    }
  }

  async function ensureAudioContext() {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextConstructor =
      window.AudioContext ??
      (
        window as Window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }

  const playTimerSound = useEffectEvent(
    async (variant: "transition" | "complete" = "transition") => {
      const audioContext = await ensureAudioContext();

      if (!audioContext) {
        return;
      }

      const startAt = audioContext.currentTime + 0.02;
      const notePattern =
        variant === "complete"
          ? [
              { frequency: 880, duration: 0.11, offset: 0 },
              { frequency: 1046, duration: 0.13, offset: 0.18 },
              { frequency: 1318, duration: 0.18, offset: 0.4 },
            ]
          : [
              { frequency: 880, duration: 0.1, offset: 0 },
              { frequency: 660, duration: 0.12, offset: 0.16 },
            ];

      notePattern.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(note.frequency, startAt + note.offset);

        gainNode.gain.setValueAtTime(0.0001, startAt + note.offset);
        gainNode.gain.exponentialRampToValueAtTime(0.18, startAt + note.offset + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(
          0.0001,
          startAt + note.offset + note.duration,
        );

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start(startAt + note.offset);
        oscillator.stop(startAt + note.offset + note.duration + 0.02);
      });
    },
  );

  const notify = useEffectEvent((title: string, body: string) => {
    if (!notificationsEnabled || typeof Notification === "undefined") {
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  });

  const handleTimerElapsed = useEffectEvent(async () => {
    const currentTimer = timerRef.current;

    if (!currentTimer || isTimerTransitioningRef.current) {
      return;
    }

    isTimerTransitioningRef.current = true;

    try {
      const nextCompletedCycles = Math.min(
        currentTimer.completedCycles + (currentTimer.phase === "work" ? 1 : 0),
        currentTimer.totalCycles,
      );
      const isFinalWorkCycle =
        currentTimer.phase === "work" &&
        nextCompletedCycles >= currentTimer.totalCycles;

      void playTimerSound(isFinalWorkCycle ? "complete" : "transition");

      if (currentTimer.phase === "work") {
        try {
          await apiRequest(`/api/tasks/${currentTimer.taskId}/plan`, {
            method: "PUT",
            body: JSON.stringify({
              routineId: currentTimer.routine.id,
              totalCycles: currentTimer.totalCycles,
              completedCycles: nextCompletedCycles,
            }),
          });

          await refreshDashboard();
        } catch (mutationError) {
          toast.error(
            mutationError instanceof Error
              ? mutationError.message
              : "Could not sync plan progress.",
          );
        }

        if (nextCompletedCycles >= currentTimer.totalCycles) {
          notify(
            "Pomodoro completed",
            `${currentTimer.taskTitle} reached its target cycles.`,
          );
          toast.success(
            `Task "${currentTimer.taskTitle}" completed all planned cycles.`,
          );
          setTimer((latestTimer) =>
            latestTimer
              ? {
                  ...latestTimer,
                  completedCycles: nextCompletedCycles,
                  phaseDurationSeconds: latestTimer.routine.workMinutes * 60,
                  phaseEndsAt: null,
                  remainingSeconds: latestTimer.routine.workMinutes * 60,
                  isRunning: false,
                }
              : null,
          );
          dispatch(setActiveTimerTaskId(null));
          return;
        }

        const shouldTakeLongRest =
          nextCompletedCycles % currentTimer.routine.cyclesBeforeLongRest === 0;
        const nextPhase = shouldTakeLongRest ? "long-rest" : "short-rest";

        setTimer(
          buildRunningTimerState({
            ...currentTimer,
            completedCycles: nextCompletedCycles,
            phase: nextPhase,
          }),
        );

        notify(
          shouldTakeLongRest ? "Long rest started" : "Short rest started",
          `${currentTimer.taskTitle} finished a work cycle.`,
        );
        toast.info(
          shouldTakeLongRest
            ? `Long rest started for "${currentTimer.taskTitle}".`
            : `Short rest started for "${currentTimer.taskTitle}".`,
        );

        return;
      }

      setTimer(
        buildRunningTimerState({
          ...currentTimer,
          phase: "work",
        }),
      );

      notify(
        "Work session started",
        `${currentTimer.taskTitle} is back in focus mode.`,
      );
      toast.info(`Work session resumed for "${currentTimer.taskTitle}".`);
    } finally {
      isTimerTransitioningRef.current = false;
    }
  });

  useEffect(() => {
    if (!timer?.isRunning) {
      return;
    }

    const remainingSeconds = getRemainingSeconds(timer);

    if (remainingSeconds <= 0) {
      void handleTimerElapsed();
      return;
    }

    const millisecondsUntilNextBoundary = timer.phaseEndsAt
      ? Math.max(50, Math.min(timer.phaseEndsAt - Date.now(), 1000))
      : 1000;

    const timeoutId = window.setTimeout(() => {
      setTimer((current) =>
        current
          ? {
              ...current,
              remainingSeconds: getRemainingSeconds(current),
            }
          : null,
      );
    }, millisecondsUntilNextBoundary);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [timer]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const handleVisibilityChange = () => {
      const currentTimer = timerRef.current;

      if (!currentTimer?.isRunning || document.hidden) {
        return;
      }

      const remainingSeconds = getRemainingSeconds(currentTimer);

      if (remainingSeconds <= 0) {
        void handleTimerElapsed();
        return;
      }

      setTimer((latestTimer) =>
        latestTimer
          ? {
              ...latestTimer,
              remainingSeconds,
            }
          : latestTimer,
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const filteredTasks = useMemo(() => {
    return data.tasks.filter((task) => {
      const searchMatch =
        deferredSearch.trim().length === 0 ||
        `${task.title} ${task.description ?? ""}`
          .toLowerCase()
          .includes(deferredSearch.trim().toLowerCase());

      const statusMatch = statusFilter === "ALL" || task.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [data.tasks, deferredSearch, statusFilter]);

  const taskStats = useMemo(() => {
    return {
      total: data.tasks.length,
      active: data.tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: data.tasks.filter((task) => task.status === "DONE").length,
    };
  }, [data.tasks]);

  const activeTimerTask =
    data.tasks.find((task) => task.id === activeTimerTaskId) ?? null;

  async function handleLogout() {
    await runMutation(async () => {
      await apiRequest<{ success: true }>("/api/auth/logout", {
        method: "POST",
        body: "{}",
      });
      startTransition(() => {
        router.push("/login");
        router.refresh();
      });
    });
  }

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await runMutation(async () => {
      await apiRequest<{ task: TaskDto }>("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority || null,
        }),
      });

      setNewTask({ title: "", description: "", priority: "" });
      await refreshDashboard("Task created.");
    });
  }

  async function handleTaskSave(taskId: string) {
    const draft = taskDrafts[taskId];

    await runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          status: draft.status,
          priority: draft.priority || null,
        }),
      });

      await refreshDashboard("Task updated.");
    });
  }

  async function handleTaskDelete(taskId: string) {
    await runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (activeTimerTaskId === taskId) {
        setTimer(null);
        dispatch(setActiveTimerTaskId(null));
      }

      await refreshDashboard("Task deleted.");
    });
  }

  async function handleNoteCreate(taskId: string) {
    const content = noteDrafts[taskId]?.trim();

    if (!content) {
      toast.error("Write a note before saving it.");
      return;
    }

    await runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/notes`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });

      setNoteDrafts((current) => ({ ...current, [taskId]: "" }));
      await refreshDashboard("Note added.");
    });
  }

  async function handleNoteDelete(taskId: string, noteId: string) {
    await runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/notes/${noteId}`, {
        method: "DELETE",
      });

      await refreshDashboard("Note deleted.");
    });
  }

  async function handlePlanSave(taskId: string) {
    const draft = planDrafts[taskId];

    await runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/plan`, {
        method: "PUT",
        body: JSON.stringify(draft),
      });

      await refreshDashboard("Pomodoro plan saved.");
    });
  }

  async function handlePlanDelete(taskId: string) {
    await runMutation(async () => {
      await apiRequest(`/api/tasks/${taskId}/plan`, {
        method: "DELETE",
      });

      if (activeTimerTaskId === taskId) {
        setTimer(null);
        dispatch(setActiveTimerTaskId(null));
      }

      await refreshDashboard("Pomodoro plan removed.");
    });
  }

  async function handleCreateRoutine(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await runMutation(async () => {
      await apiRequest(`/api/routines`, {
        method: "POST",
        body: JSON.stringify(newRoutine),
      });

      setNewRoutine({
        name: "",
        workMinutes: 25,
        shortRestMinutes: 5,
        longRestMinutes: 15,
        cyclesBeforeLongRest: 4,
      });
      await refreshDashboard("Routine created.");
    });
  }

  async function handleRoutineSave(routineId: string) {
    await runMutation(async () => {
      await apiRequest(`/api/routines/${routineId}`, {
        method: "PATCH",
        body: JSON.stringify(routineDrafts[routineId]),
      });

      await refreshDashboard("Routine updated.");
    });
  }

  async function handleRoutineDelete(routineId: string) {
    await runMutation(async () => {
      await apiRequest(`/api/routines/${routineId}`, {
        method: "DELETE",
      });

      await refreshDashboard("Routine deleted.");
    });
  }

  function cloneRoutineIntoForm(routine: RoutineDto) {
    setNewRoutine({
      name: `${routine.name} Copy`,
      workMinutes: routine.workMinutes,
      shortRestMinutes: routine.shortRestMinutes,
      longRestMinutes: routine.longRestMinutes,
      cyclesBeforeLongRest: routine.cyclesBeforeLongRest,
    });
    toast.info(`Routine "${routine.name}" copied into the creation form.`);
  }

  function handleNotificationToggle() {
    if (typeof Notification === "undefined") {
      toast.error("Browser notifications are not supported in this environment.");
      return;
    }

    if (!notificationsEnabled) {
      void Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          dispatch(setNotificationsEnabled(true));
          toast.success("Notifications enabled.");
          void ensureAudioContext();
          return;
        }

        toast.error("Notification permission was not granted.");
      });

      return;
    }

    dispatch(setNotificationsEnabled(false));
    toast.info("Notifications disabled.");
  }

  function handleTimerStart(task: TaskDto) {
    if (!task.pomodoroPlan) {
      toast.error("Attach a pomodoro plan before starting the timer.");
      return;
    }

    const { pomodoroPlan } = task;

    void ensureAudioContext();

    setTimer(
      buildRunningTimerState({
        taskId: task.id,
        taskTitle: task.title,
        routine: pomodoroPlan.routine,
        totalCycles: pomodoroPlan.totalCycles,
        completedCycles: pomodoroPlan.completedCycles,
        phase: "work",
      }),
    );

    dispatch(setActiveTimerTaskId(task.id));
    toast.success(`Timer started for "${task.title}".`);
  }

  function handleTimerPauseToggle() {
    if (!timer) {
      return;
    }

    const nextIsRunning = !timer.isRunning;

    if (nextIsRunning) {
      void ensureAudioContext();
    }

    setTimer((current) =>
      current
        ? {
            ...current,
            phaseEndsAt: nextIsRunning
              ? Date.now() + current.remainingSeconds * 1000
              : null,
            remainingSeconds: nextIsRunning
              ? current.remainingSeconds
              : getRemainingSeconds(current),
            isRunning: nextIsRunning,
          }
        : current,
    );

    if (timer) {
      toast.info(nextIsRunning ? "Timer resumed." : "Timer paused.");
    }
  }

  function handleTimerStop() {
    setTimer(null);
    dispatch(setActiveTimerTaskId(null));
    toast.info("Timer stopped.");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f1e7_0%,#f3eee4_35%,#eef2f7_100%)] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-4xl border border-slate-900/10 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full border border-slate-900/10 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
                Authenticated Workspace
              </span>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Control de tareas, pomodoros y foco en un solo panel.
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">
                  Tu sesión actual es <strong>{data.user.email}</strong>. Desde aquí
                  puedes crear tareas, asignar planes pomodoro, editar rutinas propias y
                  llevar notas operativas sin salir del flujo.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["Total tasks", taskStats.total.toString()],
                ["In progress", taskStats.active.toString()],
                ["Completed", taskStats.done.toString()],
                ["Routines", data.routines.length.toString()],
              ].map(([label, value]) => (
                <article
                  key={label}
                  className="rounded-3xl border border-slate-900/10 bg-slate-950 px-4 py-3 text-white"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.45fr]">
          <div className="space-y-6">
            <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Create Task</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Start with the core unit of work, then attach notes or a pomodoro
                    plan.
                  </p>
                </div>
              </div>

              <form className="mt-5 space-y-3" onSubmit={handleCreateTask}>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(event) =>
                    setNewTask((current) => ({ ...current, title: event.target.value }))
                  }
                  required
                />
                <textarea
                  className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                  placeholder="Short context, constraints, or expected result"
                  value={newTask.description}
                  onChange={(event) =>
                    setNewTask((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                  value={newTask.priority}
                  onChange={(event) =>
                    setNewTask((current) => ({
                      ...current,
                      priority: event.target.value,
                    }))
                  }
                >
                  <option value="">No priority</option>
                  {taskPriorityOptions.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                <button
                  className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-orange-300"
                  disabled={isPending}
                  type="submit"
                >
                  Create Task
                </button>
              </form>
            </section>

            <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Timer</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Run work and rest phases from any task that already has a plan.
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
                  onClick={handleNotificationToggle}
                  type="button"
                >
                  {notificationsEnabled ? "Disable Alerts" : "Enable Alerts"}
                </button>
              </div>

              <div className="mt-5 rounded-4xl bg-slate-950 p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Active Task
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {timer?.taskTitle ?? activeTimerTask?.title ?? "No timer running"}
                </h3>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Phase
                    </p>
                    <p className="mt-2 text-lg font-medium capitalize">
                      {timer?.phase ?? "idle"}
                    </p>
                  </div>
                  <p className="text-5xl font-semibold tracking-tight">
                    {formatSeconds(timer ? getRemainingSeconds(timer) : 0)}
                  </p>
                </div>
                <p className="mt-4 text-sm text-slate-300">
                  Completed cycles:{" "}
                  {timer?.completedCycles ??
                    activeTimerTask?.pomodoroPlan?.completedCycles ??
                    0}
                  {" / "}
                  {timer?.totalCycles ??
                    activeTimerTask?.pomodoroPlan?.totalCycles ??
                    0}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:bg-slate-400"
                    disabled={!timer}
                    onClick={handleTimerPauseToggle}
                    type="button"
                  >
                    {timer?.isRunning ? "Pause" : "Resume"}
                  </button>
                  <button
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                    disabled={!timer}
                    onClick={handleTimerStop}
                    type="button"
                  >
                    Stop
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
              <div>
                <h2 className="text-xl font-semibold">Create Routine</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Build private presets or clone a global one into your own space.
                </p>
              </div>

              <form
                className="mt-5 grid gap-3 sm:grid-cols-2"
                onSubmit={handleCreateRoutine}
              >
                <input
                  className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                  placeholder="Routine name"
                  value={newRoutine.name}
                  onChange={(event) =>
                    setNewRoutine((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  required
                />
                {[
                  ["workMinutes", "Work"],
                  ["shortRestMinutes", "Short rest"],
                  ["longRestMinutes", "Long rest"],
                  ["cyclesBeforeLongRest", "Cycles before long rest"],
                ].map(([key, label]) => (
                  <label key={key} className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </span>
                    <input
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                      min={1}
                      type="number"
                      value={newRoutine[key as keyof RoutineDraft]}
                      onChange={(event) =>
                        setNewRoutine((current) => ({
                          ...current,
                          [key]: Number(event.target.value),
                        }))
                      }
                    />
                  </label>
                ))}
                <button
                  className="sm:col-span-2 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  type="submit"
                >
                  Save Routine
                </button>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Tasks</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Edit details inline, attach plans, write notes, and start focus
                    sessions from each card.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                    placeholder="Search task"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <select
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value as
                          | "ALL"
                          | (typeof taskStatusOptions)[number],
                      )
                    }
                  >
                    <option value="ALL">All statuses</option>
                    {taskStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {filteredTasks.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-600">
                    No tasks match the current filter.
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const draft = taskDrafts[task.id];
                    const planDraft = planDrafts[task.id];

                    return (
                      <article
                        key={task.id}
                        className="rounded-4xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-col gap-4 xl:flex-row xl:justify-between">
                          <div className="flex-1 space-y-3">
                            <input
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-semibold outline-none focus:border-orange-500"
                              value={draft?.title ?? task.title}
                              onChange={(event) =>
                                setTaskDraft(task.id, "title", event.target.value)
                              }
                            />
                            <textarea
                              className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
                              value={draft?.description ?? task.description ?? ""}
                              onChange={(event) =>
                                setTaskDraft(task.id, "description", event.target.value)
                              }
                            />

                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                              <select
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
                                value={draft?.status ?? task.status}
                                onChange={(event) =>
                                  setTaskDraft(task.id, "status", event.target.value)
                                }
                              >
                                {taskStatusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>

                              <select
                                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
                                value={draft?.priority ?? task.priority ?? ""}
                                onChange={(event) =>
                                  setTaskDraft(task.id, "priority", event.target.value)
                                }
                              >
                                <option value="">No priority</option>
                                {taskPriorityOptions.map((priority) => (
                                  <option key={priority} value={priority}>
                                    {priority}
                                  </option>
                                ))}
                              </select>

                              <button
                                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                onClick={() => void handleTaskSave(task.id)}
                                type="button"
                              >
                                Save Task
                              </button>
                              <button
                                className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                                onClick={() => void handleTaskDelete(task.id)}
                                type="button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="w-full xl:max-w-sm">
                            <div className="rounded-3xl border border-slate-200 bg-white p-4">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    Pomodoro Plan
                                  </p>
                                  <p className="mt-1 text-sm text-slate-600">
                                    {task.pomodoroPlan
                                      ? `${task.pomodoroPlan.completedCycles}/${task.pomodoroPlan.totalCycles} cycles completed`
                                      : "No plan attached yet"}
                                  </p>
                                </div>
                                <button
                                  className="rounded-full bg-orange-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-orange-500"
                                  onClick={() => handleTimerStart(task)}
                                  type="button"
                                >
                                  Start
                                </button>
                              </div>

                              <div className="mt-4 space-y-3">
                                <select
                                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                                  value={planDraft?.routineId ?? ""}
                                  onChange={(event) =>
                                    setPlanDraft(
                                      task.id,
                                      "routineId",
                                      event.target.value,
                                    )
                                  }
                                >
                                  {data.routines.map((routine) => (
                                    <option key={routine.id} value={routine.id}>
                                      {routine.name}
                                      {routine.isGlobal ? " • global" : " • mine"}
                                    </option>
                                  ))}
                                </select>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <input
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                                    min={1}
                                    type="number"
                                    value={planDraft?.totalCycles ?? 4}
                                    onChange={(event) =>
                                      setPlanDraft(
                                        task.id,
                                        "totalCycles",
                                        event.target.value,
                                      )
                                    }
                                  />
                                  <input
                                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-500 focus:bg-white"
                                    min={0}
                                    type="number"
                                    value={planDraft?.completedCycles ?? 0}
                                    onChange={(event) =>
                                      setPlanDraft(
                                        task.id,
                                        "completedCycles",
                                        event.target.value,
                                      )
                                    }
                                  />
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <button
                                    className="rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
                                    onClick={() => void handlePlanSave(task.id)}
                                    type="button"
                                  >
                                    Save Plan
                                  </button>
                                  <button
                                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                    onClick={() => void handlePlanDelete(task.id)}
                                    type="button"
                                  >
                                    Remove Plan
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1fr]">
                          <section className="rounded-3xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
                                Notes
                              </h3>
                              <span className="text-xs text-slate-500">
                                {task.notes.length} items
                              </span>
                            </div>

                            <div className="mt-4 space-y-3">
                              {task.notes.map((note) => (
                                <article
                                  key={note.id}
                                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
                                >
                                  <p className="text-sm leading-6 text-slate-700">
                                    {note.content}
                                  </p>
                                  <div className="mt-3 flex items-center justify-between gap-3">
                                    <span className="text-xs text-slate-500">
                                      {new Date(note.createdAt).toLocaleString()}
                                    </span>
                                    <button
                                      className="text-xs font-semibold uppercase tracking-[0.12em] text-red-600"
                                      onClick={() =>
                                        void handleNoteDelete(task.id, note.id)
                                      }
                                      type="button"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </article>
                              ))}

                              <textarea
                                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500"
                                placeholder="Write a note linked to this task"
                                value={noteDrafts[task.id] ?? ""}
                                onChange={(event) =>
                                  setNoteDrafts((current) => ({
                                    ...current,
                                    [task.id]: event.target.value,
                                  }))
                                }
                              />
                              <button
                                className="w-full rounded-2xl border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                onClick={() => void handleNoteCreate(task.id)}
                                type="button"
                              >
                                Add Note
                              </button>
                            </div>
                          </section>

                          <section className="rounded-3xl border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">
                              Routine Summary
                            </h3>

                            {task.pomodoroPlan ? (
                              <div className="mt-4 space-y-3 text-sm text-slate-700">
                                <p>
                                  <strong>{task.pomodoroPlan.routine.name}</strong>
                                </p>
                                <p>
                                  Work {task.pomodoroPlan.routine.workMinutes}m, short
                                  rest {task.pomodoroPlan.routine.shortRestMinutes}m,
                                  long rest {task.pomodoroPlan.routine.longRestMinutes}
                                  m.
                                </p>
                                <p>
                                  Long rest every{" "}
                                  {task.pomodoroPlan.routine.cyclesBeforeLongRest}{" "}
                                  cycles.
                                </p>
                              </div>
                            ) : (
                              <p className="mt-4 text-sm text-slate-600">
                                This task still works as a plain todo. Attach a plan
                                when you want timeboxing.
                              </p>
                            )}
                          </section>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>

            <section className="rounded-4xl border border-slate-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Routines</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Global presets are read-only. Your own routines can be edited or
                    removed here.
                  </p>
                </div>
                <button
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-400 hover:text-orange-700"
                  onClick={() => void refreshDashboard("Dashboard refreshed.")}
                  type="button"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {data.routines.map((routine) => {
                  const draft = routineDrafts[routine.id];

                  return (
                    <article
                      key={routine.id}
                      className="rounded-4xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {routine.isGlobal ? "Global preset" : "My routine"}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold">{routine.name}</h3>
                        </div>
                        {routine.isGlobal ? (
                          <button
                            className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700 shadow-sm"
                            onClick={() => cloneRoutineIntoForm(routine)}
                            type="button"
                          >
                            Clone
                          </button>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {routineFieldConfigs.map(({ key, label, inputType }) => (
                          <label
                            key={key}
                            className={
                              key === "name" ? "space-y-2 sm:col-span-2" : "space-y-2"
                            }
                          >
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                              {label}
                            </span>
                            <input
                              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-500 disabled:bg-slate-100"
                              disabled={routine.isGlobal}
                              type={inputType}
                              value={
                                routine.isGlobal ? routine[key] : (draft?.[key] ?? "")
                              }
                              onChange={(event) =>
                                setRoutineDraft(routine.id, key, event.target.value)
                              }
                            />
                          </label>
                        ))}
                      </div>

                      {!routine.isGlobal ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <button
                            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                            onClick={() => void handleRoutineSave(routine.id)}
                            type="button"
                          >
                            Save
                          </button>
                          <button
                            className="rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                            onClick={() => void handleRoutineDelete(routine.id)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        </section>

        <section className="flex justify-end">
          <button
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={() => void handleLogout()}
            type="button"
          >
            Sign Out
          </button>
        </section>
      </div>
    </main>
  );
}
