"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Settings2, Mail } from "lucide-react";
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

  if (loading) return <div className="p-12 text-center text-sm text-zinc-400">Profiliniz yükleniyor...</div>;
  if (!user) return null;

  const profile = user.profile;

  return (
    <div className="mt-4 mb-12">
      
      {/* Hero Card (Indigo temalı, kendi profili olduğu belli olsun) */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl p-6 sm:p-10 shadow-md mb-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-xl pointer-events-none" />
        
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white/10 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner shrink-0 relative z-10 border border-white/20 backdrop-blur-sm">
          {profile ? profile.firstName.charAt(0).toUpperCase() : "?"}{profile ? profile.lastName.charAt(0).toUpperCase() : ""}
        </div>
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight capitalize mb-1">
            Hoş Geldin, {profile ? `${profile.firstName} ${profile.lastName}` : "Kullanıcı"}
          </h1>
          <p className="text-[15px] text-indigo-200 mb-5 flex items-center gap-1.5 justify-center sm:justify-start">
            <Mail size={14} strokeWidth={2} /> {user.account.email}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {profile?.sectionName ? (
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-3 py-1.5 rounded-lg text-[13px] font-medium backdrop-blur-sm">
                <Building2 size={15} strokeWidth={1.8} />
                {profile.sectionName} Departmanı
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-indigo-200 px-3 py-1.5 rounded-lg text-[13px] font-medium italic">
                Departman atanmadı
              </div>
            )}
            
            <Link href="/settings" className="inline-flex items-center gap-1.5 bg-white text-indigo-700 hover:bg-zinc-50 text-[13px] font-semibold py-1.5 px-4 rounded-lg transition-colors shadow-sm">
              <Settings2 size={15} strokeWidth={2} /> Profili Düzenle
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          {profile && <FamilyInfoCard userId={profile.id} />}
          {profile && <GirlfriendInfoCard userId={profile.id} />}
        </div>
        <div className="flex flex-col gap-6">
          <SessionList />
          {profile && <GirlfriendFamilyInfoCard userId={profile.id} />}
        </div>
      </div>
      
    </div>
  );
}