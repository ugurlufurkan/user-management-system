"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/context/toast-context"; // Bildirim sistemini içeri aldık

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
    } catch (error) {
      console.error("Bölümler alınamadı:", error);
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
        showToast("Bölüm başarıyla eklendi! 🏢", "success");
        setName("");
        fetchSections(); // Listeyi yenile
      } else {
        showToast(data.error || "Bölüm eklenemedi.", "error");
      }
    } catch (error) {
      showToast("Sunucu hatası oluştu.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string, sectionName: string) => {
    const onay = confirm(`"${sectionName}" departmanını silmek istediğinize emin misiniz?`);
    if (!onay) return;

    try {
      const res = await fetch(`/api/sections/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Departman sistemden silindi. 🗑️", "success");
        // Sayfayı yenilemeden veriyi ekrandan siliyoruz (Çok daha hızlı hissettirir)
        setSections(sections.filter(s => s.id !== id)); 
      } else {
        const data = await res.json();
        showToast(data.error || "Silme işlemi başarısız.", "error");
      }
    } catch (error) {
      showToast("Sunucu ile iletişim kurulamadı.", "error");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-slate-500 animate-pulse text-lg">Departmanlar yükleniyor...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-20">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Departman Yönetimi 🏢</h1>
      <p className="text-slate-500 mb-10">Şirket içindeki tüm bölümleri (sections) buradan ekleyip silebilirsiniz.</p>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Yeni Departman Ekle</h2>
        <form onSubmit={handleAddSection} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Örn: İnsan Kaynakları"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-grow border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
          />
          <button
            type="submit"
            disabled={isAdding}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isAdding ? "Ekleniyor..." : "Ekle"}
          </button>
        </form>
      </div>

      {/* BÖLÜMLER LİSTESİ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <h2 className="text-lg font-bold text-slate-800 p-6 border-b border-slate-100">Kayıtlı Departmanlar</h2>
        
        {sections.length === 0 ? (
          <div className="p-10 text-center text-slate-500">Henüz hiç departman eklenmemiş.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sections.map((section) => (
              // group class'ı ile üzerine gelindiğinde sil butonunun görünmesini sağlayacağız
              <li key={section.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                    {section.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-700 text-lg">{section.name}</span>
                </div>
                
                {/* SİLME BUTONU (Sadece farenin üzerine gelindiğinde yavaşça belirir) */}
                <button
                  onClick={() => handleDelete(section.id, section.name)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-medium text-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  Sil
                </button>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}