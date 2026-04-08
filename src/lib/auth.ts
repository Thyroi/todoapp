import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cache } from "react";
import { prisma } from "@/src/lib/prisma";
import { getServerEnv } from "@/src/lib/env";
import { AppError } from "@/src/lib/errors/app-error";

const SESSION_COOKIE_NAME = "pomodoro_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

type SessionPayload = {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function signSessionToken(input: { id: string; email: string }) {
  const { JWT_SECRET } = getServerEnv();

  return jwt.sign({ sub: input.id, email: input.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifySessionToken(token: string) {
  try {
    return jwt.verify(token, getServerEnv().JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSessionCookie(token: string) {
  const cookieStore = await cookies();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export const getCurrentUser = cache(async () => {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  const payload = verifySessionToken(token);

  if (!payload?.sub) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
});

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AppError(
      "UNAUTHORIZED",
      "You must be signed in to access this resource.",
      401,
    );
  }

  return user;
}

export async function requirePageUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }
}
