"use client";

import { useEffect, useState } from "react";

type GirlfriendFamilyInfo = {
  id: string;
  fatherName: string;
  motherName: string;
};

export default function GirlfriendFamilyInfoCard({ userId }: { userId: string }) {
  const [familyInfo, setFamilyInfo] = useState<GirlfriendFamilyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const fetchFamily = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/girlfriend/family`);
      if (res.ok) {
        const data = await res.json();
        setFamilyInfo(data);
      }
    } catch (err) {
      console.error("Kız arkadaş aile bilgisi çekilemedi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFamily();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      fatherName: formData.get("fatherName"),
      motherName: formData.get("motherName"),
    };

    try {
      const method = familyInfo ? "PATCH" : "POST";
      const res = await fetch(`/api/users/${userId}/girlfriend/family`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditing(false);
        fetchFamily(); 
      } else {
        const data = await res.json();
        setError(data.error || "İşlem başarısız. (Önce kız arkadaş bilgisi eklediğinize emin olun)");
      }
    } catch (err) {
      setError("Sunucuyla iletişim kurulamadı.");
    }
  };

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse text-slate-400">Aile bilgileri yükleniyor...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 relative overflow-hidden">
      {/* Arka plan ikonu */}
      <div className="absolute -bottom-4 -right-2 p-4 opacity-5 text-7xl pointer-events-none">🏡</div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          🏡 Kız Arkadaş Aile Bilgileri
        </h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold px-4 py-1.5 rounded-lg transition-colors border border-purple-200"
          >
            {familyInfo ? "Düzenle" : "Ekle"}
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm relative z-10">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kayınpeder (Baba) Adı</label>
              <input name="fatherName" defaultValue={familyInfo?.fatherName || ""} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Kayınvalide (Anne) Adı</label>
              <input name="motherName" defaultValue={familyInfo?.motherName || ""} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none" />
            </div>
          </div>
          
          <div className="flex gap-3 mt-2">
            <button type="submit" className="bg-purple-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">İptal</button>
          </div>
        </form>
      ) : familyInfo ? (
        <div className="grid grid-cols-2 gap-6 bg-purple-50/50 p-5 rounded-lg border border-purple-100 relative z-10">
          <div>
            <span className="block text-xs uppercase tracking-wider text-purple-500 mb-1 font-bold">Kayınpeder (Baba) Adı</span>
            <span className="font-medium text-slate-900 text-lg">{familyInfo.fatherName}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-purple-500 mb-1 font-bold">Kayınvalide (Anne) Adı</span>
            <span className="font-medium text-slate-900 text-lg">{familyInfo.motherName}</span>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 relative z-10">
          <p className="text-slate-500">Henüz kız arkadaşınızın ailesiyle ilgili bilgi girmediniz.</p>
          <span className="text-xs text-slate-400 mt-1 block">(Not: Önce kız arkadaş bilgisini eklemiş olmanız gerekmektedir)</span>
        </div>
      )}
    </div>
  );
}