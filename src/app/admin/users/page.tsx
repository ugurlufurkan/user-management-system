import { db } from "@/db";
import { account, user, section } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import UsersDataTable from "@/components/admin/users-table";

export default async function AdminUsersPage() {
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

  const allSections = await db.select({ id: section.id, name: section.name }).from(section);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors">Kullanıcı Yönetimi</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 transition-colors">Sistemdeki tüm üyeleri arayın, detaylı inceleyin veya toplu işlemler gerçekleştirin.</p>
      </div>
      <UsersDataTable initialUsers={allUsers} sections={allSections} />
    </div>
  );
}