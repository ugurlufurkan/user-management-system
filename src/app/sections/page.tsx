"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/toast-context";
import { Building2, Plus, Trash2, Layers } from "lucide-react";

type Section = {
  id: string;
  name: string;
};

export default function SectionsPage() {
  const { showToast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      const data = await res.json();
      setSections(data.data || data || []);
    } catch {
      showToast("Departmanlar alınamadı", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAdding(true);
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Departman başarıyla eklendi!", "success");
        setName("");
        fetchSections(); 
      } else {
        showToast(data.error || "Departman eklenemedi.", "error");
      }
    } catch {
      showToast("Sunucu hatası oluştu.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, sectionName: string) => {
    const onay = confirm(`"${sectionName}" departmanını silmek istediğinize emin misiniz?`);
    if (!onay) return;

    try {
      const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });

      if (res.ok) {
        showToast("Departman sistemden silindi.", "success");
        setSections(sections.filter(s => s.id !== id)); 
      } else {
        const data = await res.json();
        showToast(data.error || "Silme işlemi başarısız.", "error");
      }
    } catch {
      showToast("Sunucu ile iletişim kurulamadı.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 mb-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Departman Yönetimi</h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">Şirket içindeki tüm bölümleri buradan ekleyip silebilirsiniz</p>
      </div>

      {/* Add Section */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 sm:p-6 shadow-sm mb-8">
        <h2 className="text-sm font-semibold text-zinc-800 mb-3">Yeni Departman Ekle</h2>
        <form onSubmit={handleAddSection} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Building2 size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Örn: İnsan Kaynakları"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 rounded-lg
              transition-all duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed shrink-0"
          >
            {isAdding ? "Ekleniyor..." : <><Plus size={16} strokeWidth={2} /> Ekle</>}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Kayıtlı Departmanlar</h2>
          <span className="text-xs font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full">{sections.length} Adet</span>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-sm text-zinc-400">Departmanlar yükleniyor...</div>
        ) : sections.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mb-4">
              <Layers size={22} strokeWidth={1.5} className="text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-zinc-500">Henüz hiçbir departman eklenmemiş.</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {sections.map((section) => (
              <li key={section.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-zinc-100 text-zinc-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                    {section.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-zinc-700 text-sm">{section.name}</span>
                </div>
                
                <button
                  onClick={() => handleDelete(section.id, section.name)}
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  aria-label="Departmanı Sil"
                >
                  <Trash2 size={14} strokeWidth={2} /> Sil
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}