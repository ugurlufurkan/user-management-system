import { db } from "@/db";
import { account } from "@/db/schema";

export class AccountService {
  async create(data: {
    email: string;
    passwordHash: string;
  }) {
    const [newAccount] = await db
      .insert(account)
      .values({
        email: data.email,
        passwordHash: data.passwordHash,
      })
      .returning();

    return newAccount;
  }
}

export const accountService = new AccountService();