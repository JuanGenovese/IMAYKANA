import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tallesXCategoria } from "./talles-x-categoria";

export const talles = pgTable("talles", {
  id: serial("id").primaryKey(),
  talle: varchar("talle", { length: 10 }).notNull().unique(),
});

export const tallesRelations = relations(talles, ({ many }) => ({
  tallesXCategoria: many(tallesXCategoria),
}));

export type Talle = typeof talles.$inferSelect;
export type NewTalle = typeof talles.$inferInsert;
