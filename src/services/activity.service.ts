import { db } from "@/db";
import { activityLog, account, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export class ActivityService {
  // Yeni bir işlem (log) kaydet
  async logAction(accountId: string, action: string, details?: string) {
    await db.insert(activityLog).values({
      accountId,
      action,
      details,
    });
  }

  // Admin panelinde göstermek için son olayları çek
  async getRecentLogs(limit: number = 10) {
    return db
      .select({
        id: activityLog.id,
        action: activityLog.action,
        details: activityLog.details,
        createdAt: activityLog.createdAt,
        firstName: user.firstName,
        lastName: user.lastName,
        email: account.email,
      })
      .from(activityLog)
      .leftJoin(account, eq(activityLog.accountId, account.id))
      .leftJoin(user, eq(account.id, user.accountId))
      .orderBy(desc(activityLog.createdAt))
      .limit(limit);
  }
}

export const activityService = new ActivityService();