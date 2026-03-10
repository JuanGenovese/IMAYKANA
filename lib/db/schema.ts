import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "Vestidos",
  "Blusas",
  "Faldas",
  "Abrigos",
  "Accesorios",
]);

export const sizeEnum = pgEnum("size", ["Único", "XS", "S", "M", "L", "XL"]);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    sku: varchar("sku", { length: 20 }).notNull().unique(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    category: categoryEnum("category").notNull(),
    priceARS: integer("price_ars").notNull(),
    shortDescription: text("short_description").notNull(),
    description: text("description").notNull(),
    tags: text("tags").array().notNull().default([]),
    images: text("images").array().notNull().default([]),
  },
  (table) => [
    uniqueIndex("products_sku_idx").on(table.sku),
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.category),
  ],
);

export const productSizes = pgTable(
  "product_sizes",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: sizeEnum("size").notNull(),
    /** Stock disponible para este talle */
    stock: integer("stock").notNull().default(0),
  },
  (table) => [index("product_sizes_product_id_idx").on(table.productId)],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductSize = typeof productSizes.$inferSelect;
