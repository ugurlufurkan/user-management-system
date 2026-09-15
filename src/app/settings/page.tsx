"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // Silme butonunu kilitlemek için

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
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
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
      } else {
        showToast(data.error || "Şifre değiştirilemedi.", "error");
      }
    } catch (error) {
      showToast("Sunucuyla iletişim kurulamadı.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Kazara tıklamaları önlemek için ÇİFT ONAY alıyoruz!
    const onay1 = confirm("⚠️ DİKKAT: Hesabınızı silmek üzeresiniz. Bu işlem GERİ ALINAMAZ! Emin misiniz?");
    if (!onay1) return;

    const onay2 = confirm("Gerçekten tüm aile ve kız arkadaş verilerinizi kalıcı olarak silmek istiyor musunuz? Son Kararınız mı?");
    if (!onay2) return;

    setIsDeleting(true);

    try {
      // Yazdığımız acımasız API'yi çağırıyoruz
      const res = await fetch("/api/auth/account", {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Hesabınız ve tüm verileriniz kalıcı olarak silindi. Hoşça kalın... 🗑️", "success");
        // Hesabı silinen adamı siteye yeni girmiş gibi Kayıt ekranına yolluyoruz
        router.push("/register");
        router.refresh();
      } else {
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
      <p className="text-slate-500 mb-10">Güvenlik ve hesap tercihlerinizi buradan yönetebilirsiniz.</p>

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
            <input type="password" name="currentPassword" required className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifreniz</label>
            <input type="password" name="newPassword" required minLength={6} className="w-full border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-slate-800 outline-none transition-shadow" />
          </div>
          <div className="mt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-wait"
            >
              {isSaving ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        </form>
      </div>

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