import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({
  connectionString,
});

pool.on("error", (error) => {
  console.error("PostgreSQL pool error:", error);
});

export const db = drizzle({
  client: pool,
});