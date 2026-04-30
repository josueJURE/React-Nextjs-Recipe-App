import { Pool, type QueryResultRow } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool;
};

const db =
  globalForPg.pgPool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = db;
}

export async function sql<T extends QueryResultRow>(
  text: string,
  values: unknown[] = []
) {
  return db.query<T>(text, values);
}

export default db;
