"use client";

import { useEffect, useState } from "react";

type Section = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Yeni bölüm ekleme ekranını açıp kapatmak için
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // API'den bölümleri çek
  const fetchSections = async () => {
    try {
      const res = await fetch("/api/sections");
      if (res.ok) {
        const data = await res.json();
        // API'nin dönüş yapısına göre `data` veya `data.data` olabilir (bizim response yapımıza göre)
        setSections(data.data || data || []);
      }
    } catch (err) {
      console.error("Bölümler çekilemedi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // Yeni bölüm kaydet
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        setIsAdding(false);
        setName("");
        setDescription("");
        fetchSections(); // Kayıt başarılıysa listeyi yenile
      } else {
        const data = await res.json();
        setError(data.error || "Bölüm eklenemedi.");
      }
    } catch (err) {
      setError("Sunucu hatası.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 mb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Bölümler</h1>
          <p className="text-slate-500 mt-1">Sistemde kayıtlı olan departmanların listesi</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm"
          >
            + Yeni Bölüm Ekle
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Yeni Bölüm Oluştur</h2>
          <form onSubmit={handleAddSection} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Bölüm Adı</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Örn: Yazılım Departmanı"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3}
                placeholder="Bu bölüm ne iş yapar?"
                className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button type="submit" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Kaydet</button>
              <button type="button" onClick={() => setIsAdding(false)} className="bg-white border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">İptal</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-500">Bölümler yükleniyor...</div>
      ) : sections.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 text-slate-500">
          Sistemde henüz hiçbir bölüm bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{section.name}</h3>
              <p className="text-slate-600 mb-6 text-sm line-clamp-3">
                {section.description || "Açıklama girilmemiş."}
              </p>
              <div className="text-xs text-slate-400 mt-auto pt-4 border-t border-slate-100 font-medium">
                Oluşturulma: {new Date(section.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}