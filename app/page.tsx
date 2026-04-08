import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fbf6ef_0%,#f4e8d6_42%,#eef3f8_100%)] px-6 py-8 sm:px-10 lg:px-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.10),transparent_35%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col gap-8">
        <section className="grid flex-1 gap-8 rounded-4xl border border-slate-900/10 bg-white/75 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
          <div className="flex flex-col justify-between gap-10">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-slate-900/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-700">
                Fullstack Focus System
              </span>
              <div className="space-y-5">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Ejecuta tareas reales con auth, pomodoros, notas y control del flujo
                  completo.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
                  Esta versión ya no es solo scaffold. Tienes autenticación, panel
                  privado, CRUD operativo de tareas, presets globales, rutinas propias y
                  timer cliente con sincronización del plan.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  href="/register"
                >
                  Create Account
                </Link>
                <Link
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-orange-400 hover:text-orange-700"
                  href="/login"
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                [
                  "Auth + session",
                  "JWT en cookie HttpOnly para proteger acceso y panel privado.",
                ],
                [
                  "Task execution",
                  "Cada tarea puede llevar prioridad, notas y un plan pomodoro opcional.",
                ],
                [
                  "Actionable timer",
                  "El contador corre en cliente y sincroniza ciclos completados.",
                ],
              ].map(([title, copy]) => (
                <article
                  key={title}
                  className="rounded-3xl border border-slate-900/10 bg-white px-4 py-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
                    {title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-4xl bg-slate-950 p-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                What is inside
              </p>
              <h2 className="mt-3 text-2xl font-semibold">
                MVP funcional para recorrer, revisar y endurecer.
              </h2>
            </div>
            <div className="grid gap-3">
              {[
                "Registro e inicio de sesión",
                "Dashboard protegido por sesión",
                "CRUD de tareas con estado y prioridad",
                "Notas ligadas a tareas",
                "Rutinas globales y personales",
                "Plan pomodoro por tarea",
                "Timer cliente con pausa, reanudación y sync",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
