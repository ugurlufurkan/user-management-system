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

  async findAll() {
    return db.select().from(account);
  }
}

export const accountService = new AccountService();