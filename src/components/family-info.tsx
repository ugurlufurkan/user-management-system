"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";

type FamilyInfo = { id: string; fatherName: string; motherName: string; siblingCount: number; };

export default function FamilyInfoCard({ userId, isReadOnly = false }: { userId: string, isReadOnly?: boolean }) {
  const { showToast } = useToast(); 
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/family`).then(res => res.ok ? res.json() : null).then(data => { if(data) setFamilyInfo(data); setLoading(false); });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) return;
    const formData = new FormData(e.currentTarget);
    const payload = { fatherName: formData.get("fatherName"), motherName: formData.get("motherName"), siblingCount: parseInt(formData.get("siblingCount") as string) || 0 };

    const method = familyInfo ? "PATCH" : "POST";
    const res = await fetch(`/api/users/${userId}/family`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) { setIsEditing(false); setFamilyInfo({...familyInfo, ...payload} as FamilyInfo); showToast("Aile bilgileri kaydedildi!", "success"); } 
    else showToast("Kayıt işlemi başarısız.", "error");
  };

  if (loading) return <div className="p-6 bg-white rounded-xl shadow-sm border animate-pulse">Yükleniyor...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">👨‍👩‍👧‍👦 Aile Bilgileri</h2>
        {!isReadOnly && !isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-sm bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-lg">{familyInfo ? "Düzenle" : "Ekle"}</button>
        )}
      </div>
      {isEditing && !isReadOnly ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="fatherName" placeholder="Baba Adı" defaultValue={familyInfo?.fatherName} required className="w-full border p-2.5 rounded-lg" />
          <input name="motherName" placeholder="Anne Adı" defaultValue={familyInfo?.motherName} required className="w-full border p-2.5 rounded-lg" />
          <input type="number" name="siblingCount" placeholder="Kardeş Sayısı" defaultValue={familyInfo?.siblingCount} required min="0" className="w-full border p-2.5 rounded-lg" />
          <div className="flex gap-3 mt-2">
            <button type="submit" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg">Kaydet</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-white border text-slate-700 px-5 py-2.5 rounded-lg">İptal</button>
          </div>
        </form>
      ) : familyInfo ? (
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
          <div><span className="text-xs text-slate-500 font-bold block">BABA ADI</span><span className="capitalize font-medium">{familyInfo.fatherName}</span></div>
          <div><span className="text-xs text-slate-500 font-bold block">ANNE ADI</span><span className="capitalize font-medium">{familyInfo.motherName}</span></div>
          <div><span className="text-xs text-slate-500 font-bold block">KARDEŞ</span><span className="font-medium">{familyInfo.siblingCount}</span></div>
        </div>
      ) : (
        <div className="text-center p-6 bg-slate-50 rounded-lg"><p className="text-slate-500">{isReadOnly ? "Kullanıcı bilgi girmemiş." : "Aile bilgisi eklemediniz."}</p></div>
      )}
    </div>
  );
}