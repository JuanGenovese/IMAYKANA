import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productos } from "./productos";

export const estados = pgTable("estados", {
  id: serial("id").primaryKey(),
  estado: varchar("estado", { length: 50 }).notNull().unique(),
});

export const estadosRelations = relations(estados, ({ many }) => ({
  productos: many(productos),
}));

export type Estado = typeof estados.$inferSelect;
export type NewEstado = typeof estados.$inferInsert;
