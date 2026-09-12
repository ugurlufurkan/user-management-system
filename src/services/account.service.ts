import { sql } from "drizzle-orm";
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

  async findById(id: string) {
    const [accountRecord] = await db
      .select()
      .from(account)
      .where(sql`${account.id} = ${id}::uuid`);

    return accountRecord ?? null;
  }

  async update(
    id: string,
    data: {
      email?: string;
      passwordHash?: string;
    }
  ) {
    const [updatedAccount] = await db
      .update(account)
      .set(data)
      .where(sql`${account.id} = ${id}::uuid`)
      .returning();

    return updatedAccount ?? null;
  }

  async delete(id: string) {
    const [deletedAccount] = await db
      .delete(account)
      .where(sql`${account.id} = ${id}::uuid`)
      .returning();

    return deletedAccount ?? null;
  }
}

export const accountService = new AccountService();