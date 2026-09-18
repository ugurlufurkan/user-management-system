"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/context/toast-context";
import { Heart, Edit2, Plus, Save, X, Trash2 } from "lucide-react";

type GirlfriendInfo = { id: string; firstName: string; lastName: string; age: number; city: string; };

const TR_CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

export default function GirlfriendInfoCard({ userId, isReadOnly = false }: { userId: string, isReadOnly?: boolean }) {
  const { showToast } = useToast(); 
  const [gfInfo, setGfInfo] = useState<GirlfriendInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  useEffect(() => {
    if (isEditing) {
      setCitySearch(gfInfo?.city || "");
    }
  }, [isEditing, gfInfo]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/users/${userId}/girlfriend`)
        .then(res => res.ok ? res.json() : null)
        .then(data => { if(data?.data) setGfInfo(data.data); setLoading(false); });
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
      showToast("Kız arkadaş bilgileri başarıyla kaydedildi!", "success"); 
    } else {
      // HATA MESAJI ARTIK GİZLİ DEĞİL! API'den gelen mesajı alıp ekrana basıyoruz:
      const errorData = await res.json();
      showToast(errorData.error || "Kayıt işlemi başarısız.", "error");
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
        const errorData = await res.json();
        showToast(errorData.error || "Silme işlemi başarısız.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-6 shadow-sm transition-colors">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
          <div className="h-16 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl shadow-sm transition-colors relative">
      <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Heart size={18} strokeWidth={1.8} className="text-pink-500" />
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Kız Arkadaş Bilgileri</h2>
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            {gfInfo && !isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors">
                  <Edit2 size={14} /> Düzenle
                </button>
                <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs font-semibold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-lg transition-colors">
                  <Trash2 size={14} /> Sil
                </button>
              </>
            )}
            {!gfInfo && !isEditing && (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={14} /> Ekle
              </button>
            )}
          </div>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Ad</label>
                <input name="firstName" placeholder="Ad" defaultValue={gfInfo?.firstName} required 
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white dark:bg-zinc-800" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Soyad</label>
                <input name="lastName" placeholder="Soyad" defaultValue={gfInfo?.lastName} required 
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white dark:bg-zinc-800" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Yaş</label>
                <input type="number" name="age" placeholder="Yaş" defaultValue={gfInfo?.age} required min="0" 
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white dark:bg-zinc-800" />
              </div>
              <div className="relative">
                <label className="block text-[12px] font-medium text-zinc-700 dark:text-zinc-300 mb-1">Şehir</label>
                <input type="hidden" name="city" value={citySearch} />
                <input 
                  type="text" 
                  placeholder="Şehir seçin veya yazın..." 
                  value={citySearch}
                  onChange={(e) => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
                  onFocus={() => setShowCityDropdown(true)}
                  onBlur={() => setShowCityDropdown(false)}
                  required 
                  className="w-full px-3.5 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all bg-white dark:bg-zinc-800" 
                />
                
                {showCityDropdown && (
                  <div 
                    className="absolute z-50 w-full mt-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-52 overflow-y-auto custom-scrollbar ring-1 ring-black/5 dark:ring-white/10"
                    onMouseDown={(e) => e.preventDefault()} // Prevents the input from losing focus when clicking the scrollbar
                  >
                    {TR_CITIES.filter(c => c.toLocaleLowerCase('tr-TR').includes(citySearch.toLocaleLowerCase('tr-TR'))).map(city => (
                      <div 
                        key={city} 
                        className="px-4 py-2.5 text-[13px] text-zinc-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-zinc-700 hover:text-pink-600 dark:hover:text-pink-400 cursor-pointer transition-colors"
                        onMouseDown={(e) => { 
                          // onMouseDown fires before onBlur, making the click more reliable than onClick with a timeout
                          e.preventDefault(); 
                          setCitySearch(city); 
                          setShowCityDropdown(false); 
                        }}
                      >
                        {city}
                      </div>
                    ))}
                    {TR_CITIES.filter(c => c.toLocaleLowerCase('tr-TR').includes(citySearch.toLocaleLowerCase('tr-TR'))).length === 0 && (
                      <div className="px-4 py-3 text-[13px] text-zinc-500 text-center">Şehir bulunamadı</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 mt-2 justify-end">
              <button type="button" onClick={() => setIsEditing(false)} className="flex items-center gap-1.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors">
                <X size={14} /> İptal
              </button>
              <button type="submit" className="flex items-center gap-1.5 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm">
                <Save size={14} /> Kaydet
              </button>
            </div>
          </form>
        ) : gfInfo ? (
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/80 p-5 rounded-lg transition-colors">
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Ad Soyad</span>
              <span className="text-[14px] text-zinc-900 dark:text-zinc-100 font-semibold capitalize">{gfInfo.firstName} {gfInfo.lastName}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Yaş</span>
              <span className="text-[14px] text-zinc-900 dark:text-zinc-100 font-semibold">{gfInfo.age}</span>
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block mb-1">Şehir</span>
              <span className="text-[14px] text-zinc-900 dark:text-zinc-100 font-semibold capitalize">{gfInfo.city}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
              Henüz kız arkadaş bilgisi eklenmemiş.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}