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

  // --- YETKİ DEĞİŞTİRME FONKSİYONU ---
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
    <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 border-b border-zinc-100 flex items-center justify-between gap-4 bg-zinc-50/30">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input type="text" placeholder="İsim veya e-posta ile ara..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
          <Download size={16} /> Rapor İndir
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 border-b border-zinc-200/80">
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase">Kullanıcı Bilgisi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase">İletişim</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase">Departman</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase text-center">Yetki Yönetimi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* DİNAMİK AVATAR SİSTEMİ */}
                    <Image 
                      src={`https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=e0e7ff&color=4338ca&bold=true&rounded=true`}
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="rounded-full border border-indigo-100 shadow-sm"
                      unoptimized
                    />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 capitalize">{u.firstName || "İsimsiz"} {u.lastName || ""}</p>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{u.id.split('-')[0]}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-[13px] text-zinc-600">{u.email}</span></td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                    {u.sectionName || "Atanmadı"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {/* RÜTBE YÖNETİMİ BUTONU */}
                  <button 
                    onClick={() => handleRoleChange(u.id, u.role)}
                    disabled={loadingId === u.id}
                    title="Yetkiyi Değiştir"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                      u.role === "ADMIN" 
                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' 
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {u.role === "ADMIN" ? <><ShieldAlert size={14} /> ADMIN <ArrowDownCircle size={14} className="ml-1 opacity-50 hover:opacity-100"/></> : <><Shield size={14} /> USER <ArrowUpCircle size={14} className="ml-1 opacity-50 hover:opacity-100"/></>}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.id)}
                    disabled={loadingId === u.id || u.role === "ADMIN"}
                    className={`p-2 rounded-lg transition-all ${u.role === "ADMIN" ? 'opacity-30 cursor-not-allowed text-zinc-400' : 'text-zinc-400 hover:text-red-600 hover:bg-red-50'}`}
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