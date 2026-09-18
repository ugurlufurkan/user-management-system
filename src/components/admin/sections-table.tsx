"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Search, Trash2, Plus } from "lucide-react";
import { useToast } from "@/context/toast-context";

type SectionRow = {
  id: string;
  name: string;
  createdAt: Date;
  userCount: number;
};

export default function SectionsDataTable({ initialSections }: { initialSections: SectionRow[] }) {
  const [search, setSearch] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const router = useRouter();
  const { showToast } = useToast();

  const filteredSections = initialSections.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSectionName }),
      });
      
      if (res.ok) {
        showToast("Yeni departman başarıyla eklendi.", "success");
        setNewSectionName("");
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || "Eklenemedi.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, userCount: number) => {
    const warning = userCount > 0 
      ? `Bu departmanda ${userCount} kişi çalışıyor. Departmanı silerseniz bu kişilerin departman bilgisi "Atanmadı" olarak güncellenir. Onaylıyor musunuz?`
      : `Bu departmanı silmek istediğinize emin misiniz?`;

    if (!confirm(warning)) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Departman sistemden silindi.", "success");
        router.refresh(); 
      } else {
        const data = await res.json();
        showToast(data.error || "Silme başarısız.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors">
      <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-800/30 transition-colors">
        <div className="relative w-full md:max-w-xs">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input type="text" placeholder="Departmanlarda ara..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        </div>
        
        <form onSubmit={handleAddSection} className="flex items-center gap-2 w-full md:w-auto">
          <input type="text" placeholder="Yeni departman adı..." value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all"
            required
          />
          <button type="submit" disabled={isAdding} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap">
            <Plus size={16} strokeWidth={2.5} />
            {isAdding ? "Ekleniyor..." : "Ekle"}
          </button>
        </form>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800 transition-colors">
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Departman Adı</th>
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">Çalışan Sayısı</th>
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Oluşturulma Tarihi</th>
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
          {filteredSections.map((s) => (
            <tr key={s.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 transition-colors">
                    <Building2 size={16} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-white">{s.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold min-w-[2rem] transition-colors">
                  {s.userCount}
                </span>
              </td>
              <td className="px-6 py-4 text-[13px] text-zinc-500 dark:text-zinc-400">
                {new Date(s.createdAt).toLocaleDateString("tr-TR")}
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => handleDelete(s.id, s.userCount)} disabled={deletingId === s.id} title="Departmanı Sil"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none transition-all"
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}