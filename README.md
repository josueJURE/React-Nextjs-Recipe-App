This is a [Next.js](https://nextjs.org) project using Better Auth with PostgreSQL through `pg`.

## Database

Create a `.env` file from `.env.example` and set `DATABASE_URL` to a PostgreSQL connection string:

```bash
cp .env.example .env
```

For a local PostgreSQL database, the URL will look like this:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/betterauth_nextjs_postgres"
```

Apply the SQL schema:

```bash
npm run db:schema
```

The application database code lives in `src/lib/db.ts` and uses parameterized raw SQL commands through `pg`.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
