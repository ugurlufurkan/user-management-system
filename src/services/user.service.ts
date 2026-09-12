import { sql } from "drizzle-orm";
import { db } from "@/db";
import { user } from "@/db/schema";

export class UserService {
  async create(data: {
    accountId: string;
    firstName: string;
    lastName: string;
  }) {
    const [newUser] = await db
      .insert(user)
      .values({
        accountId: data.accountId,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      .returning();

    return newUser;
  }

  async findAll() {
    return db.select().from(user);
  }

  async findById(id: string) {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(sql`${user.id} = ${id}::uuid`);

    return userRecord ?? null;
  }

  async findByAccountId(accountId: string) {
    const [userRecord] = await db
      .select()
      .from(user)
      .where(sql`${user.accountId} = ${accountId}::uuid`)
      .limit(1);

    return userRecord ?? null;
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
    }
  ) {
    const [updatedUser] = await db
      .update(user)
      .set(data)
      .where(sql`${user.id} = ${id}::uuid`)
      .returning();

    return updatedUser ?? null;
  }

  async delete(id: string) {
    const [deletedUser] = await db
      .delete(user)
      .where(sql`${user.id} = ${id}::uuid`)
      .returning();

    return deletedUser ?? null;
  }
}

export const userService = new UserService();