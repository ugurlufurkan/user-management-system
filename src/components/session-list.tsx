"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";
import { Monitor, Smartphone, Globe, LogOut, ShieldCheck } from "lucide-react";

type Session = {
  id: string;
  userAgent: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  isCurrentDevice: boolean;
};

export default function SessionList() {
  const router = useRouter();
  const { showToast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/auth/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Oturumlar alınamadı", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleRevoke = async (id: string, isCurrent: boolean) => {
    if (!confirm("Bu oturumu sonlandırmak istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Oturum başarıyla sonlandırıldı.", "success");
        if (isCurrent) {
          router.push("/login");
          router.refresh();
        } else {
          fetchSessions();
        }
      } else {
        showToast("Oturum kapatılırken sorun oluştu.", "error");
      }
    } catch {
      showToast("Sunucuya ulaşılamadı.", "error");
    }
  };

  // Cihaz tipini basitçe tahmin eden yardımcı fonksiyon
  const getDeviceIcon = (ua: string) => {
    const lowerUA = ua.toLowerCase();
    if (lowerUA.includes("mobile") || lowerUA.includes("android") || lowerUA.includes("iphone")) {
      return <Smartphone size={18} strokeWidth={1.8} />;
    }
    return <Monitor size={18} strokeWidth={1.8} />;
  };

  if (loading) return (
    <div className="bg-white border border-zinc-200/80 rounded-xl p-8 shadow-sm">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-zinc-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-zinc-200/80 rounded-xl overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} strokeWidth={1.8} className="text-indigo-600" />
          <h2 className="text-sm font-semibold text-zinc-900">Aktif Oturumlar</h2>
        </div>
        <span className="text-[11px] font-semibold bg-zinc-100 text-zinc-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Güvenlik
        </span>
      </div>
      
      {sessions.length === 0 ? (
        <div className="p-8 text-center text-sm text-zinc-500">Aktif oturum bulunamadı.</div>
      ) : (
        <div className="divide-y divide-zinc-100">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${
                session.isCurrentDevice ? 'bg-indigo-50/30' : 'hover:bg-zinc-50/50'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`mt-0.5 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                  session.isCurrentDevice ? 'bg-indigo-100/50 text-indigo-600 border-indigo-200/50' : 'bg-zinc-100 text-zinc-500 border-zinc-200/50'
                }`}>
                  {getDeviceIcon(session.userAgent)}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[13px] text-zinc-900 truncate max-w-[200px] sm:max-w-[300px]" title={session.userAgent}>
                      {session.userAgent.split(" ")[0]} 
                      <span className="text-zinc-400 font-normal ml-1">Tarayıcı/Cihaz</span>
                    </span>
                    {session.isCurrentDevice && (
                      <span className="bg-indigo-600 text-white text-[10px] uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Mevcut
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-zinc-500">
                    <span className="flex items-center gap-1.5"><Globe size={12} /> {session.ipAddress}</span>
                    <span className="hidden sm:inline-block w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>Son: {new Date(session.expiresAt).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleRevoke(session.id, session.isCurrentDevice)}
                className={`shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all focus:outline-none focus:ring-2 ${
                  session.isCurrentDevice 
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500/30' 
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 shadow-sm focus:ring-zinc-500/30'
                }`}
              >
                <LogOut size={14} strokeWidth={2} /> Sonlandır
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}