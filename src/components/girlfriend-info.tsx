"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";

type GirlfriendInfo = { id: string; firstName: string; lastName: string; age: number; meetingDate: string; };

export default function GirlfriendInfoCard({ userId, isReadOnly = false }: { userId: string, isReadOnly?: boolean }) {
  const { showToast } = useToast(); 
  const [gfInfo, setGfInfo] = useState<GirlfriendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/girlfriend`).then(res => res.ok ? res.json() : null).then(data => { if(data) setGfInfo(data); setLoading(false); });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) return;
    const formData = new FormData(e.currentTarget);
    const payload = { firstName: formData.get("firstName"), lastName: formData.get("lastName"), age: parseInt(formData.get("age") as string) || 0, meetingDate: formData.get("meetingDate") ? new Date(formData.get("meetingDate") as string).toISOString() : null };

    const method = gfInfo ? "PATCH" : "POST";
    const res = await fetch(`/api/users/${userId}/girlfriend`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { setIsEditing(false); setGfInfo({...gfInfo, ...payload} as GirlfriendInfo); showToast("Bilgiler kaydedildi!", "success"); } 
    else showToast("Kayıt başarısız.", "error");
  };

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm border border-pink-100 animate-pulse">Yükleniyor...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">💝 Kız Arkadaş Bilgileri</h2>
        {!isReadOnly && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm bg-pink-50 hover:bg-pink-100 text-pink-600 px-4 py-1.5 rounded-lg">{gfInfo ? "Düzenle" : "Ekle"}</button>
        )}
      </div>
      {isEditing && !isReadOnly ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="firstName" placeholder="Adı" defaultValue={gfInfo?.firstName} required className="w-full border p-2.5 rounded-lg" />
          <input name="lastName" placeholder="Soyadı" defaultValue={gfInfo?.lastName} required className="w-full border p-2.5 rounded-lg" />
          <input type="number" name="age" placeholder="Yaşı" defaultValue={gfInfo?.age} required min="18" className="w-full border p-2.5 rounded-lg" />
          <input type="date" name="meetingDate" defaultValue={gfInfo?.meetingDate ? new Date(gfInfo.meetingDate).toISOString().split('T')[0] : ""} required className="w-full border p-2.5 rounded-lg" />
          <div className="flex gap-3">
            <button type="submit" className="bg-pink-500 text-white px-5 py-2.5 rounded-lg">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border text-slate-700 px-5 py-2.5 rounded-lg">İptal</button>
          </div>
        </form>
      ) : gfInfo ? (
        <div className="grid grid-cols-2 gap-4 bg-pink-50 p-4 rounded-lg">
          <div><span className="text-xs text-pink-500 font-bold block">AD/SOYAD</span><span className="capitalize font-medium">{gfInfo.firstName} {gfInfo.lastName}</span></div>
          <div><span className="text-xs text-pink-500 font-bold block">YAŞ</span><span className="font-medium">{gfInfo.age}</span></div>
          <div><span className="text-xs text-pink-500 font-bold block">TANIŞMA</span><span className="font-medium">{new Date(gfInfo.meetingDate).toLocaleDateString('tr-TR')}</span></div>
        </div>
      ) : (
        <div className="text-center p-6 bg-slate-50 rounded-lg"><p className="text-slate-500">{isReadOnly ? "Kullanıcı bilgi girmemiş." : "Bilgi eklemediniz."}</p></div>
      )}
    </div>
  );
}