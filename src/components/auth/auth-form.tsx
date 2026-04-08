"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  getPasswordRuleChecks,
  isValidEmailAddress,
  passwordMinLength,
} from "@/src/modules/auth/auth.rules";

type AuthFormProps = {
  mode: "login" | "register";
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    message?: string;
    details?: {
      fieldErrors?: Record<string, string[]>;
      formErrors?: string[];
    };
  };
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordTooltipVisible, setIsPasswordTooltipVisible] = useState(false);
  const [isPasswordFieldFocused, setIsPasswordFieldFocused] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLogin = mode === "login";
  const passwordChecks = getPasswordRuleChecks(password);

  function validateEmail(value: string) {
    if (!value.trim()) {
      return "Email is required.";
    }

    if (!isValidEmailAddress(value)) {
      return "Enter a valid email address.";
    }

    return null;
  }

  function validatePassword(value: string) {
    if (!value) {
      return "Password is required.";
    }

    if (isLogin) {
      return null;
    }

    const failedChecks = getPasswordRuleChecks(value).filter((rule) => !rule.passed);

    if (failedChecks.length === 0) {
      return null;
    }

    if (value.length < passwordMinLength) {
      return `Password must be at least ${passwordMinLength} characters.`;
    }

    return "Password does not meet the minimum security requirements.";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const nextEmailError = validateEmail(email);
    const nextPasswordError = validatePassword(password);

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      return;
    }

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = (await response.json()) as ApiResponse<{ user: { id: string } }>;

    if (!response.ok || !payload.success) {
      setEmailError(payload.error?.details?.fieldErrors?.email?.[0] ?? null);
      setPasswordError(payload.error?.details?.fieldErrors?.password?.[0] ?? null);
      setError(payload.error?.message ?? "The request could not be completed.");
      return;
    }

    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(255,248,235,0.95),rgba(244,114,46,0.22),rgba(15,23,42,0.08))] px-6 py-10 text-slate-950 sm:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700">
            Pomodoro Task Manager
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Entra a una app enfocada en ejecutar tareas con una estructura real de
              pomodoro.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              La sesión vive en cookie segura, el acceso está protegido, y el panel te
              deja operar tareas, planes, rutinas y notas desde el mismo flujo.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Sesión real", "JWT en cookie HttpOnly para proteger acceso y datos."],
              [
                "Tareas operables",
                "CRUD con estado, prioridad, notas y plan pomodoro.",
              ],
              [
                "Rutinas reutilizables",
                "Presets globales y rutinas personales editables.",
              ],
            ].map(([title, copy]) => (
              <article
                key={title}
                className="rounded-3xl border border-slate-900/10 bg-white/70 p-4 shadow-sm backdrop-blur"
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-orange-700">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-700">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-4xl border border-slate-900/10 bg-white/90 p-6 shadow-[0_25px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">
              {isLogin ? "Sign In" : "Create Account"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-950">
              {isLogin ? "Accede a tu workspace" : "Abre tu workspace personal"}
            </h2>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                className={`w-full rounded-2xl border px-4 py-3 text-base outline-none transition focus:bg-white ${
                  emailError
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-slate-200 bg-slate-50 focus:border-orange-500"
                }`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setEmail(nextValue);
                  setEmailError(validateEmail(nextValue));
                }}
                placeholder="you@example.com"
                required
              />
              {emailError ? <p className="text-sm text-red-700">{emailError}</p> : null}
            </label>

            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span>Password</span>
                {!isLogin ? (
                  <span className="inline-flex">
                    <button
                      aria-expanded={isPasswordTooltipVisible || isPasswordFieldFocused}
                      aria-label="Show password requirements"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-600 transition hover:border-orange-400 hover:text-orange-700"
                      onBlur={() => {
                        setTimeout(() => {
                          if (!isPasswordFieldFocused) {
                            setIsPasswordTooltipVisible(false);
                          }
                        }, 100);
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        setIsPasswordTooltipVisible((current) => !current);
                      }}
                      onMouseEnter={() => setIsPasswordTooltipVisible(true)}
                      onMouseLeave={() => setIsPasswordTooltipVisible(false)}
                      type="button"
                    >
                      i
                    </button>
                  </span>
                ) : null}
              </span>
              <div className="relative">
                <input
                  className={`w-full rounded-2xl border px-4 py-3 text-base outline-none transition focus:bg-white ${
                    passwordError
                      ? "border-red-300 bg-red-50 focus:border-red-400"
                      : "border-slate-200 bg-slate-50 focus:border-orange-500"
                  }`}
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onBlur={() => {
                    setIsPasswordFieldFocused(false);
                    setIsPasswordTooltipVisible(false);
                  }}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setPassword(nextValue);
                    setPasswordError(validatePassword(nextValue));
                  }}
                  onFocus={() => {
                    if (!isLogin) {
                      setIsPasswordFieldFocused(true);
                      setIsPasswordTooltipVisible(true);
                    }
                  }}
                  placeholder={isLogin ? "Your password" : "At least 8 characters"}
                  minLength={8}
                  required
                />

                {!isLogin && (isPasswordTooltipVisible || isPasswordFieldFocused) ? (
                  <div className="absolute left-0 top-[calc(100%+0.6rem)] z-20 w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.14)] sm:w-80">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Password requirements
                    </p>
                    <ul className="mt-3 space-y-2">
                      {passwordChecks.map((rule) => (
                        <li key={rule.id} className="flex items-center gap-3 text-sm">
                          <span
                            className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold ${
                              rule.passed
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-slate-300 bg-slate-200 text-slate-500"
                            }`}
                          >
                            {rule.passed ? "✓" : "•"}
                          </span>
                          <span
                            className={
                              rule.passed ? "text-emerald-700" : "text-slate-600"
                            }
                          >
                            {rule.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {passwordError ? (
                <p className="text-sm text-red-700">{passwordError}</p>
              ) : null}
            </label>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isPending}
              type="submit"
            >
              {isPending ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-700">
            {isLogin ? "Need an account?" : "Already have an account?"}{" "}
            <Link
              className="font-semibold text-orange-700 hover:text-orange-600"
              href={isLogin ? "/register" : "/login"}
            >
              {isLogin ? "Register" : "Sign in"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
