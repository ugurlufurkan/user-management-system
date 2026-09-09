import { sql } from "drizzle-orm";
import { db } from "./index";

async function testConnection() {
  try {
    const result = await db.execute(sql`SELECT NOW()`);

    console.log("✅ PostgreSQL connection successful");
    console.log("Database time:", result.rows[0]);
  } catch (error) {
    console.error("❌ PostgreSQL connection failed");
    console.error(error);
    process.exitCode = 1;
  }
}

testConnection();