import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const PRODUCT_STATUS = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
} as const;

export type ProductStatus = keyof typeof PRODUCT_STATUS;

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  photoUrls: text("photo_urls")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  descriptionSummary: text("description_summary").notNull().default(""),
  size: varchar("size").notNull(),
  color: varchar("color").notNull(),
  specificMeasurements: varchar("specific_measurements").notNull().default(""),
  status: varchar("status")
    .notNull()
    .$type<ProductStatus>()
    .default("AVAILABLE"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  productId: serial("product_id").references(() => products.id),
  transactionType: varchar("transaction_type").notNull(),
  whatsappContact: varchar("whatsapp_contact"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  passwordHash: varchar("password_hash").notNull(),
  name: varchar("name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
export type Admin = typeof admins.$inferSelect;
