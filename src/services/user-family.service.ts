import { sql } from "drizzle-orm";
import { db } from "@/db";
import { userFamilyInformation } from "@/db/schema";

export class UserFamilyService {
  async create(data: {
    userId: string;
    fatherName: string;
    motherName: string;
  }) {
    const [newFamilyInfo] = await db
      .insert(userFamilyInformation)
      .values(data)
      .returning();

    return newFamilyInfo;
  }

  async findByUserId(userId: string) {
    const [familyInfo] = await db
      .select()
      .from(userFamilyInformation)
      .where(sql`${userFamilyInformation.userId} = ${userId}::uuid`)
      .limit(1);

    return familyInfo ?? null;
  }

  async update(
    userId: string,
    data: {
      fatherName?: string;
      motherName?: string;
    }
  ) {
    const [updatedFamilyInfo] = await db
      .update(userFamilyInformation)
      .set(data)
      .where(sql`${userFamilyInformation.userId} = ${userId}::uuid`)
      .returning();

    return updatedFamilyInfo ?? null;
  }

  async delete(userId: string) {
    const [deletedFamilyInfo] = await db
      .delete(userFamilyInformation)
      .where(sql`${userFamilyInformation.userId} = ${userId}::uuid`)
      .returning();

    return deletedFamilyInfo ?? null;
  }
}

export const userFamilyService = new UserFamilyService();