"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";

type GirlfriendFamilyInfo = { id: string; fatherName: string; motherName: string; };

export default function GirlfriendFamilyInfoCard({ userId, isReadOnly = false }: { userId: string, isReadOnly?: boolean }) {
  const { showToast } = useToast(); 
  const [familyInfo, setFamilyInfo] = useState<GirlfriendFamilyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/girlfriend/family`).then(res => res.ok ? res.json() : null).then(data => { if(data) setFamilyInfo(data); setLoading(false); });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) return;
    const formData = new FormData(e.currentTarget);
    const payload = { fatherName: formData.get("fatherName"), motherName: formData.get("motherName") };

    const method = familyInfo ? "PATCH" : "POST";
    const res = await fetch(`/api/users/${userId}/girlfriend/family`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { setIsEditing(false); setFamilyInfo({...familyInfo, ...payload} as GirlfriendFamilyInfo); showToast("Bilgiler kaydedildi!", "success"); } 
    else showToast("Önce kız arkadaş eklemelisiniz.", "error");
  };

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-100 animate-pulse">Yükleniyor...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">👨‍👩‍👧 Kız Arkadaş Aile Bilgileri</h2>
        {!isReadOnly && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm bg-purple-50 hover:bg-purple-100 text-purple-600 px-4 py-1.5 rounded-lg">{familyInfo ? "Düzenle" : "Ekle"}</button>
        )}
      </div>
      {isEditing && !isReadOnly ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="fatherName" placeholder="Kayınpeder Adı" defaultValue={familyInfo?.fatherName} required className="w-full border p-2.5 rounded-lg" />
          <input name="motherName" placeholder="Kayınvalide Adı" defaultValue={familyInfo?.motherName} required className="w-full border p-2.5 rounded-lg" />
          <div className="flex gap-3">
            <button type="submit" className="bg-purple-600 text-white px-5 py-2.5 rounded-lg">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border text-slate-700 px-5 py-2.5 rounded-lg">İptal</button>
          </div>
        </form>
      ) : familyInfo ? (
        <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
          <div><span className="text-xs text-purple-500 font-bold block">KAYINPEDER</span><span className="capitalize font-medium">{familyInfo.fatherName}</span></div>
          <div><span className="text-xs text-purple-500 font-bold block">KAYINVALİDE</span><span className="capitalize font-medium">{familyInfo.motherName}</span></div>
        </div>
      ) : (
        <div className="text-center p-6 bg-slate-50 rounded-lg"><p className="text-slate-500">{isReadOnly ? "Kullanıcı bilgi girmemiş." : "Bilgi eklemediniz."}</p></div>
      )}
    </div>
  );
}