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
    <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Üst Alan: Arama ve Ekleme Formu */}
      <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-50/30">
        <div className="relative w-full md:max-w-xs">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Departmanlarda ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-zinc-400"
          />
        </div>
        
        <form onSubmit={handleAddSection} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Yeni departman adı..."
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            required
          />
          <button
            type="submit"
            disabled={isAdding}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            {isAdding ? "Ekleniyor..." : "Ekle"}
          </button>
        </form>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-50/80 border-b border-zinc-200/80">
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Departman Adı</th>
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">Çalışan Sayısı</th>
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Oluşturulma Tarihi</th>
            <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {filteredSections.map((s) => (
            <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Building2 size={16} />
                  </div>
                  <span className="text-sm font-semibold text-zinc-900">{s.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold min-w-[2rem]">
                  {s.userCount}
                </span>
              </td>
              <td className="px-6 py-4 text-[13px] text-zinc-500">
                {new Date(s.createdAt).toLocaleDateString("tr-TR")}
              </td>
              <td className="px-6 py-4 text-right">
                <button 
                  onClick={() => handleDelete(s.id, s.userCount)}
                  disabled={deletingId === s.id}
                  title="Departmanı Sil"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                >
                  <Trash2 size={18} strokeWidth={1.8} />
                </button>
              </td>
            </tr>
          ))}
          {filteredSections.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-sm text-zinc-500">
                {search ? "Aradığınız kriterde departman bulunamadı." : "Sistemde departman bulunmuyor."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}