import "dotenv/config";
import { userService } from "@/services/user.service";

async function main() {
  const accountId = "02006656-efe5-4af9-8c7f-7dd7a1a4b93d";

  console.log("1. FIND USER BY ACCOUNT ID");

  const user = await userService.findByAccountId(accountId);

  if (!user) {
    throw new Error("User was not found by account id");
  }

  console.log("FOUND USER:", user);

  if (user.accountId !== accountId) {
    throw new Error("Returned user account id does not match");
  }

  console.log("\nUSER SERVICE TEST PASSED");
}

main().catch((error) => {
  console.error("\nUSER SERVICE TEST FAILED");
  console.error(error);
  process.exit(1);
});