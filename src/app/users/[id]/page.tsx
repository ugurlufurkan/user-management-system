import { db } from "@/db";
import { user, account, section, activityLog } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { sessionService } from "@/services/session.service";
import { ArrowLeft, Building2, Mail, Shield, Calendar, Activity, Terminal, ShieldAlert } from "lucide-react";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: userId } = await params;
  
  // Şu an sisteme giriş yapmış olan kişiyi (CurrentUser) bulalım
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  let currentUser = null;
  if (sessionToken) {
    currentUser = await sessionService.getAuthUserByToken(sessionToken);
  }
  
  // Görüntülenen profil bilgilerini getir
  const [profile] = await db.select({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    accountId: user.accountId,
    email: account.email,
    role: account.role,
    sectionName: section.name,
  })
  .from(user)
  .innerJoin(account, eq(user.accountId, account.id))
  .leftJoin(section, eq(user.sectionId, section.id))
  .where(eq(user.id, userId))
  .limit(1);

  if (!profile) return notFound();

  // YETKİ KONTROLÜ: Giren kişi ADMIN mi yoksa profilin sahibi mi?
  const canViewLogs = currentUser?.role === "ADMIN" || currentUser?.accountId === profile.accountId;

  // Eğer yetkisi varsa logları veritabanından çek, yoksa boş array döndür (sistemi yormayalım)
  const logs = canViewLogs ? await db.select()
    .from(activityLog)
    .where(eq(activityLog.accountId, profile.accountId))
    .orderBy(desc(activityLog.createdAt))
    .limit(10) : [];

  return (
    <div className="max-w-5xl mx-auto mt-4 mb-12 space-y-6">
      
      {/* Geri Dön Butonu */}
      <div>
        <Link href="/users" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={16} /> Üye Rehberine Dön
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sol Sütun: Profil Kartı */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm text-center flex flex-col items-center transition-colors">
            <Image 
              src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=e0e7ff&color=4338ca&bold=true&rounded=true&size=128`}
              alt="Avatar" width={96} height={96} 
              className="rounded-full border-4 border-white dark:border-zinc-950 shadow-md mb-4" unoptimized
            />
            <h1 className="text-xl font-bold text-zinc-900 dark:text-white capitalize">{profile.firstName} {profile.lastName}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{profile.email}</p>
            
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[13px] font-semibold border border-indigo-100 dark:border-indigo-800/50">
              <Shield size={14} />
              {profile.role === "ADMIN" ? "Sistem Yöneticisi" : "Standart Kullanıcı"}
            </div>
          </div>

          {/* Hızlı Bilgiler */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">Detaylı Bilgiler</h2>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
                <Building2 size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Departman</span>
                <span className="font-medium text-zinc-900 dark:text-white">{profile.sectionName || "Atanmadı"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
                <Calendar size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Kayıt Tarihi</span>
                <span className="font-medium text-zinc-900 dark:text-white">{new Date(profile.createdAt).toLocaleDateString("tr-TR", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 shrink-0">
                <Mail size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">İletişim</span>
                <span className="font-medium text-zinc-900 dark:text-white truncate max-w-[150px]" title={profile.email}>{profile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Sütun: Sistem Hareketleri */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm h-full transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <Activity size={20} className="text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Son Sistem Hareketleri</h2>
            </div>

            {canViewLogs ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                {logs.length > 0 ? logs.map((log) => (
                  <div key={log.id} className="relative flex items-center justify-between group is-active pl-12">
                    <div className="absolute left-0 w-10 h-10 rounded-full border border-white dark:border-zinc-900 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 shadow flex items-center justify-center z-10 transition-colors">
                      <Terminal size={14} />
                    </div>
                    <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm transition-colors">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 text-[13px]">{log.action}</div>
                        <time className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md transition-colors">
                          {new Date(log.createdAt).toLocaleString("tr-TR", { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </time>
                      </div>
                      {log.details && <div className="text-zinc-500 dark:text-zinc-400 text-[12px] mt-1">{log.details}</div>}
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-zinc-500 dark:text-zinc-400 text-sm py-8 relative z-10 bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors">
                    Bu kullanıcı henüz sistemde hiçbir hareket (log) gerçekleştirmemiş.
                  </div>
                )}
              </div>
            ) : (
              // GİZLİLİK UYARISI (Eğer bakan kişi admin değilse ve başkasının profiline bakıyorsa)
              <div className="flex flex-col items-center justify-center h-48 text-center text-zinc-500 dark:text-zinc-400 text-sm py-8 bg-zinc-50 dark:bg-zinc-800/30 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 transition-colors px-6">
                <ShieldAlert size={36} strokeWidth={1.5} className="mb-3 text-red-500/70 dark:text-red-400/70" />
                <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Erişim Reddedildi</p>
                <p className="max-w-sm">
                  Kullanıcı gizliliği sebebiyle sistem hareketleri yalnızca yöneticiler ve profil sahibi tarafından görüntülünebilir.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}