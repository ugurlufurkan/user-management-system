"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldAlert, Search, Trash2, Download, Layers } from "lucide-react";
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

type Section = { id: string; name: string };

export default function UsersDataTable({ initialUsers, sections }: { initialUsers: UserRow[], sections: Section[] }) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Toplu işlem stateleri
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkMoving, setIsBulkMoving] = useState(false);
  
  const router = useRouter();
  const { showToast } = useToast();

  const filteredUsers = initialUsers.filter(u => {
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    return fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUsers.length) {
      setSelectedIds([]); // Hepsini kaldır
    } else {
      setSelectedIds(filteredUsers.map(u => u.id)); // Hepsini seç
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Tekil İşlemler
  const handleDelete = async (id: string) => {
    if (!confirm("DİKKAT: Bu kullanıcıyı sistemden tamamen silmek istediğinize emin misiniz?")) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Kullanıcı sistemden başarıyla silindi.", "success");
        setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        router.refresh(); 
      } else {
        showToast("Silme başarısız.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRoleChange = async (id: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Bu kullanıcının yetkisini değiştirmek istediğinize emin misiniz?`)) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/accounts/${id}/role`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        showToast("Kullanıcı yetkisi güncellendi!", "success");
        router.refresh(); 
      } else {
        showToast("Yetki güncellenemedi.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setLoadingId(null);
    }
  };

  // TOPLU İŞLEMLER (BULK ACTIONS)
  const handleBulkDelete = async () => {
    if (!confirm(`DİKKAT: Seçili ${selectedIds.length} kullanıcıyı KALICI OLARAK SİLMEK istediğinize emin misiniz?`)) return;
    setIsBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/accounts/bulk-delete", {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: selectedIds })
      });
      if (res.ok) {
        showToast(`${selectedIds.length} kullanıcı başarıyla silindi.`, "success");
        setSelectedIds([]);
        router.refresh();
      } else {
        showToast("Toplu silme işlemi başarısız oldu.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleBulkMove = async () => {
    if (!selectedSection) return showToast("Lütfen bir departman seçin.", "error");
    if (!confirm(`Seçili ${selectedIds.length} kullanıcıyı yeni departmana taşımak istediğinize emin misiniz?`)) return;
    setIsBulkMoving(true);
    try {
      const res = await fetch("/api/admin/users/bulk-section", {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids: selectedIds, sectionId: selectedSection })
      });
      if (res.ok) {
        showToast(`${selectedIds.length} kullanıcı başarıyla taşındı.`, "success");
        setSelectedIds([]);
        setSelectedSection("");
        router.refresh();
      } else {
        showToast("Toplu taşıma başarısız oldu.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setIsBulkMoving(false);
    }
  };

  const handleExportCSV = () => {
    if (filteredUsers.length === 0) return;
    const headers = ["ID", "Isim", "Soyisim", "E-Posta", "Departman", "Yetki", "Kayit Tarihi"];
    const rows = filteredUsers.map(u => [u.id, u.firstName || "İsimsiz", u.lastName || "", u.email, u.sectionName || "Atanmadı", u.role, new Date(u.createdAt).toLocaleDateString("tr-TR")]);
    const csvContent = [headers.join(","), ...rows.map(r => r.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `kullanicilar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors">
      
      {/* Üst Kısım: Arama veya Toplu İşlem Çubuğu */}
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-800/30 transition-colors">
        
        {selectedIds.length > 0 ? (
          // EFSANEVİ TOPLU İŞLEM BARI
          <div className="w-full flex flex-col sm:flex-row items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800/50 transition-colors gap-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-indigo-600 text-white text-xs font-bold">{selectedIds.length}</span>
              <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Kullanıcı Seçildi</span>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                <select 
                  value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)}
                  className="px-3 py-2 border border-indigo-200 dark:border-indigo-700/50 rounded-md text-sm bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">-- Departmana Taşı --</option>
                  {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <button 
                  onClick={handleBulkMove} disabled={!selectedSection || isBulkMoving}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                >
                  {isBulkMoving ? "Taşınıyor..." : "Taşı"}
                </button>
              </div>
              <div className="w-px h-6 bg-indigo-200 dark:bg-indigo-800/50 mx-1 hidden sm:block"></div>
              <button 
                onClick={handleBulkDelete} disabled={isBulkDeleting}
                className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-400 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
              >
                <Trash2 size={16} /> {isBulkDeleting ? "Siliniyor..." : "Seçilileri Sil"}
              </button>
            </div>
          </div>
        ) : (
          // NORMAL ARAMA BARI
          <>
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <input type="text" placeholder="İsim veya e-posta ile ara..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 transition-colors" />
            </div>
            <button onClick={handleExportCSV} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap w-full md:w-auto justify-center">
              <Download size={16} /> Rapor İndir
            </button>
          </>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
              <th className="px-4 py-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-indigo-500 cursor-pointer"
                />
              </th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Kullanıcı Bilgisi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">İletişim</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">Departman</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase text-center">Yetki Yönetimi</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {filteredUsers.map((u) => (
              <tr key={u.id} className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors ${selectedIds.includes(u.id) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                <td className="px-4 py-4 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                    className="w-4 h-4 text-indigo-600 rounded border-zinc-300 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-800 dark:checked:bg-indigo-500 cursor-pointer"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={`https://ui-avatars.com/api/?name=${u.firstName}+${u.lastName}&background=e0e7ff&color=4338ca&bold=true&rounded=true`} alt="Avatar" width={36} height={36} className="rounded-full border border-indigo-100 dark:border-indigo-900 shadow-sm" unoptimized />
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
                  <button onClick={() => handleRoleChange(u.id, u.role)} disabled={loadingId === u.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${u.role === "ADMIN" ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                  >
                    {u.role === "ADMIN" ? <><ShieldAlert size={14} /> ADMIN</> : <><Shield size={14} /> USER</>}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(u.id)} disabled={loadingId === u.id || u.role === "ADMIN"}
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