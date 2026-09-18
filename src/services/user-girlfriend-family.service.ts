import { sql } from "drizzle-orm";
import { db } from "@/db";
import { userGirlfriendFamilyInformation } from "@/db/schema";

export class UserGirlfriendFamilyService {
  async create(data: {
    girlfriendId: string;
    fatherName: string;
    motherName: string;
    siblingCount?: number;
  }) {
    const [newGfFamilyInfo] = await db
      .insert(userGirlfriendFamilyInformation)
      .values(data)
      .returning();

    return newGfFamilyInfo;
  }

  async findByGirlfriendId(girlfriendId: string) {
    const [gfFamilyInfo] = await db
      .select()
      .from(userGirlfriendFamilyInformation)
      .where(sql`${userGirlfriendFamilyInformation.girlfriendId} = ${girlfriendId}::uuid`)
      .limit(1);

    return gfFamilyInfo ?? null;
  }

  async update(
    girlfriendId: string,
    data: {
      fatherName?: string;
      motherName?: string;
      siblingCount?: number;
    }
  ) {
    const [updatedFamilyInfo] = await db
      .update(userGirlfriendFamilyInformation)
      .set(data)
      .where(sql`${userGirlfriendFamilyInformation.girlfriendId} = ${girlfriendId}::uuid`)
      .returning();

    return updatedFamilyInfo ?? null;
  }

  async delete(girlfriendId: string) {
    const [deletedFamilyInfo] = await db
      .delete(userGirlfriendFamilyInformation)
      .where(sql`${userGirlfriendFamilyInformation.girlfriendId} = ${girlfriendId}::uuid`)
      .returning();

    return deletedFamilyInfo ?? null;
  }
}

export const userGirlfriendFamilyService = new UserGirlfriendFamilyService();