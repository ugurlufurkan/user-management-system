import "dotenv/config";
import { userService } from "@/services/user.service";

async function main() {
  const existingAccountId =
    "02006656-efe5-4af9-8c7f-7dd7a1a4b93d";

  const missingAccountId =
    "00000000-0000-0000-0000-000000000000";

  console.log("1. FIND USER WITH EXISTING ACCOUNT");

  const existingUser =
    await userService.findByAccountId(existingAccountId);

  if (!existingUser) {
    throw new Error(
      "Expected a user to be found for the existing account"
    );
  }

  console.log("FOUND USER:", existingUser);

  if (existingUser.accountId !== existingAccountId) {
    throw new Error(
      "User accountId does not match the requested accountId"
    );
  }

  console.log("\n2. FIND USER WITH MISSING ACCOUNT");

  const missingUser =
    await userService.findByAccountId(missingAccountId);

  if (missingUser !== null) {
    throw new Error(
      "Expected null for a missing accountId"
    );
  }

  console.log("MISSING ACCOUNT RESULT:", missingUser);

  console.log("\nUSER ACCOUNT RELATION TEST PASSED");
}

main().catch((error) => {
  console.error("\nUSER ACCOUNT RELATION TEST FAILED");
  console.error(error);
  process.exit(1);
});