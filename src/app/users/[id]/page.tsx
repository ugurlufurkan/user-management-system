"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type UserDetail = {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string; // URL'deki [id] kısmını alıyoruz

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Bu sayfada sadece okuma (görüntüleme) yapacağımız için tip tanımını basit tutuyoruz (any)
  const [family, setFamily] = useState<any>(null);
  const [girlfriend, setGirlfriend] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        // 1. Kullanıcının kendi temel bilgilerini çek
        const userRes = await fetch(`/api/users/${id}`);
        if (!userRes.ok) {
          // Kullanıcı bulunamazsa listeye geri postala
          router.push("/users");
          return;
        }
        const userData = await userRes.json();
        setUser(userData);

        // 2. Aile bilgilerini çek (Eğer eklemişse)
        const famRes = await fetch(`/api/users/${id}/family`);
        if (famRes.ok) setFamily(await famRes.json());

        // 3. Kız arkadaş bilgilerini çek (Eğer eklemişse)
        const gfRes = await fetch(`/api/users/${id}/girlfriend`);
        if (gfRes.ok) setGirlfriend(await gfRes.json());

      } catch (error) {
        console.error("Kullanıcı detayları alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, router]);

  if (loading) {
    return <div className="text-center mt-32 text-slate-500 animate-pulse text-lg">Profil yükleniyor...</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-20 flex flex-col gap-6">
      
      {/* Geri Dönüş Butonu */}
      <Link href="/users" className="text-blue-600 hover:text-blue-800 font-medium mb-2 inline-block transition-colors">
        &larr; Tüm Üyelere Dön
      </Link>

      {/* Profil Başlığı (Header) */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-28 h-28 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-5xl shadow-inner">
          {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-slate-800 capitalize mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full inline-block">
            Katılım: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Aile Bilgileri (Sadece Okuma Modu) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">👨‍👩‍👧‍👦 Aile Bilgileri</h2>
          {family ? (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block text-xs font-bold uppercase tracking-wider">Baba Adı</span><span className="font-medium text-lg text-slate-800">{family.fatherName}</span></div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block text-xs font-bold uppercase tracking-wider">Anne Adı</span><span className="font-medium text-lg text-slate-800">{family.motherName}</span></div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100"><span className="text-slate-500 block text-xs font-bold uppercase tracking-wider">Kardeş Sayısı</span><span className="font-medium text-lg text-slate-800">{family.siblingCount}</span></div>
            </div>
          ) : (
            <div className="text-center p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
              <p className="text-slate-500 italic">Bu kullanıcı henüz aile bilgisini platformda paylaşmamış.</p>
            </div>
          )}
        </div>

        {/* Kız Arkadaş Bilgileri (Sadece Okuma Modu) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-pink-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">❤️ Kız Arkadaş Bilgileri</h2>
          {girlfriend ? (
            <div className="space-y-4">
              <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100"><span className="text-pink-500 block text-xs font-bold uppercase tracking-wider">Ad Soyad</span><span className="font-medium text-lg text-slate-800">{girlfriend.firstName} {girlfriend.lastName}</span></div>
              <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100"><span className="text-pink-500 block text-xs font-bold uppercase tracking-wider">Yaş</span><span className="font-medium text-lg text-slate-800">{girlfriend.age}</span></div>
              <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100"><span className="text-pink-500 block text-xs font-bold uppercase tracking-wider">Tanışma Tarihi</span><span className="font-medium text-lg text-slate-800">{new Date(girlfriend.meetingDate).toLocaleDateString('tr-TR')}</span></div>
            </div>
          ) : (
            <div className="text-center p-6 bg-pink-50/30 rounded-lg border border-dashed border-pink-200">
              <p className="text-slate-500 italic">Bu kullanıcı henüz özel bilgilerini platformda paylaşmamış.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}