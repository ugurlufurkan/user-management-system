import { db } from "@/db";
import { user, section, session } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Users, Building2, ShieldCheck, Activity, Terminal } from "lucide-react";
import { activityService } from "@/services/activity.service";

export default async function AdminDashboardPage() {
  const [userCountRes, sectionCountRes, sessionCountRes, recentLogs] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(user),
    db.select({ count: sql<number>`count(*)` }).from(section),
    db.select({ count: sql<number>`count(*)` }).from(session).where(sql`${session.expiresAt} > NOW()`),
    activityService.getRecentLogs(5), // Son 5 olayı çek
  ]);

  const stats = [
    { title: "Toplam Kullanıcı", value: userCountRes[0]?.count || 0, icon: <Users size={24} strokeWidth={1.5} />, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-100" },
    { title: "Departman Sayısı", value: sectionCountRes[0]?.count || 0, icon: <Building2 size={24} strokeWidth={1.5} />, color: "text-violet-600", bgColor: "bg-violet-50", borderColor: "border-violet-100" },
    { title: "Aktif Sistem Oturumu", value: sessionCountRes[0]?.count || 0, icon: <Activity size={24} strokeWidth={1.5} />, color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-100" },
    { title: "Güvenlik Durumu", value: "Optimum", icon: <ShieldCheck size={24} strokeWidth={1.5} />, color: "text-indigo-600", bgColor: "bg-indigo-50", borderColor: "border-indigo-100" }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Karşılama */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sistem Özeti</h1>
        <p className="text-sm text-zinc-500">Aksiyonsoft altyapısındaki genel durum raporlarını ve güvenlik loglarını anlık olarak takip edebilirsiniz.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white border ${stat.borderColor} rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}>
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bgColor} opacity-50 group-hover:scale-110 transition-transform duration-500`}></div>
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sistem Hareketleri (Audit Logs) Timeline */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2 mb-6">
          <Terminal size={20} className="text-zinc-400" />
          Son Sistem Hareketleri (Audit Logs)
        </h2>
        
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
          {recentLogs.length > 0 ? recentLogs.map((log) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-indigo-50 text-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <Activity size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-zinc-50 p-4 rounded-xl border border-zinc-200 shadow-sm">
                <div className="flex items-center justify-between space-x-2 mb-1">
                  <div className="font-bold text-zinc-900 text-[13px] capitalize">{log.firstName || "Sistem"} {log.lastName || "Yöneticisi"}</div>
                  <time className="font-mono text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {new Date(log.createdAt).toLocaleString("tr-TR", { hour: '2-digit', minute:'2-digit' })}
                  </time>
                </div>
                <div className="text-zinc-600 text-[13px] font-medium">{log.action}</div>
                {log.details && <div className="text-zinc-400 text-[12px] mt-1 italic">{log.details}</div>}
              </div>
            </div>
          )) : (
            <div className="text-center text-zinc-500 text-sm py-4 relative z-10 bg-white">Henüz kaydedilmiş bir sistem hareketi yok.</div>
          )}
        </div>
      </div>

    </div>
  );
}