"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";

type FamilyInfo = {
  id: string;
  fatherName: string;
  motherName: string;
  siblingCount: number;
};

export default function FamilyInfoCard({ userId }: { userId: string }) {
  const { showToast } = useToast(); // BİLDİRİM FONKSİYONUNU ÇIKARTIYORUZ
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchFamily = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/family`);
      if (res.ok) {
        const data = await res.json();
        setFamilyInfo(data);
      }
    } catch (err) {
      console.error("Aile bilgisi çekilemedi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchFamily();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      fatherName: formData.get("fatherName"),
      motherName: formData.get("motherName"),
      siblingCount: parseInt(formData.get("siblingCount") as string) || 0,
    };

    try {
      const method = familyInfo ? "PATCH" : "POST";
      const res = await fetch(`/api/users/${userId}/family`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditing(false);
        fetchFamily(); 
        showToast("Aile bilgileri başarıyla kaydedildi!", "success");
      } else {
        const data = await res.json();
        // HATA BİLDİRİMİ! ⚠️
        showToast(data.error || "Kayıt işlemi başarısız oldu.", "error");
      }
    } catch (err) {
      showToast("Sunucuyla iletişim kurulamadı.", "error");
    }
  };

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse text-slate-400">Aile bilgileri yükleniyor...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          👨‍👩‍👧‍👦 Aile Bilgileri
        </h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-1.5 rounded-lg transition-colors"
          >
            {familyInfo ? "Düzenle" : "Ekle"}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Baba Adı</label>
              <input name="fatherName" defaultValue={familyInfo?.fatherName || ""} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Anne Adı</label>
              <input name="motherName" defaultValue={familyInfo?.motherName || ""} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kardeş Sayısı</label>
            <input type="number" name="siblingCount" defaultValue={familyInfo?.siblingCount || 0} required min="0" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none sm:w-1/2" />
          </div>
          
          <div className="flex gap-3 mt-2">
            <button type="submit" className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">İptal</button>
          </div>
        </form>
      ) : familyInfo ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-lg border border-slate-100">
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">Baba Adı</span>
            <span className="font-medium text-slate-900 text-lg">{familyInfo.fatherName}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">Anne Adı</span>
            <span className="font-medium text-slate-900 text-lg">{familyInfo.motherName}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">Kardeş Sayısı</span>
            <span className="font-medium text-slate-900 text-lg">{familyInfo.siblingCount}</span>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500">Sisteme henüz ailenizle ilgili bir bilgi girmediniz.</p>
        </div>
      )}
    </div>
  );
}