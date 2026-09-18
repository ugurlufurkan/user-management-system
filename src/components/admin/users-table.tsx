"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, Search, Trash2, Download, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useToast } from "@/context/toast-context";
import Image from "next/image";

type UserRow = {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  sectionName: string | null;
};

export default function UsersDataTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const filteredUsers = initialUsers.filter(u => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const query = search.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleDelete = async (id: string) => {
    if (!confirm("DİKKAT: Bu kullanıcıyı sistemden tamamen silmek istediğinize emin misiniz?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Kullanıcı sistemden başarıyla silindi.", "success");
        router.refresh(); 
      } else {
        const data = await res.json();
        showToast(data.error || "Silme başarısız.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const actionText = newRole === "ADMIN" ? "Admin yetkisi vermek" : "Admin yetkisini almak";
    
    if (!confirm(`Bu kullanıcının ${actionText} istediğinize emin misiniz?`)) return;

    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/accounts/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        showToast(`Kullanıcı yetkisi ${newRole} olarak güncellendi!`, "success");
        router.refresh(); 
      } else {
        const data = await res.json();
        showToast(data.error || "Yetki güncellenemedi.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;
    const headers = ["ID", "Isim", "Soyisim", "E-Posta", "Departman", "Yetki", "Kayit Tarihi"];
    const rows = filteredUsers.map(u => [
      u.id, u.firstName || "İsimsiz", u.lastName || "", u.email, u.sectionName || "Atanmadı", u.role, new Date(u.createdAt).toLocaleDateString("tr-TR")
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `aksiyonsoft_kullanicilar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-800/30 transition-colors">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input type="text" placeholder="İsim veya e-posta ile ara..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-colors" />
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Download size={16} /> Rapor İndir
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Kullanıcı Bilgisi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">İletişim</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Departman</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase text-center">Yetki Yönetimi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={`https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=e0e7ff&color=4338ca&bold=true&rounded=true`}
                      alt="Avatar" width={36} height={36} className="rounded-full border border-indigo-100 dark:border-indigo-900 shadow-sm" unoptimized
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">{u.firstName || "İsimsiz"} {u.lastName || ""}</p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">{u.id.split('-')[0]}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-[13px] text-zinc-600 dark:text-zinc-300">{u.email}</span></td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium transition-colors">
                    {u.sectionName || "Atanmadı"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleRoleChange(u.id, u.role)} disabled={loadingId === u.id} title="Yetkiyi Değiştir"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      u.role === "ADMIN" 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {u.role === "ADMIN" ? <><ShieldAlert size={14} /> ADMIN <ArrowDownCircle size={14} className="ml-1 opacity-50 hover:opacity-100"/></> : <><Shield size={14} /> USER <ArrowUpCircle size={14} className="ml-1 opacity-50 hover:opacity-100"/></>}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.id)} disabled={loadingId === u.id || u.role === "ADMIN"}
                    className={`p-2 rounded-lg transition-all ${u.role === "ADMIN" ? 'opacity-30 cursor-not-allowed text-zinc-400 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}