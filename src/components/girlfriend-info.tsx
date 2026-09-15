"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";

type GirlfriendInfo = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  meetingDate: string;
};

export default function GirlfriendInfoCard({ userId }: { userId: string }) {
  const { showToast } = useToast(); // BİLDİRİM FONKSİYONU
  const [girlfriendInfo, setGirlfriendInfo] = useState<GirlfriendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchGirlfriend = async () => {
    try {
      const res = await fetch(`/api/users/${userId}/girlfriend`);
      if (res.ok) {
        const data = await res.json();
        setGirlfriendInfo(data);
      }
    } catch (err) {
      console.error("Kız arkadaş bilgisi çekilemedi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchGirlfriend();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      age: parseInt(formData.get("age") as string) || 0,
      meetingDate: formData.get("meetingDate") ? new Date(formData.get("meetingDate") as string).toISOString() : null,
    };

    try {
      const method = girlfriendInfo ? "PATCH" : "POST";
      const res = await fetch(`/api/users/${userId}/girlfriend`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsEditing(false);
        fetchGirlfriend(); 
        showToast("Kız arkadaş bilgileri başarıyla kaydedildi!", "success");
      } else {
        const data = await res.json();
        // HATA BİLDİRİMİ! ⚠️
        showToast(data.error || "Kayıt işlemi başarısız oldu.", "error");
      }
    } catch (err) {
      showToast("Sunucuyla iletişim kurulamadı.", "error");
    }
  };

  const formatDateForInput = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split('T')[0];
  };

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 animate-pulse text-slate-400">Bilgiler yükleniyor...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl pointer-events-none">❤️</div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          ❤️ Kız Arkadaş Bilgileri
        </h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-sm bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold px-4 py-1.5 rounded-lg transition-colors border border-pink-200"
          >
            {girlfriendInfo ? "Düzenle" : "Ekle"}
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adı</label>
              <input name="firstName" defaultValue={girlfriendInfo?.firstName || ""} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Soyadı</label>
              <input name="lastName" defaultValue={girlfriendInfo?.lastName || ""} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Yaşı</label>
              <input type="number" name="age" defaultValue={girlfriendInfo?.age || ""} required min="18" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanışma Tarihi</label>
              <input type="date" name="meetingDate" defaultValue={formatDateForInput(girlfriendInfo?.meetingDate)} required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none" />
            </div>
          </div>
          
          <div className="flex gap-3 mt-2">
            <button type="submit" className="bg-pink-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-pink-600 transition-colors">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border border-slate-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">İptal</button>
          </div>
        </form>
      ) : girlfriendInfo ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-pink-50/70 p-5 rounded-lg border border-pink-100 relative z-10">
          <div>
            <span className="block text-xs uppercase tracking-wider text-pink-500 mb-1 font-bold">Adı</span>
            <span className="font-medium text-slate-900 text-lg">{girlfriendInfo.firstName}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-pink-500 mb-1 font-bold">Soyadı</span>
            <span className="font-medium text-slate-900 text-lg">{girlfriendInfo.lastName}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-pink-500 mb-1 font-bold">Yaş</span>
            <span className="font-medium text-slate-900 text-lg">{girlfriendInfo.age}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-pink-500 mb-1 font-bold">Tanışma Tarihi</span>
            <span className="font-medium text-slate-900 text-lg">{new Date(girlfriendInfo.meetingDate).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 relative z-10">
          <p className="text-slate-500">Sisteme henüz kız arkadaş bilgisi eklemediniz.</p>
        </div>
      )}
    </div>
  );
}