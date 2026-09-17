"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import FamilyInfoCard from "@/components/family-info";
import GirlfriendInfoCard from "@/components/girlfriend-info";
import GirlfriendFamilyInfoCard from "@/components/girlfriend-family-info";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data.data || data); 
        }
      } catch (error) {
        console.error("Kullanıcı alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [resolvedParams.id]);

  if (loading) return <div className="text-center mt-20 text-slate-500 animate-pulse text-lg">Yükleniyor...</div>;
  if (!user) return <div className="text-center mt-20"><h2 className="text-2xl font-bold mb-4">Kullanıcı Bulunamadı</h2><Link href="/users" className="text-blue-600">&larr; Rehbere Dön</Link></div>;

  return (
    <div className="max-w-6xl mx-auto mt-6 mb-20">
      <Link href="/users" className="inline-block text-slate-500 hover:text-blue-600 font-medium mb-6">&larr; Rehbere Dön</Link>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-10 text-white shadow-xl mb-10 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
        <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-5xl font-bold shadow-inner border-4 border-white/20 shrink-0">
          {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10 w-full">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight capitalize">{user.firstName} {user.lastName}</h1>
          <p className="text-slate-400 text-lg mb-4">Sistem Üyesi</p>
          
          {user.sectionName ? (
            <div className="bg-blue-500/30 border border-blue-400/50 text-blue-100 px-5 py-2 rounded-full font-medium flex items-center gap-2">
              🏢 {user.sectionName} Departmanı
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 text-white/70 px-5 py-2 rounded-full font-medium text-sm">
              ⚠️ Departman ataması yapılmamış
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8">
          <FamilyInfoCard userId={user.id} isReadOnly={true} />
          <GirlfriendInfoCard userId={user.id} isReadOnly={true} />
        </div>
        <div className="flex flex-col gap-8">
          <GirlfriendFamilyInfoCard userId={user.id} isReadOnly={true} />
        </div>
      </div>
    </div>
  );
}