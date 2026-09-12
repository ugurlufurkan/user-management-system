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
}

export const sectionService = new SectionService();