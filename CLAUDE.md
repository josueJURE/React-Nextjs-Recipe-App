# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 16 application with Better Auth authentication and Prisma ORM connected to PostgreSQL. The app uses email/password authentication with a custom-configured Prisma setup.

## Common Commands

### Development
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database (Prisma)
- `npx prisma generate` - Generate Prisma Client (outputs to `src/generated/prisma`)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma migrate deploy` - Apply migrations in production
- `npx prisma db push` - Push schema changes without migrations (for prototyping)
- `npx prisma studio` - Open Prisma Studio GUI

## Architecture

### Authentication (Better Auth)

Better Auth is configured at `src/lib/auth.ts` with:
- Prisma adapter connected to PostgreSQL via `@prisma/adapter-pg`
- Email/password authentication enabled
- Trusted origin: http://localhost:3000 (production URL: https://recipe-app-nextjs-version.onrender.com)

Auth API routes are handled via catch-all route at `src/app/api/auth/[...all]/route.ts` using Better Auth's Next.js handler.

Client-side auth functions (signIn, signUp, signOut, useSession) are exported from `src/lib/auth-client.ts`.

### Database (Prisma)

**Critical: Prisma Client outputs to custom path `src/generated/prisma`** (not default `node_modules/.prisma`).

Prisma setup:
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Connection: Uses `@prisma/adapter-pg` adapter for PostgreSQL
- Client initialization: `src/lib/prisma.ts` (singleton pattern with development caching)

Database models:
- User (id, name, email, emailVerified, image, timestamps)
- Session (id, token, expiresAt, ipAddress, userAgent, userId)
- Account (id, accountId, providerId, userId, OAuth tokens, password)
- Verification (id, identifier, value, expiresAt)

**After schema changes, always run `npx prisma generate` to regenerate the client at `src/generated/prisma`.**

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/[...all]/  # Better Auth API routes
│   ├── sign-in/            # Sign-in page
│   ├── sign-up/            # Sign-up page
│   ├── dashboard/          # Protected dashboard
│   └── recipe-ui/          # Recipe UI page
├── components/
│   ├── ui/                 # Reusable UI components (shadcn-style)
│   └── [feature].tsx       # Feature-specific components
├── lib/
│   ├── auth.ts             # Better Auth server config
│   ├── auth-client.ts      # Better Auth client exports
│   ├── prisma.ts           # Prisma client singleton
│   ├── utils.ts            # Utility functions (cn, etc.)
│   └── validation-schemas.tsx  # Zod schemas for forms
└── generated/prisma/       # Generated Prisma Client (DO NOT edit)
```

### Key Configurations

- TypeScript path alias: `@/*` maps to `./src/*`
- Strict TypeScript mode enabled
- JSX runtime: react-jsx
- Environment variables required: `DATABASE_URL` (PostgreSQL connection string)

### UI Components

Uses shadcn/ui-style components with:
- Tailwind CSS (v4) with TailwindCSS PostCSS
- Radix UI primitives
- class-variance-authority for variant styling
- lucide-react for icons
- sonner for toast notifications

Form handling:
- react-hook-form for form state
- @hookform/resolvers with Zod validation
- Validation schemas in `src/lib/validation-schemas.tsx`

## Important Notes

1. **Prisma Client Import**: Always import from `@/generated/prisma/client`, not `@prisma/client`
2. **Auth Session**: Use `useSession()` from `@/lib/auth-client` for client components
3. **Database Changes**: After modifying `prisma/schema.prisma`, run `npx prisma generate` then `npx prisma migrate dev`
4. **Protected Routes**: Implement auth checks using Better Auth's `useSession()` hook with redirect logic
5. **Environment**: Production deployment is configured for https://recipe-app-nextjs-version.onrender.com
