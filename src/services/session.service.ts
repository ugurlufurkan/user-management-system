import { sql, eq, and, gt } from "drizzle-orm";
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
      .where(
        and(
          eq(session.token, token),
          gt(session.expiresAt, new Date())
        )
      )
      .limit(1);

    return activeSession ?? null;
  }

  async findActiveByAccountId(accountId: string) {
    return db
      .select()
      .from(session)
      .where(
        and(
          eq(session.accountId, accountId),
          gt(session.expiresAt, new Date())
        )
      )
      .orderBy(sql`${session.createdAt} DESC`);
  }

  async delete(id: string) {
    const [deletedSession] = await db
      .delete(session)
      .where(eq(session.id, id))
      .returning();

    return deletedSession ?? null;
  }
  
  async revokeByToken(token: string) {
    const [revokedSession] = await db
      .delete(session)
      .where(eq(session.token, token))
      .returning();
      
    return revokedSession ?? null;
  }

  // --- YENİ EKLENEN SİSTEM: Yetki ve Kimlik Kontrolü ---
  async getAuthUserByToken(token: string) {
    const [result] = await db
      .select({
        accountId: session.accountId,
        role: account.role,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .from(session)
      .innerJoin(account, eq(session.accountId, account.id))
      .innerJoin(user, eq(account.id, user.accountId))
      .where(
        and(
          eq(session.token, token),
          gt(session.expiresAt, new Date())
        )
      )
      .limit(1);

    return result ?? null;
  }
}

export const sessionService = new SessionService();