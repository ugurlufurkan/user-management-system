import { sql } from "drizzle-orm";
import { db } from "@/db";
import { userGirlfriendInformation } from "@/db/schema";

export class UserGirlfriendService {
  async create(data: {
    userId: string;
    firstName: string;
    lastName: string;
  }) {
    const [newGirlfriendInfo] = await db
      .insert(userGirlfriendInformation)
      .values(data)
      .returning();

    return newGirlfriendInfo;
  }

  async findByUserId(userId: string) {
    const [girlfriendInfo] = await db
      .select()
      .from(userGirlfriendInformation)
      .where(sql`${userGirlfriendInformation.userId} = ${userId}::uuid`)
      .limit(1);

    return girlfriendInfo ?? null;
  }

  async update(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
    }
  ) {
    const [updatedGirlfriendInfo] = await db
      .update(userGirlfriendInformation)
      .set(data)
      .where(sql`${userGirlfriendInformation.userId} = ${userId}::uuid`)
      .returning();

    return updatedGirlfriendInfo ?? null;
  }

  async delete(userId: string) {
    const [deletedGirlfriendInfo] = await db
      .delete(userGirlfriendInformation)
      .where(sql`${userGirlfriendInformation.userId} = ${userId}::uuid`)
      .returning();

    return deletedGirlfriendInfo ?? null;
  }
}

export const userGirlfriendService = new UserGirlfriendService();