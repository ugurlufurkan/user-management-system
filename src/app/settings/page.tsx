"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setEmail(data.account.email);
        
        if (data.profile) {
          setFirstName(data.profile.firstName || "");
          setLastName(data.profile.lastName || "");
        }
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Profil (İsim) Güncelleme Formunun API'ye Gönderilmesi
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Profil bilgileriniz başarıyla güncellendi! ✅", "success");
        // Navbar'da vs ismin değişme ihtimaline karşı sayfayı tazeliyoruz
        router.refresh(); 
      } else {
        showToast(data.error || "Profil güncellenemedi.", "error");
      }
    } catch (error) {
      showToast("Sunucuyla iletişim kurulamadı.", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingPassword(true);
    
    const form = e.currentTarget;
    const formData = new FormData(form);
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
        showToast("Şifreniz başarıyla güncellendi! 🔐", "success");
        form.reset();
        setShowCurrentPassword(false);
        setShowNewPassword(false);
      } else {
        showToast(data.error || "Şifre değiştirilemedi.", "error");
      }
    } catch (error) {
      showToast("Sunucuyla iletişim kurulamadı.", "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const onay1 = confirm("⚠️ DİKKAT: Hesabınızı silmek üzeresiniz. Bu işlem GERİ ALINAMAZ! Emin misiniz?");
    if (!onay1) return;

    const onay2 = confirm("Gerçekten tüm aile ve kız arkadaş verilerinizi kalıcı olarak silmek istiyor musunuz? Son Kararınız mı?");
    if (!onay2) return;

    setIsDeleting(true);

    try {
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Hesabınız kalıcı olarak silindi. Hoşça kalın... 🗑️", "success");
        router.push("/register");
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || "Hesap silinemedi.", "error");
        setIsDeleting(false);
      }
    } catch (error) {
      showToast("Sunucuyla iletişim kurulamadı.", "error");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-slate-500 animate-pulse text-lg">Ayarlarınız yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 mb-20">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Hesap Ayarları ⚙️</h1>
      <p className="text-slate-500 mb-10">Kişisel bilgilerinizi ve güvenlik tercihlerinizi buradan yönetebilirsiniz.</p>

      {/* PROFİL BİLGİLERİ */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Kişisel Bilgiler</h2>
        
        <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Adınız</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required 
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Soyadınız</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required 
                className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow" 
              />
            </div>
          </div>
          <div className="mt-2">
            <button 
              type="submit" 
              disabled={isSavingProfile}
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-wait"
            >
              {isSavingProfile ? "Kaydediliyor..." : "Bilgileri Kaydet"}
            </button>
          </div>
        </form>
      </div>

      {/* GÜVENLİK */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Güvenlik</h2>
        
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-1">Kayıtlı E-posta Adresi</label>
          <input 
            type="email" 
            value={email}
            disabled
            className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg text-slate-500 cursor-not-allowed" 
          />
          <p className="text-xs text-slate-400 mt-2">Sistem güvenliği gereği e-posta adresi şu an için değiştirilemez.</p>
        </div>

        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <h3 className="font-semibold text-slate-700 mt-2 mb-2">Şifre Değiştir</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Şifreniz</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                name="currentPassword" 
                required 
                className="w-full border border-slate-300 p-3 pr-16 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none transition-shadow" 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
              >
                {showCurrentPassword ? "GİZLE" : "GÖSTER"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifreniz</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"} 
                name="newPassword" 
                required 
                minLength={6} 
                className="w-full border border-slate-300 p-3 pr-16 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none transition-shadow" 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 focus:outline-none transition-colors"
              >
                {showNewPassword ? "GİZLE" : "GÖSTER"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <button 
              type="submit" 
              disabled={isSavingPassword}
              className="bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-wait"
            >
              {isSavingPassword ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        </form>
      </div>

      {/* TEHLİKELİ BÖLGE */}
      <div className="bg-red-50 p-8 rounded-xl border border-red-200 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-red-100 text-9xl pointer-events-none">⚠️</div>
        <h2 className="text-xl font-bold text-red-700 mb-2 relative z-10">Tehlikeli Bölge</h2>
        <p className="text-sm text-red-600 mb-6 max-w-md relative z-10">
          Hesabınızı silmek geri alınamaz bir işlemdir. Kaydettiğiniz tüm aile ve özel bilgileriniz kalıcı olarak veritabanından silinir.
        </p>
        <button 
          onClick={handleDeleteAccount}
          disabled={isDeleting}
          className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors shadow-md relative z-10 disabled:bg-red-400 disabled:cursor-wait"
        >
          {isDeleting ? "Hesap Siliniyor..." : "Hesabımı Kalıcı Olarak Sil"}
        </button>
      </div>
    </div>
  );
}