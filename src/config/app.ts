export const moduleBlueprint = [
  {
    name: "Auth",
    description:
      "Registration, login, JWT validation, password hashing, and access control.",
  },
  {
    name: "Tasks",
    description: "Task CRUD, ownership, filtering, and status transitions.",
  },
  {
    name: "Pomodoro",
    description: "Reusable routines plus task-specific plans and progress tracking.",
  },
  {
    name: "Notes",
    description: "Task notes and future note-to-task conversion workflows.",
  },
  {
    name: "Timer",
    description:
      "Countdown execution, work/rest transitions, and notification orchestration.",
  },
] as const;

export const qualityChecklist = [
  "Thin route handlers and service-driven business logic.",
  "Typed Prisma schema with enums, timestamps, and clear ownership.",
  "Redux wired only for durable client-side state.",
  "ESLint, Prettier, Husky, and lint-staged enabled from day one.",
] as const;

export const appRoadmap = [
  {
    stage: "01",
    title: "Tooling and Config",
    summary: "Scripts, formatting, hooks, env strategy, and project conventions.",
  },
  {
    stage: "02",
    title: "Database Baseline",
    summary: "Prisma schema, migrations, generated client, and seeded global routines.",
  },
  {
    stage: "03",
    title: "Authentication",
    summary: "Registration, login, JWT utilities, and protected route flows.",
  },
  {
    stage: "04",
    title: "Core Features",
    summary: "Tasks, pomodoro plans, notes, timer logic, and notification handling.",
  },
] as const;
