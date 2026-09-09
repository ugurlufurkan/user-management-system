import { db } from "@/db";
import { account } from "@/db/schema";

async function testAccountCreate() {
  try {
    const [createdAccount] = await db
      .insert(account)
      .values({
        email: `test-${Date.now()}@example.com`,
        passwordHash: "test-hash",
      })
      .returning();

    console.log("✅ Account creation successful");
    console.log(createdAccount);
  } catch (error) {
    console.error("❌ Account creation failed");
    console.error(error);
    process.exitCode = 1;
  }
}

testAccountCreate();