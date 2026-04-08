# Pomodoro Task Manager

Portfolio-level fullstack application built with Next.js, TypeScript, Redux Toolkit, Prisma, PostgreSQL, JWT, and bcrypt.

## Current Scope

This application currently includes:

- registration and login with JWT session cookies
- protected dashboard flow
- task CRUD with status and priority
- task notes
- global and user-defined pomodoro routines
- one pomodoro plan per task in MVP
- client-side pomodoro timer with plan progress sync
- Prisma 7 configuration and PostgreSQL-ready data model
- linting, formatting, Husky, and lint-staged

## Architecture

Feature modules live under `src/modules`:

- `auth`
- `tasks`
- `pomodoro`
- `notes`
- `timer`

Shared infrastructure lives under:

- `src/lib`
- `src/store`
- `src/components`
- `src/config`

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm run type-check
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run prisma:seed
npm run db:setup
```

## Environment

Create your local environment from `.env.example`.

Required variables:

- `DATABASE_URL`
- `JWT_SECRET`

## Database Workflow

1. Configure `DATABASE_URL`
2. Run `npx prisma db push` or `npm run prisma:migrate`
3. Run `npm run prisma:seed`

## Notes

- Global pomodoro routines are represented by `userId = null`
- User-defined routines always have a non-null `userId`
- Each task can optionally have one pomodoro plan in MVP
- Session history is intentionally deferred until after the first functional version
