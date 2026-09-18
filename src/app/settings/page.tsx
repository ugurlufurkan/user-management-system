"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";
import { User, Lock, Building2, Trash2, ShieldAlert, Eye, EyeOff } from "lucide-react";

type Section = {
  id: string;
  name: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [meRes, sectionsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/sections")
        ]);

        if (!meRes.ok) {
          router.push("/login");
          return;
        }

        const meData = await meRes.json();
        const sectionsData = await sectionsRes.json();

        setUser(meData);
        setSections(sectionsData.data || sectionsData || []);
      } catch (error) {
        console.error("Veriler alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingProfile(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const sectionId = formData.get("sectionId");

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, sectionId: sectionId || null }),
      });

      if (res.ok) {
        showToast("Profiliniz başarıyla güncellendi.", "success");
        router.refresh();
      } else {
        showToast("Profil güncellenirken hata oluştu.", "error");
      }
    } catch {
      showToast("Sunucuya ulaşılamadı.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSavingPassword(true);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Şifreniz başarıyla değiştirildi.", "success");
        (e.target as HTMLFormElement).reset();
      } else {
        showToast(data.error || "Şifre güncellenemedi.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("HESABINIZI KALICI OLARAK SİLMEK İSTEDİĞİNİZE EMİN MİSİNİZ? Bu işlem geri alınamaz!")) return;

    try {
      const res = await fetch("/api/auth/me", { method: "DELETE" });
      if (res.ok) {
        alert("Hesabınız ve tüm verileriniz başarıyla silindi. Elveda!");
        router.push("/register");
      } else {
        showToast("Hesap silinirken hata oluştu.", "error");
      }
    } catch {
      showToast("Sunucu hatası.", "error");
    }
  };

  if (loading) return <div className="p-12 text-center text-sm text-zinc-400 dark:text-zinc-500">Ayarlar yükleniyor...</div>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto mt-4 mb-12">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Hesap Ayarları</h1>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5">Kişisel bilgilerinizi, departmanınızı ve güvenlik ayarlarınızı yönetin</p>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors">
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-2.5">
            <User size={18} strokeWidth={1.8} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Kişisel Bilgiler</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Adınız</label>
                  <input type="text" name="firstName" defaultValue={user.profile?.firstName} required 
                    className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Soyadınız</label>
                  <input type="text" name="lastName" defaultValue={user.profile?.lastName} required 
                    className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all" />
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <Building2 size={14} strokeWidth={1.8} className="text-zinc-400 dark:text-zinc-500" />
                  Departman (Section)
                </label>
                <select 
                  name="sectionId" 
                  defaultValue={user.profile?.sectionId || ""} 
                  className="w-full px-3.5 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all appearance-none"
                >
                  <option value="">-- Departman Seçin --</option>
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-2">
                <button type="submit" disabled={savingProfile} 
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-[13px] font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-70">
                  {savingProfile ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm transition-colors">
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center gap-2.5">
            <Lock size={18} strokeWidth={1.8} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">Güvenlik ve Şifre</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Mevcut Şifre</label>
                <div className="relative">
                  <input type={showCurrentPassword ? "text" : "password"} name="currentPassword" required 
                    className="w-full px-3.5 py-2.5 pr-10 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all" />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none">
                    {showCurrentPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Yeni Şifre</label>
                <div className="relative">
                  <input type={showNewPassword ? "text" : "password"} name="newPassword" required minLength={6}
                    className="w-full px-3.5 py-2.5 pr-10 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 focus:outline-none">
                    {showNewPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                  </button>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">Şifreniz en az 6 karakter uzunluğunda olmalıdır.</p>
              </div>

              <div className="flex justify-end mt-2">
                <button type="submit" disabled={savingPassword} 
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-[13px] font-semibold py-2 px-5 rounded-lg transition-colors disabled:opacity-70">
                  {savingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 dark:border-red-900/50 rounded-xl overflow-hidden shadow-sm bg-red-50/30 dark:bg-red-950/20 transition-colors">
          <div className="px-6 py-5 border-b border-red-100 dark:border-red-900/50 flex items-center gap-2.5 bg-white/50 dark:bg-black/20 transition-colors">
            <ShieldAlert size={18} strokeWidth={1.8} className="text-red-600 dark:text-red-500" />
            <h2 className="text-sm font-semibold text-red-900 dark:text-red-400">Tehlikeli Bölge</h2>
          </div>
          <div className="p-6">
            <p className="text-[13px] text-red-800/80 dark:text-red-400/80 mb-5 max-w-xl leading-relaxed transition-colors">
              Hesabınızı silmek tüm kişisel verilerinizi, aile bilgilerinizi ve departman atamanızı kalıcı olarak veritabanından siler. Bu işlem geri alınamaz.
            </p>
            <button 
              onClick={handleDeleteAccount} 
              className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-400 text-[13px] font-semibold py-2 px-5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
            >
              <Trash2 size={16} strokeWidth={1.8} /> Hesabı Kalıcı Olarak Sil
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}