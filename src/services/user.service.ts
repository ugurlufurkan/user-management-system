import { sql, eq } from "drizzle-orm"; // eq (eşittir) komutunu tabloları bağlamak için ekledik
import { db } from "@/db";
import { user, section } from "@/db/schema"; // section tablosunu da çağırıyoruz

export class UserService {
  async create(data: {
    accountId: string;
    firstName: string;
    lastName: string;
    sectionId?: string; // Opsiyonel olarak eklendi
  }) {
    const [newUser] = await db
      .insert(user)
      .values({
        accountId: data.accountId,
        firstName: data.firstName,
        lastName: data.lastName,
        sectionId: data.sectionId || null,
      })
      .returning();

    return newUser;
  }

  // Tüm kullanıcıları çekerken "LEFT JOIN" ile bağlı oldukları departman adını da getiriyoruz!
  async findAll() {
    const users = await db
      .select({
        id: user.id,
        accountId: user.accountId,
        firstName: user.firstName,
        lastName: user.lastName,
        sectionId: user.sectionId,
        createdAt: user.createdAt,
        // Departman tablosundan sadece ismini alıp "sectionName" diye bir değişkene atıyoruz
        sectionName: section.name 
      })
      .from(user)
      .leftJoin(section, eq(user.sectionId, section.id)); // Kullanıcının sectionId'si ile Bölümün id'si eşleşiyorsa bağla
      
    return users;
  }

  async findById(id: string) {
    const [userRecord] = await db
      .select({
        id: user.id,
        accountId: user.accountId,
        firstName: user.firstName,
        lastName: user.lastName,
        sectionId: user.sectionId,
        createdAt: user.createdAt,
        sectionName: section.name 
      })
      .from(user)
      .leftJoin(section, eq(user.sectionId, section.id))
      .where(sql`${user.id} = ${id}::uuid`);

    return userRecord ?? null;
  }

  async findByAccountId(accountId: string) {
    const [userRecord] = await db
      .select({
        id: user.id,
        accountId: user.accountId,
        firstName: user.firstName,
        lastName: user.lastName,
        sectionId: user.sectionId,
        createdAt: user.createdAt,
        sectionName: section.name 
      })
      .from(user)
      .leftJoin(section, eq(user.sectionId, section.id))
      .where(sql`${user.accountId} = ${accountId}::uuid`)
      .limit(1);

    return userRecord ?? null;
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      sectionId?: string | null; // Departman ataması (veya null ile silinmesi) için eklendi
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