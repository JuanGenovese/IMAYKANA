import { pgTable, serial, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { metodosPago } from "./metodos-pago";
import { usuarios } from "./usuarios";
import { productos } from "./productos";

export const transacciones = pgTable("transacciones", {
  id: serial("id").primaryKey(),
  idMetodoPago: integer("id_metodo_pago")
    .notNull()
    .references(() => metodosPago.id, { onDelete: "restrict" }),
  idUsuario: uuid("id_usuario")
    .notNull()
    .references(() => usuarios.id, { onDelete: "restrict" }),
});

export const transaccionesRelations = relations(
  transacciones,
  ({ one, many }) => ({
    metodoPago: one(metodosPago, {
      fields: [transacciones.idMetodoPago],
      references: [metodosPago.id],
    }),
    usuario: one(usuarios, {
      fields: [transacciones.idUsuario],
      references: [usuarios.id],
    }),
    productos: many(productos),
  }),
);

export type Transaccion = typeof transacciones.$inferSelect;
export type NewTransaccion = typeof transacciones.$inferInsert;
