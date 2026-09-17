"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/toast-context";
import { Search, ArrowUpRight, ArrowDownAZ, ArrowUpZA, UserX, Inbox } from "lucide-react";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
      } catch {
        showToast("Sunucuya bağlanılamadı", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const deptName = (user.sectionName || "Atanmadı").toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || deptName.includes(search);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });

  return (
    <div className="mt-4 mb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Üye Rehberi</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Sistemdeki tüm kayıtlı kullanıcıları ve departmanlarını inceleyin</p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="İsim veya departman ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200"
            />
          </div>

          <button
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center w-10 h-10 border border-zinc-200 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors duration-200 shrink-0"
            title={sortOrder === "asc" ? "Z'den A'ya sırala" : "A'dan Z'ye sırala"}
            aria-label={sortOrder === "asc" ? "Z'den A'ya sırala" : "A'dan Z'ye sırala"}
          >
            {sortOrder === "asc" ? <ArrowDownAZ size={18} strokeWidth={1.8} /> : <ArrowUpZA size={18} strokeWidth={1.8} />}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400">Kullanıcılar yükleniyor...</div>
        ) : sortedUsers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              {searchTerm ? <UserX size={22} strokeWidth={1.5} className="text-zinc-400" /> : <Inbox size={22} strokeWidth={1.5} className="text-zinc-400" />}
            </div>
            <h3 className="text-base font-semibold text-zinc-700 mb-1.5">
              {searchTerm ? "Sonuç Bulunamadı" : "Rehber Boş"}
            </h3>
            <p className="text-sm text-zinc-500 max-w-xs mb-5">
              {searchTerm 
                ? `"${searchTerm}" ile eşleşen üye veya departman bulunamadı.` 
                : "Sistemde henüz kayıtlı üye bulunmuyor."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Aramayı Temizle
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {sortedUsers.map((user) => (
              <Link key={user.id} href={`/users/${user.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center text-sm font-semibold group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 capitalize group-hover:text-indigo-700 transition-colors">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.sectionName ? (
                      <span className="text-[12px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-indigo-400" />
                        {user.sectionName}
                      </span>
                    ) : (
                      <span className="text-[12px] text-zinc-400 italic mt-0.5">Departman atanmadı</span>
                    )}
                  </div>
                </div>
                <ArrowUpRight size={16} strokeWidth={1.8} className="text-zinc-300 group-hover:text-indigo-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}