"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionList from "@/components/session-list";
import FamilyInfoCard from "@/components/family-info";
import GirlfriendInfoCard from "@/components/girlfriend-info";
import GirlfriendFamilyInfoCard from "@/components/girlfriend-family-info";

type UserData = {
  account: { email: string; createdAt: string };
  profile: { id: string; firstName: string; lastName: string } | null; 
};

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
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
    <div className="max-w-4xl mx-auto mt-10 mb-20 flex flex-col gap-8">
      
      {/* 1. Kullanıcı Karşılama Kartı */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
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

      {/* 2. Profil Detayları (Kullanıcının kendine ait oluşturduğu tablolar) */}
      {userData.profile && (
        <>
          <FamilyInfoCard userId={userData.profile.id} />
          <GirlfriendInfoCard userId={userData.profile.id} />
          <GirlfriendFamilyInfoCard userId={userData.profile.id} />
        </>
      )}

      {/* 3. Oturumlar (Cihazlar) Bileşeni */}
      <SessionList />
      
    </div>
  );
}