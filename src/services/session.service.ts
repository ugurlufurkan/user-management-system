import { sql } from "drizzle-orm";
import { db } from "@/db";
import { session, account, user } from "@/db/schema";

export class SessionService {
  async create(data: {
    accountId: string;
    token: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    const [newSession] = await db
      .insert(session)
      .values(data)
      .returning();

    return newSession;
  }

  async findByToken(token: string) {
    const [activeSession] = await db
      .select()
      .from(session)
      .where(sql`${session.token} = ${token} AND ${session.expiresAt} > NOW()`)
      .limit(1);

    return activeSession ?? null;
  }

  async findActiveByAccountId(accountId: string) {
    return db
      .select()
      .from(session)
      .where(sql`${session.accountId} = ${accountId}::uuid AND ${session.expiresAt} > NOW()`)
      .orderBy(sql`${session.createdAt} DESC`);
  }

  async delete(id: string) {
    const [deletedSession] = await db
      .delete(session)
      .where(sql`${session.id} = ${id}::uuid`)
      .returning();

    return deletedSession ?? null;
  }
  
  async revokeByToken(token: string) {
    const [revokedSession] = await db
      .delete(session)
      .where(sql`${session.token} = ${token}`)
      .returning();
      
    return revokedSession ?? null;
  }

  // --- YENİ EKLENEN SİSTEM: Yetki ve Kimlik Kontrolü ---
  // Sadece oturumu değil, kişinin yetkisini (role) ve adını soyadını da aynı anda getirir.
  async getAuthUserByToken(token: string) {
    const [result] = await db
      .select({
        accountId: session.accountId,
        role: account.role,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .from(session)
      .innerJoin(account, sql`${session.accountId} = ${account.id}`)
      .innerJoin(user, sql`${account.id} = ${user.accountId}`)
      .where(sql`${session.token} = ${token} AND ${session.expiresAt} > NOW()`)
      .limit(1);

    return result ?? null;
  }
}

export const sessionService = new SessionService();