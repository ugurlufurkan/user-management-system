"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";
import { Heart, Edit2, Plus, Save, X, Trash2 } from "lucide-react";

type GirlfriendInfo = { id: string; firstName: string; lastName: string; age: number; city: string; };

export default function GirlfriendInfoCard({ userId, isReadOnly = false }: { userId: string, isReadOnly?: boolean }) {
  const { showToast } = useToast(); 
  const [gfInfo, setGfInfo] = useState<GirlfriendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/girlfriend`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if(data) setGfInfo(data); setLoading(false); });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReadOnly) return;
    const formData = new FormData(e.currentTarget);
    const payload = { 
      firstName: formData.get("firstName"), 
      lastName: formData.get("lastName"), 
      age: parseInt(formData.get("age") as string) || 0, 
      city: formData.get("city") 
    };

    const method = gfInfo ? "PATCH" : "POST";
    const res = await fetch(`/api/users/${userId}/girlfriend`, { 
      method, 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(payload) 
    });
    
    if (res.ok) { 
      setIsEditing(false); 
      setGfInfo({...gfInfo, ...payload} as GirlfriendInfo); 
      showToast("Kız arkadaş bilgileri kaydedildi!", "success"); 
    } else {
      showToast("Kayıt işlemi başarısız.", "error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Kız arkadaş bilgilerini tamamen silmek istediğinize emin misiniz?")) return;
    
    try {
      const res = await fetch(`/api/users/${userId}/girlfriend`, { method: "DELETE" });
      if (res.ok) {
        setGfInfo(null);
        showToast("Kız arkadaş bilgileri başarıyla silindi.", "success");
      } else {
        showToast("Silme işlemi başarısız.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    }
  };

  if (loading) return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
        <div className="h-16 bg-zinc-100 rounded-lg w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Heart size={18} strokeWidth={1.8} className="text-pink-500" />
          <h2 className="text-sm font-semibold text-zinc-900">Kız Arkadaş Bilgileri</h2>
        </div>
        {!isReadOnly && !isEditing && (
          <div className="flex items-center gap-2">
            {gfInfo ? (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors">
                  <Edit2 size={14} strokeWidth={2}/> Düzenle
                </button>
                <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Trash2 size={14} strokeWidth={2}/> Sil
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={14} strokeWidth={2}/> Ekle
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        {isEditing && !isReadOnly ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">Ad</label>
                <input name="firstName" placeholder="Ad" defaultValue={gfInfo?.firstName} required 
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">Soyad</label>
                <input name="lastName" placeholder="Soyad" defaultValue={gfInfo?.lastName} required 
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">Yaş</label>
                <input type="number" name="age" placeholder="Yaş" defaultValue={gfInfo?.age} required min="0" 
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 mb-1">Şehir</label>
                <input name="city" placeholder="Şehir" defaultValue={gfInfo?.city} required 
                  className="w-full px-3.5 py-2 border border-zinc-200 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white" />
              </div>
            </div>
            
            <div className="flex gap-2 mt-2 justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors">
                <X size={14} strokeWidth={2} /> İptal
              </button>
              <button type="submit" className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors">
                <Save size={14} strokeWidth={2} /> Kaydet
              </button>
            </div>
          </form>
        ) : gfInfo ? (
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 border border-zinc-100 p-5 rounded-lg">
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Ad Soyad</span>
              <span className="text-[14px] text-zinc-900 font-semibold capitalize">{gfInfo.firstName} {gfInfo.lastName}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Yaş</span>
              <span className="text-[14px] text-zinc-900 font-semibold">{gfInfo.age}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Şehir</span>
              <span className="text-[14px] text-zinc-900 font-semibold capitalize">{gfInfo.city}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[13px] text-zinc-500">
              {isReadOnly ? "Kullanıcı bilgi girmemiş." : "Kız arkadaş bilgisi eklemediniz."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}