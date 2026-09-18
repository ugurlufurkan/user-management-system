import { db } from "@/db";
import { session, account, user } from "@/db/schema";
import { eq, gt, sql, desc } from "drizzle-orm";
import { Monitor, Smartphone, Globe, ShieldAlert } from "lucide-react";

export default async function AdminSessionsPage() {
  const activeSessions = await db
    .select({
      id: session.id,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      email: account.email,
    })
    .from(session)
    .innerJoin(account, eq(session.accountId, account.id))
    .innerJoin(user, eq(account.id, user.accountId))
    .where(gt(session.expiresAt, new Date()))
    .orderBy(desc(session.createdAt));

  const getDeviceIcon = (ua: string | null) => {
    if (!ua) return <Monitor size={16} />;
    const lowerUA = ua.toLowerCase();
    if (lowerUA.includes("mobile") || lowerUA.includes("android") || lowerUA.includes("iphone")) {
      return <Smartphone size={16} />;
    }
    return <Monitor size={16} />;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">Aktif Sistem Oturumları</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors">Platforma şu an bağlı olan tüm cihazlar ve IP adresleri.</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-sm font-semibold shadow-sm transition-colors">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          {activeSessions.length} Canlı Oturum
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Cihaz / Tarayıcı</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">IP Adresi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Oturum Açılış</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {activeSessions.map((s) => (
                <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900 dark:text-white capitalize">{s.firstName} {s.lastName}</span>
                      <span className="text-[12px] text-zinc-500 dark:text-zinc-400">{s.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] text-zinc-700 dark:text-zinc-300">
                      <div className="text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 transition-colors">
                        {getDeviceIcon(s.userAgent)}
                      </div>
                      <span className="truncate max-w-[200px]" title={s.userAgent || "Bilinmiyor"}>
                        {s.userAgent ? s.userAgent.split(" ")[0] : "Bilinmiyor"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[13px] text-zinc-600 dark:text-zinc-400 font-mono">
                      <Globe size={14} className="text-zinc-400 dark:text-zinc-500" /> 
                      {s.ipAddress || "Bilinmiyor"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                      {new Date(s.createdAt).toLocaleString("tr-TR", { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}