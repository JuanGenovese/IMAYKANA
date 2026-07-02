import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tallesXCategoria } from "./talles-x-categoria";

export const categorias = pgTable("categorias", {
  id: serial("id").primaryKey(),
  categoria: varchar("categoria", { length: 100 }).notNull().unique(),
});

export const categoriasRelations = relations(categorias, ({ many }) => ({
  tallesXCategoria: many(tallesXCategoria),
}));

export type Categoria = typeof categorias.$inferSelect;
export type NewCategoria = typeof categorias.$inferInsert;
