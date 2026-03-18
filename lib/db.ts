import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const DEFAULT_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/trade_area_db";

type AppDatabase = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  __tradeAreaDb?: AppDatabase;
  __tradeAreaDbInitError?: Error | null;
};

let dbInitError: Error | null = globalForDb.__tradeAreaDbInitError ?? null;

function createUnavailableDb(error: Error): AppDatabase {
  const throwUnavailable = () => {
    throw new Error(
      `PostgreSQL is not available. Configure/install the database client and retry. Root cause: ${error.message}`,
    );
  };

  return new Proxy(
    {},
    {
      get() {
        return throwUnavailable;
      },
    },
  ) as AppDatabase;
}

function createDb(): AppDatabase {
  if (typeof window !== "undefined") {
    const error = new Error("Database client cannot be created in the browser.");
    dbInitError = error;
    globalForDb.__tradeAreaDbInitError = error;
    return createUnavailableDb(error);
  }

  const connectionString =
    process.env.DATABASE_URL?.trim() || DEFAULT_DATABASE_URL;

  try {
    const runtimeRequire = eval("require") as NodeJS.Require;
    const { Pool } = runtimeRequire("pg") as { Pool: new (...args: any[]) => any };

    const pool = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });

    pool.on("error", (error: Error) => {
      console.error("[DB] PostgreSQL pool error:", error);
      dbInitError = error;
      globalForDb.__tradeAreaDbInitError = error;
    });

    const database = drizzle(pool, { schema });
    dbInitError = null;
    globalForDb.__tradeAreaDbInitError = null;
    console.log("[DB] PostgreSQL database initialized:", connectionString);
    return database;
  } catch (error) {
    const normalizedError = error as Error;
    dbInitError = normalizedError;
    globalForDb.__tradeAreaDbInitError = normalizedError;
    console.error("[DB] PostgreSQL initialization error:", error);
    return createUnavailableDb(normalizedError);
  }
}

export const db: AppDatabase = globalForDb.__tradeAreaDb ?? createDb();

globalForDb.__tradeAreaDb = db;

export async function testConnection() {
  try {
    await db.execute(sql`select 1`);
    console.log("[DB] PostgreSQL connection test successful");
    return true;
  } catch (error) {
    console.error("[DB] PostgreSQL connection test failed:", error);
    dbInitError = error as Error;
    globalForDb.__tradeAreaDbInitError = dbInitError;
    return false;
  }
}

export function isDBInitialized() {
  return dbInitError === null;
}

export { DEFAULT_DATABASE_URL };
