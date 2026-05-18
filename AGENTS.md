# AGENTS.md

Instructions for AI coding agents working in this repository.

## Project Snapshot

This is a Next.js 16 App Router application using React 19, TypeScript, Tailwind CSS v4, Better Auth, PostgreSQL via `pg`, and OpenAI-powered recipe features.

Despite the repository name and some older docs, the current database layer is not Prisma. The live app uses raw SQL through `pg` in `src/lib/db.ts`, with schema setup in `db/schema.sql`.

## Common Commands

Use npm by default. Both `package-lock.json` and `yarn.lock` exist, but the README and scripts are npm-oriented. Do not regenerate both lockfiles for routine changes.

- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Run lint: `npm run lint`
- Apply database schema: `npm run db:schema`
- Start production server after build: `npm start`

There is currently no test script configured in `package.json`. For code changes, run the smallest relevant verification available, usually `npm run lint` and, for broader changes, `npm run build`.

## Environment

Create local env values from `.env.example`. Never commit real secrets from `.env`.

Important variables:

- `DATABASE_URL` for PostgreSQL
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- email settings: `third_party_app_password`, `from`, `to`, `service`

Development behavior may intentionally avoid external AI calls. For example, `src/app/api/user/country-post-request/route.ts` streams a mock recipe when `NODE_ENV` is not production.

## Project Structure

- `src/app/` contains App Router pages and route handlers.
- `src/app/api/auth/[...all]/route.ts` exposes Better Auth handlers.
- `src/app/api/user/*/route.ts` contains user-facing API routes for recipes, countries, reset flows, audio, image, and email.
- `src/components/` contains app components.
- `src/components/ui/` contains shadcn-style reusable UI primitives.
- `src/lib/auth.ts` configures Better Auth on the server.
- `src/lib/auth-client.ts` exports client auth helpers.
- `src/lib/db.ts` creates the shared PostgreSQL pool and exports `sql`.
- `src/lib/validations/user-choices.ts` contains Zod schemas and inferred types.
- `src/lib/chat-completions/openai.ts` wraps OpenAI chat, image, audio, and image-to-text calls.
- `src/lib/sendEmail/sendEmail.ts` wraps Nodemailer.
- `src/lib/queries/recipes.ts` contains client-side fetch helpers.
- `db/schema.sql` is the database schema source.

The TypeScript path alias `@/*` maps to both `./src/*` and `./*`. Prefer imports from `@/src-path` style already used in the app, such as `@/lib/db` and `@/components/ui/button`.

## Database Rules

Use `src/lib/db.ts` for database access.

- Import `sql` from `@/lib/db`.
- Always use parameterized queries with `$1`, `$2`, etc.
- Never interpolate user input directly into SQL strings.
- Keep schema changes in `db/schema.sql`.
- After changing schema, mention that `npm run db:schema` needs to be run against the target database.
- Do not introduce Prisma files, migrations, or generated clients unless the user explicitly asks to migrate back to Prisma.

Main tables currently include:

- `user`
- `session`
- `account`
- `verification`
- `user_preferences`
- `recipe`
- `visitedCountries`

## Auth Rules

Server-side auth is configured in `src/lib/auth.ts`.

For protected route handlers, use the existing pattern:

```ts
const session = await auth.api.getSession({
  headers: await headers(),
});
```

Return `401` JSON responses when there is no session. Use `session.user.id` for user-scoped database queries.

Client components should import auth helpers from `@/lib/auth-client`:

```ts
import { signIn, signUp, signOut, useSession } from "@/lib/auth-client";
```

Better Auth currently supports email/password and Google OAuth. Keep auth route changes consistent with `src/app/api/auth/[...all]/route.ts`.

## API Route Conventions

Route handlers live under `src/app/api/**/route.ts`.

- Use `NextResponse.json(...)` for JSON responses.
- Validate request bodies with Zod schemas from `src/lib/validations/user-choices.ts`.
- Return `400` for validation failures, `401` for unauthenticated users, `404` when a user-scoped record is missing, and `500` for unexpected failures.
- Keep database operations scoped to the authenticated user whenever user data is involved.
- Avoid logging secrets, tokens, full env values, or sensitive request payloads.

## Frontend Conventions

- Use App Router conventions.
- Add `"use client"` only when a component needs client-side state, effects, browser APIs, or client auth hooks.
- Prefer existing UI primitives from `src/components/ui/`.
- Use `cn` from `@/lib/utils` for class composition.
- Keep Tailwind styling consistent with the current shadcn-style setup in `src/app/globals.css`.
- Use `sonner` for toasts where the app already uses toast feedback.
- Use `lucide-react` icons when adding new icon buttons or simple UI icons.

## OpenAI, Email, And External Services

OpenAI helpers live in `src/lib/chat-completions/openai.ts`. Do not call OpenAI directly from route handlers unless there is a clear reason to bypass the helper.

Nodemailer setup lives in `src/lib/sendEmail/sendEmail.ts`. Keep email credentials in environment variables only.

When changing code that depends on external services, preserve development-friendly behavior where possible so the app can run locally without spending tokens or requiring live email delivery.

## TypeScript And Validation

- TypeScript strict mode is enabled.
- Prefer explicit domain types from Zod inference when a schema already exists.
- Add or update Zod schemas for new request payloads.
- Avoid `any` unless there is a narrow interoperability reason.
- Keep client/server boundaries clear; do not import server-only modules like `@/lib/db` into client components.

## Change Discipline

- Keep changes scoped to the user’s request.
- Do not rewrite unrelated components, formatting, or database structure.
- Do not edit generated/build output such as `.next/`, `node_modules/`, or `tsconfig.tsbuildinfo`.
- Do not modify `.env` unless the user explicitly asks.
- Be careful with the existing dirty worktree; preserve user changes.
- If older documentation conflicts with current source files, trust the source files and update docs when helpful.

## Verification Checklist

Before finishing, run or recommend the most relevant checks:

- UI or component changes: `npm run lint`
- API, auth, or database changes: `npm run lint` and consider `npm run build`
- Schema changes: ensure `db/schema.sql` is updated and call out `npm run db:schema`
- Broad refactors: `npm run build`

If a check cannot be run because env vars, database access, or external services are unavailable, say so clearly in the final response.
