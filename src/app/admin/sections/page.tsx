import { db } from "@/db";
import { section, user } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { Building2 } from "lucide-react";

export default async function AdminSectionsPage() {
  // Departmanları ve o departmana ait kullanıcı sayısını (count) gruplayarak çekiyoruz
  const allSections = await db
    .select({
      id: section.id,
      name: section.name,
      createdAt: section.createdAt,
      userCount: sql<number>`count(${user.id})`.mapWith(Number),
    })
    .from(section)
    .leftJoin(user, eq(section.id, user.sectionId))
    .groupBy(section.id)
    .orderBy(desc(section.createdAt));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">Departman Yönetimi</h1>
        <p className="text-sm text-zinc-500 mt-1">Sistemdeki aktif departmanlar ve çalışan istatistikleri.</p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-200/80">
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Departman Adı</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-center">Çalışan Sayısı</th>
              <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Oluşturulma Tarihi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {allSections.map((s) => (
              <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <Building2 size={16} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-900">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold min-w-[2rem]">
                    {s.userCount}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-[13px] text-zinc-500">
                  {new Date(s.createdAt).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
            {allSections.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-zinc-500">Hiç departman bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}