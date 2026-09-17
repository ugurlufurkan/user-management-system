"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/toast-context";

// Tip tanımına sectionName'i ekledik
type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  sectionName: string | null; 
};

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (res.ok) {
          setUsers(data.data || data || []);
        } else {
          showToast("Kullanıcılar alınamadı", "error");
        }
      } catch (error) {
        showToast("Sunucuya bağlanılamadı", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showToast]);

  // GELİŞMİŞ ARAMA: Artık isme göre değil, kullanıcının "Departmanına" göre de arama yapılabilir
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const deptName = (user.sectionName || "Atanmadı").toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || deptName.includes(search);
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Üye Rehberi 👥</h1>
          <p className="text-slate-500">Sistemdeki tüm kayıtlı kullanıcıları ve departmanlarını inceleyin.</p>
        </div>

        {/* GELİŞTİRİLMİŞ ARAMA KUTUSU */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="İsim veya Departman ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500 animate-pulse text-lg">Kullanıcılar yükleniyor...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            {searchTerm ? "Aradığınız kritere (isim veya departmana) uygun üye bulunamadı." : "Sistemde henüz kayıtlı üye yok."}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <li key={user.id} className="hover:bg-slate-50 transition-colors">
                <Link href={`/users/${user.id}`} className="p-6 flex items-center justify-between group">
                  
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-105 transition-transform">
                      {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-lg capitalize group-hover:text-blue-600 transition-colors">
                        {user.firstName} {user.lastName}
                      </span>
                      
                      {/* DEPARTMAN ROZETİMİZ */}
                      {user.sectionName ? (
                        <span className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                          🏢 <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium border border-slate-200">{user.sectionName}</span>
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 mt-1 italic flex items-center gap-1.5">
                          ⚠️ Departmanı Atanmadı
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profil İncele Butonu (Fare üzerine gelince sağdan kayarak çıkar) */}
                  <div className="text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-300">
                    Profili İncele &rarr;
                  </div>
                  
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}