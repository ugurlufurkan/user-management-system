import { db } from "@/db";
import { user, section, session } from "@/db/schema";
import { sql } from "drizzle-orm";
import { Users, Building2, ShieldCheck, Activity } from "lucide-react";

export default async function AdminDashboardPage() {
  // Canlı istatistikleri veritabanından çek (Server Component avantajı)
  const [userCountRes, sectionCountRes, sessionCountRes] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(user),
    db.select({ count: sql<number>`count(*)` }).from(section),
    db.select({ count: sql<number>`count(*)` }).from(session).where(sql`${session.expiresAt} > NOW()`),
  ]);

  const stats = [
    {
      title: "Toplam Kullanıcı",
      value: userCountRes[0]?.count || 0,
      icon: <Users size={24} strokeWidth={1.5} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100"
    },
    {
      title: "Departman Sayısı",
      value: sectionCountRes[0]?.count || 0,
      icon: <Building2 size={24} strokeWidth={1.5} />,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-100"
    },
    {
      title: "Aktif Sistem Oturumu",
      value: sessionCountRes[0]?.count || 0,
      icon: <Activity size={24} strokeWidth={1.5} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100"
    },
    {
      title: "Güvenlik Durumu",
      value: "Optimum",
      icon: <ShieldCheck size={24} strokeWidth={1.5} />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Karşılama */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sistem Özeti</h1>
        <p className="text-sm text-zinc-500">
          Aksiyonsoft altyapısındaki genel durum raporlarını buradan anlık olarak takip edebilirsiniz.
        </p>
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

      {/* Bilgilendirme / Footer */}
      <div className="text-center pt-8">
        <p className="text-[13px] text-zinc-400">
          &copy; {new Date().getFullYear()} Aksiyonsoft Yönetim Paneli. Tüm veriler uçtan uca şifrelenmiştir.
        </p>
      </div>
    </div>
  );
}