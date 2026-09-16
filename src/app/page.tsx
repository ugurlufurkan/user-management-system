"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export default function Home() {
  const [stats, setStats] = useState({
    usersCount: 0,
    sectionsCount: 0,
  });
  
  // Son kayıt olanları tutacağımız yeni state
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

        // Tüm kullanıcıları alıp, kayıt tarihine (createdAt) göre en yeniden en eskiye doğru sıralıyoruz
        const sortedUsers = [...usersData].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Sadece en son kayıt olan 4 kişiyi (slice ile keserek) alıyoruz
        setRecentUsers(sortedUsers.slice(0, 4));

      } catch (error) {
        console.error("İstatistikler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-20">
      
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 text-white shadow-xl mb-12 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <span className="relative z-10 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 border border-blue-400/30">
          V1.1 GÜNCELLEMESİ 🚀
        </span>
        
        <h1 className="relative z-10 text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Kullanıcı Yönetim <br className="hidden md:block" /> Sistemine Hoş Geldiniz
        </h1>
        
        <p className="relative z-10 text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
          Şirketinizin tüm departmanlarını, çalışanlarını ve hassas kullanıcı verilerini tek bir merkezden güvenle ve hızla yönetin.
        </p>
        
        <div className="relative z-10 flex flex-col sm:flex-row gap-4">
          <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30">
            Hemen Kayıt Ol
          </Link>
          <Link href="/users" className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-all backdrop-blur-sm border border-white/10">
            Üyeleri Keşfet
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4">👥</div>
          <h3 className="text-slate-500 font-medium mb-1">Toplam Kullanıcı</h3>
          <div className="text-4xl font-black text-slate-800">
            {loading ? <span className="animate-pulse">...</span> : stats.usersCount}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-4">🏢</div>
          <h3 className="text-slate-500 font-medium mb-1">Aktif Departman</h3>
          <div className="text-4xl font-black text-slate-800">
            {loading ? <span className="animate-pulse">...</span> : stats.sectionsCount}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform cursor-default">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mb-4">🛡️</div>
          <h3 className="text-slate-500 font-medium mb-1">Sistem Durumu</h3>
          <div className="text-4xl font-black text-slate-800 flex items-center gap-3">
            Aktif 
            <span className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse mt-1 shadow-[0_0_10px_rgba(16,185,129,0.7)]"></span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Son Katılan Üyeler</h2>
          <Link href="/users" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Tümünü Gör &rarr;</Link>
        </div>
        
        {loading ? (
          <div className="p-10 text-center text-slate-400 animate-pulse">Kullanıcılar yükleniyor...</div>
        ) : recentUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Henüz hiç kayıtlı üye yok.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {recentUsers.map(user => (
              <Link key={user.id} href={`/users/${user.id}`} className="p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors group">
                <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-xl mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors shadow-sm">
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-slate-800 capitalize truncate w-full">{user.firstName} {user.lastName}</h3>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}