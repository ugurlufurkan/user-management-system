"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, UserCircle } from "lucide-react";
import FamilyInfoCard from "@/components/family-info";
import GirlfriendInfoCard from "@/components/girlfriend-info";
import GirlfriendFamilyInfoCard from "@/components/girlfriend-family-info";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  if (loading) return <div className="p-12 text-center text-sm text-zinc-400">Kullanıcı yükleniyor...</div>;
  if (!user) return (
    <div className="p-16 flex flex-col items-center justify-center text-center mt-10">
      <UserCircle size={40} strokeWidth={1.5} className="text-zinc-300 mb-4" />
      <h2 className="text-base font-semibold text-zinc-700 mb-2">Kullanıcı Bulunamadı</h2>
      <Link href="/users" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">Rehbere Dön</Link>
    </div>
  );

  return (
    <div className="mt-4 mb-12">
      <Link href="/users" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-6 group">
        <ArrowLeft size={14} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" /> Rehbere Dön
      </Link>

      {/* Hero Card */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-10 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-50 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-100 text-zinc-400 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-inner shrink-0 relative z-10 border border-zinc-200/50">
          {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left z-10 w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight capitalize mb-1">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-zinc-500 mb-4">Sistem Üyesi</p>
          
          {user.sectionName ? (
            <div className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-lg text-[13px] font-medium">
              <Building2 size={15} strokeWidth={1.8} className="text-zinc-400" />
              {user.sectionName} Departmanı
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200/60 text-zinc-400 px-3 py-1.5 rounded-lg text-[13px] font-medium italic">
              Departman atanmadı
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <FamilyInfoCard userId={user.id} isReadOnly={true} />
          <GirlfriendInfoCard userId={user.id} isReadOnly={true} />
        </div>
        <div className="flex flex-col gap-6">
          <GirlfriendFamilyInfoCard userId={user.id} isReadOnly={true} />
        </div>
      </div>
    </div>
  );
}