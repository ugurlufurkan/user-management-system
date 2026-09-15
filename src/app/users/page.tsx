"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type UserProfile = {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // API'den tüm kullanıcıları çeken fonksiyon
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data || []);
        }
      } catch (error) {
        console.error("Kullanıcılar alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Anlık arama (Live Search) filtresi
  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-20">
      
      {/* Sayfa Başlığı ve Arama Çubuğu */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sistem Üyeleri</h1>
          <p className="text-slate-500 mt-1">Platforma kayıtlı tüm kullanıcıları keşfedin</p>
        </div>
        
        <div className="w-full sm:w-72">
          <input 
            type="text" 
            placeholder="İsim veya soyisim ara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      {loading ? (
        // Yüklenirken gösterilecek şık "İskelet (Skeleton)" yapısı
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 h-36 animate-pulse flex flex-col justify-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
          Aradığınız kriterlere uygun kullanıcı bulunamadı.
        </div>
      ) : (
        // Kullanıcı Kartları Listesi
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col">
              
              {/* İsim baş harflerinden Avatar oluşturma */}
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 capitalize">
                {user.firstName} {user.lastName}
              </h3>
              
              <div className="text-sm text-slate-400 mt-auto pt-6 flex justify-between items-center">
                <span>Katılım: {new Date(user.createdAt).toLocaleDateString('tr-TR')}</span>
                
                {/* Gelecekte tıklayıp o kişinin detayını görebileceğimiz altyapı */}
                <Link href={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Detayları Gör &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}