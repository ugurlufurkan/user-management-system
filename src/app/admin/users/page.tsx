import { db } from "@/db";
import { account, user, section } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Shield, ShieldAlert, User as UserIcon } from "lucide-react";

export default async function AdminUsersPage() {
  // Veritabanından (account + user + section) tablolarını birleştirerek çekiyoruz
  const allUsers = await db
    .select({
      id: account.id,
      email: account.email,
      role: account.role,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: account.createdAt,
      sectionName: section.name,
    })
    .from(account)
    .leftJoin(user, eq(account.id, user.accountId))
    .leftJoin(section, eq(user.sectionId, section.id))
    .orderBy(desc(account.createdAt));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-zinc-500 mt-1">Sistemdeki tüm üyeleri ve yetkilerini görüntüleyin.</p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-200/80">
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Kullanıcı Bilgisi</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">İletişim</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Departman</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Yetki (Rol)</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Kayıt Tarihi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 border border-zinc-200">
                        <UserIcon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 capitalize">
                          {u.firstName || "İsimsiz"} {u.lastName || ""}
                        </p>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{u.id.split('-')[0]}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[13px] text-zinc-600 font-medium">{u.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    {u.sectionName ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-medium">
                        {u.sectionName}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Atanmadı</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.role === "ADMIN" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide">
                        <ShieldAlert size={12} /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-xs font-semibold tracking-wide">
                        <Shield size={12} /> USER
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-zinc-500">
                    {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
              {allUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-zinc-500">Hiç kullanıcı bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}