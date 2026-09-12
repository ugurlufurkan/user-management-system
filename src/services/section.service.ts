import { sql } from "drizzle-orm";
import { db } from "@/db";
import { section } from "@/db/schema";

export class SectionService {
  async create(data: {
    name: string;
  }) {
    const [newSection] = await db
      .insert(section)
      .values({
        name: data.name,
      })
      .returning();

    return newSection;
  }

  async findAll() {
    return db.select().from(section);
  }

  async findById(id: string) {
    const [sectionRecord] = await db
      .select()
      .from(section)
      .where(sql`${section.id} = ${id}::uuid`);

    return sectionRecord ?? null;
  }

  async update(
    id: string,
    data: {
      name?: string;
    }
  ) {
    const [updatedSection] = await db
      .update(section)
      .set(data)
      .where(sql`${section.id} = ${id}::uuid`)
      .returning();

    return updatedSection ?? null;
  }

  async delete(id: string) {
    const [deletedSection] = await db
      .delete(section)
      .where(sql`${section.id} = ${id}::uuid`)
      .returning();

    return deletedSection ?? null;
  }
}

export const sectionService = new SectionService();