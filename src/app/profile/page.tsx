"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SessionList from "@/components/session-list";
import FamilyInfoCard from "@/components/family-info";
import GirlfriendInfoCard from "@/components/girlfriend-info";
import GirlfriendFamilyInfoCard from "@/components/girlfriend-family-info";

export default function ProfilePage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
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
        setUser(data);
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <div className="text-center mt-20 text-slate-500 animate-pulse text-lg font-medium">Profiliniz yükleniyor...</div>;
  }

  if (!user) return null;

  const profile = user.profile;

  return (
    <div className="max-w-6xl mx-auto mt-10 mb-20">
      
      {/* ÜST BİLGİ KARTI VE DEPARTMAN ROZETİ */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl p-10 text-white shadow-xl mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 relative overflow-hidden">
        {/* Dekoratif Çember */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        
        <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-5xl font-bold shadow-inner border-4 border-white/30 shrink-0">
          {profile ? profile.firstName.charAt(0).toUpperCase() : "?"}
        </div>
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10 w-full">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight capitalize">
            Hoş Geldin, {profile ? `${profile.firstName} ${profile.lastName}` : "Kullanıcı"}
          </h1>
          <p className="text-blue-200 text-lg mb-4">{user.account.email}</p>
          
          {/* DEPARTMAN ROZETİMİZ (BADGE) */}
          {profile?.sectionName ? (
            <div className="bg-blue-500/40 border border-blue-400/60 text-white px-5 py-2 rounded-full font-medium flex items-center gap-2 backdrop-blur-sm shadow-sm">
              🏢 {profile.sectionName} Departmanı
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 text-white/70 px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2">
              ⚠️ Departman ataması yapılmamış
            </div>
          )}
          
          <div className="mt-6 flex gap-3">
            <Link href="/settings" className="bg-white text-blue-900 font-bold py-2.5 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-md">
              Profili Düzenle
            </Link>
          </div>
        </div>
      </div>

      {/* DİĞER BİLGİ KARTLARI (Kız Arkadaş / Aile vb.) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          {profile && <FamilyInfoCard userId={profile.id} />}
          {profile && <GirlfriendInfoCard userId={profile.id} />}
        </div>
        <div className="flex flex-col gap-8">
          <SessionList />
          {profile && <GirlfriendFamilyInfoCard userId={profile.id} />}
        </div>
      </div>
      
    </div>
  );
}