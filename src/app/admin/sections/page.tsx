import { db } from "@/db";
import { section, user } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import SectionsDataTable from "@/components/admin/sections-table";

export default async function AdminSectionsPage() {
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
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Departman Yönetimi</h1>
        <p className="text-sm text-zinc-500 mt-1">Sistemdeki departmanları yönetin, yenilerini oluşturun veya mevcutları kaldırın.</p>
      </div>

      <SectionsDataTable initialSections={allSections} />
    </div>
  );
}