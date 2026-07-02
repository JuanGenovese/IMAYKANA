import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { transacciones } from "./transacciones";

export const metodosPago = pgTable("metodos_pago", {
  id: serial("id").primaryKey(),
  metodo: varchar("metodo", { length: 100 }).notNull().unique(),
});

export const metodosPagoRelations = relations(metodosPago, ({ many }) => ({
  transacciones: many(transacciones),
}));

export type MetodoPago = typeof metodosPago.$inferSelect;
export type NewMetodoPago = typeof metodosPago.$inferInsert;
