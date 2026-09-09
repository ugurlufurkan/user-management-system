import { sql } from "drizzle-orm";
import { db } from "./index";

async function verifyDatabase() {
  try {
    const result = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('account', 'section', 'user')
      ORDER BY table_name;
    `);

    const tables = result.rows.map((row) => row.table_name);

    const requiredTables = ["account", "section", "user"];
    const missingTables = requiredTables.filter(
      (table) => !tables.includes(table)
    );

    if (missingTables.length > 0) {
      throw new Error(
        `Missing database tables: ${missingTables.join(", ")}`
      );
    }

    console.log("✅ Database migration verification successful");
    console.log("Verified tables:", tables.join(", "));
  } catch (error) {
    console.error("❌ Database migration verification failed");
    console.error(error);
    process.exitCode = 1;
  }
}

verifyDatabase();