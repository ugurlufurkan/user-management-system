import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const account = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const section = pgTable("section", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const user = pgTable("user", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => account.id, { onDelete: "cascade" }),
  
  // Kullanıcının bağlı olduğu departman (section)
  // "onDelete: set null" => Eğer departman silinirse adam silinmesin, sadece departmanı "Boş" görünsün.
  sectionId: uuid("section_id").references(() => section.id, { onDelete: "set null" }),
  
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userFamilyInformation = pgTable("user_family_information", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fatherName: varchar("father_name", { length: 100 }).notNull(),
  motherName: varchar("mother_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userGirlfriendInformation = pgTable("user_girlfriend_information", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const userGirlfriendFamilyInformation = pgTable("user_girlfriend_family_information", {
  id: uuid("id").defaultRandom().primaryKey(),
  girlfriendId: uuid("girlfriend_id")
    .notNull()
    .references(() => userGirlfriendInformation.id, { onDelete: "cascade" }),
  fatherName: varchar("father_name", { length: 100 }).notNull(),
  motherName: varchar("mother_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const session = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => account.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  userAgent: varchar("user_agent", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});