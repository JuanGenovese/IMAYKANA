import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { pool: Pool };

const connectionString =
  process.env.NEXT_PUBLIC_ENTORNO === 'local'
    ? process.env.DATABASE_LOCAL_URL
    : process.env.DATABASE_PROD_URL;


const pool =
  globalForDb.pool ??
  new Pool({
    connectionString,
    ssl: connectionString?.includes("supabase")
      ? { rejectUnauthorized: false }
      : false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
