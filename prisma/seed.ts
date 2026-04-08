import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const routines = [
  {
    name: "Classic 25/5",
    workMinutes: 25,
    shortRestMinutes: 5,
    longRestMinutes: 15,
    cyclesBeforeLongRest: 4,
  },
  {
    name: "Deep Focus 50/10",
    workMinutes: 50,
    shortRestMinutes: 10,
    longRestMinutes: 20,
    cyclesBeforeLongRest: 4,
  },
  {
    name: "Quick Sprint 15/3",
    workMinutes: 15,
    shortRestMinutes: 3,
    longRestMinutes: 10,
    cyclesBeforeLongRest: 4,
  },
] as const;

async function main() {
  for (const routine of routines) {
    const existingRoutine = await prisma.pomodoroRoutine.findFirst({
      where: {
        name: routine.name,
        userId: null,
      },
    });

    if (existingRoutine) {
      await prisma.pomodoroRoutine.update({
        where: { id: existingRoutine.id },
        data: routine,
      });
      continue;
    }

    await prisma.pomodoroRoutine.create({
      data: { ...routine, userId: null },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
