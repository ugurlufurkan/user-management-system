"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, User as UserIcon, Search, Trash2, Download } from "lucide-react";
import { useToast } from "@/context/toast-context";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  const filteredUsers = initialUsers.filter(u => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const query = search.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  const handleDelete = async (id: string) => {
    if (!confirm("DİKKAT: Bu kullanıcıyı sistemden tamamen silmek istediğinize emin misiniz? (Tüm oturumları ve verileri silinecektir)")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Kullanıcı sistemden başarıyla kalıcı olarak silindi.", "success");
        router.refresh(); 
      } else {
        const data = await res.json();
        showToast(data.error || "Silme başarısız.", "error");
      }
    } catch {
      showToast("Sunucuyla bağlantı kurulamadı.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // --- EXCEL / CSV ÇIKTISI ALMA SİSTEMİ ---
  const handleExportCSV = () => {
    if (filteredUsers.length === 0) {
      showToast("İndirilecek veri bulunamadı.", "error");
      return;
    }

    const headers = ["ID", "Isim", "Soyisim", "E-Posta", "Departman", "Yetki", "Kayit Tarihi"];
    const rows = filteredUsers.map(u => [
      u.id,
      u.firstName || "İsimsiz",
      u.lastName || "",
      u.email,
      u.sectionName || "Atanmadı",
      u.role,
      new Date(u.createdAt).toLocaleDateString("tr-TR")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // Excel'in Türkçe karakterleri düzgün okuması için \uFEFF (UTF-8 BOM) ekliyoruz
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aksiyonsoft_kullanicilar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Kullanıcı raporu başarıyla indirildi.", "success");
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Arama Çubuğu ve Rapor Butonu */}
      <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/30">
        <div className="relative w-full sm:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="İsim, soyisim veya e-posta ile ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-zinc-400"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-[13px] font-semibold text-zinc-500 bg-white border border-zinc-200 px-3 py-2 rounded-lg shadow-sm whitespace-nowrap hidden sm:block">
            {filteredUsers.length} Kullanıcı
          </div>
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Download size={16} />
            Rapor İndir
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 border-b border-zinc-200/80">
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Kullanıcı Bilgisi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">İletişim</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Departman</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Yetki (Rol)</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 border border-zinc-200">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 capitalize">
                        {u.firstName || "İsimsiz"} {u.lastName || ""}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{u.id.split('-')[0]}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[13px] text-zinc-600 font-medium">{u.email}</span>
                </td>
                <td className="px-6 py-4">
                  {u.sectionName ? (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                      {u.sectionName}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400 italic">Atanmadı</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {u.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide">
                      <ShieldAlert size={12} /> ADMIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-semibold tracking-wide">
                      <Shield size={12} /> USER
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => handleDelete(u.id)}
                    disabled={deletingId === u.id || u.role === "ADMIN"}
                    title={u.role === "ADMIN" ? "Admin hesabı silinemez" : "Kullanıcıyı Sil"}
                    className={`inline-flex items-center justify-center p-2 rounded-lg transition-all ${
                      u.role === "ADMIN" 
                        ? 'opacity-30 cursor-not-allowed text-zinc-400' 
                        : 'text-zinc-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20'
                    }`}
                  >
                    <Trash2 size={18} strokeWidth={1.8} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500">
                  {search ? "Aradığınız kritere uygun kullanıcı bulunamadı." : "Hiç kullanıcı bulunamadı."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}