"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";

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
    if (!confirm("Bu cihazdaki oturumu kapatmak istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/auth/sessions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showToast("Oturum başarıyla kapatıldı!", "success");

        if (isCurrent) {
          router.push("/login");
          router.refresh();
        } else {
          fetchSessions();
        }
      } else {
        // HATA DURUMUNDA DA KIRMIZI BİLDİRİM FIRLATIYORUZ ⚠️
        showToast("Oturum kapatılırken bir sorun oluştu.", "error");
      }
    } catch (error) {
      showToast("Sunucuya ulaşılamadı.", "error");
    }
  };

  if (loading) return <div className="text-sm text-slate-500 animate-pulse">Cihazlarınız taranıyor...</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Açık Oturumlar (Cihazlarınız)</h2>
      
      {sessions.length === 0 ? (
        <p className="text-slate-500">Aktif oturum bulunamadı.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className={`p-5 border rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all ${
                session.isCurrentDevice 
                  ? 'border-blue-300 bg-blue-50/50' 
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md" title={session.userAgent}>
                    {session.userAgent.length > 40 ? session.userAgent.substring(0, 40) + "..." : session.userAgent}
                  </span>
                  {session.isCurrentDevice && (
                    <span className="bg-blue-600 text-white text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold">
                      Şu Anki Cihaz
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 flex flex-wrap gap-4 font-medium">
                  <span>📍 IP: {session.ipAddress}</span>
                  <span>⏳ Bitiş: {new Date(session.expiresAt).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              
              <button
                onClick={() => handleRevoke(session.id, session.isCurrentDevice)}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  session.isCurrentDevice 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                Kapat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}