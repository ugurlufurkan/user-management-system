import { sql } from "drizzle-orm";
import { db } from "@/db";
import { session } from "@/db/schema";

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

  // Sadece süresi dolmamış aktif oturumu getirir (Giriş kontrolü için)
  async findByToken(token: string) {
    const [activeSession] = await db
      .select()
      .from(session)
      .where(sql`${session.token} = ${token} AND ${session.expiresAt} > NOW()`)
      .limit(1);

    return activeSession ?? null;
  }

  // Profil sayfasında adamın açık olan tüm cihazlarını listelemek için
  async findActiveByAccountId(accountId: string) {
    return db
      .select()
      .from(session)
      .where(sql`${session.accountId} = ${accountId}::uuid AND ${session.expiresAt} > NOW()`)
      .orderBy(sql`${session.createdAt} DESC`);
  }

  // Belli bir cihazı (oturumu) id ile kapatmak (çıkış yaptırmak) için
  async delete(id: string) {
    const [deletedSession] = await db
      .delete(session)
      .where(sql`${session.id} = ${id}::uuid`)
      .returning();

    return deletedSession ?? null;
  }
  
  // Bulunulan mevcut oturumdan (token ile) çıkış yapmak için
  async revokeByToken(token: string) {
    const [revokedSession] = await db
      .delete(session)
      .where(sql`${session.token} = ${token}`)
      .returning();
      
    return revokedSession ?? null;
  }
}

export const sessionService = new SessionService();