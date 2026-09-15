"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Gelecek verinin tipini tanımlıyoruz (TypeScript)
type UserData = {
  account: { email: string; createdAt: string };
  profile: { firstName: string; lastName: string } | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa açılır açılmaz arka planda "Ben kimim?" (me) API'sini çağırıyoruz
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          // Token bitmişse veya izinsizse login'e postala (Middleware zaten yapıyor ama çift dikiş olsun)
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20 text-slate-500 font-medium">Bilgileriniz yükleniyor...</div>;
  }

  if (!userData) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      {/* Kullanıcı Karşılama Kartı */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Hoş geldin, {userData.profile ? `${userData.profile.firstName} ${userData.profile.lastName}` : "Kullanıcı"} 👋
        </h1>
        <div className="mt-4 text-slate-600">
          <p><strong>E-posta:</strong> {userData.account.email}</p>
          <p className="text-sm mt-1 text-slate-400">
            Kayıt Tarihi: {new Date(userData.account.createdAt).toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Gelecek bölüm için yer tutucu */}
      <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 text-center">
        <p className="text-slate-500">Çok yakında buraya "Açık Oturumlar (Cihazlar)" listesi eklenecek...</p>
      </div>
    </div>
  );
}