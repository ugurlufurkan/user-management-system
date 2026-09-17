"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Building2, Activity, ArrowUpRight, TrendingUp } from "lucide-react";

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  sectionName?: string | null; 
};

export default function Home() {
  const [stats, setStats] = useState({ usersCount: 0, sectionsCount: 0 });
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, sectionsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/sections")
        ]);

        const usersData = usersRes.ok ? await usersRes.json() : [];
        const sectionsData = sectionsRes.ok ? await sectionsRes.json() : [];
        const fetchedSections = sectionsData.data || sectionsData;

        setStats({
          usersCount: usersData.length || 0,
          sectionsCount: fetchedSections.length || 0,
        });

        const sortedUsers = [...usersData].sort((a: UserProfile, b: UserProfile) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentUsers(sortedUsers.slice(0, 5));
      } catch (error) {
        console.error("İstatistikler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Toplam Kullanıcı",
      value: stats.usersCount,
      icon: <Users size={20} strokeWidth={1.8} />,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      href: "/users",
    },
    {
      label: "Aktif Departman",
      value: stats.sectionsCount,
      icon: <Building2 size={20} strokeWidth={1.8} />,
      color: "text-violet-600 bg-violet-50 border-violet-100",
      href: "/sections",
    },
    {
      label: "Sistem Durumu",
      value: "Aktif",
      icon: <Activity size={20} strokeWidth={1.8} />,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      href: null,
      pulse: true,
    },
  ];

  return (
    <div className="mt-4 mb-12">
      
      {/* Hero */}
      <div className="bg-zinc-900 rounded-2xl p-8 sm:p-12 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/8 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3.5 py-1 mb-6">
            <TrendingUp size={13} strokeWidth={2} className="text-indigo-400" />
            <span className="text-[11px] font-semibold text-indigo-300 tracking-widest uppercase">Enterprise Platform v1.2</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 leading-[1.15]">
            Kullanıcı Yönetim<br className="hidden sm:block" /> Platformuna Hoş Geldiniz
          </h1>
          
          <p className="text-zinc-400 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
            Departmanları, çalışanları ve oturum bilgilerini tek bir merkezden güvenle yönetin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200">
              Kayıt Ol
              <ArrowUpRight size={16} strokeWidth={2} />
            </Link>
            <Link href="/users" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200">
              Üyeleri Keşfet
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => {
          const content = (
            <div className="bg-white border border-zinc-200/80 rounded-xl p-6 hover:shadow-sm transition-all duration-200 group cursor-default">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${card.color}`}>
                  {card.icon}
                </div>
                {card.href && (
                  <ArrowUpRight size={16} strokeWidth={1.8} className="text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                )}
              </div>
              <p className="text-[13px] font-medium text-zinc-500 mb-1">{card.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-zinc-900">
                  {loading ? <span className="text-zinc-300">—</span> : card.value}
                </span>
                {card.pulse && !loading && (
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          );

          return card.href ? (
            <Link key={card.label} href={card.href}>{content}</Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Son Katılan Üyeler</h2>
            <p className="text-[13px] text-zinc-500 mt-0.5">Platforma en son kayıt olan kullanıcılar</p>
          </div>
          <Link href="/users" className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            Tümü <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400">Yükleniyor...</div>
        ) : recentUsers.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-500">Henüz kayıtlı üye yok.</div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {recentUsers.map(user => (
              <Link key={user.id} href={`/users/${user.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center text-sm font-semibold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 capitalize">{user.firstName} {user.lastName}</p>
                    {user.sectionName ? (
                      <span className="text-[12px] text-zinc-500">{user.sectionName}</span>
                    ) : (
                      <span className="text-[12px] text-zinc-400 italic">Departman atanmadı</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-zinc-400 hidden sm:block">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <ArrowUpRight size={14} strokeWidth={1.8} className="text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}