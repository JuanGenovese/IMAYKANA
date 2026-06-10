import { pgTable, serial, varchar, integer, boolean, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tallesXCategoria } from "./talles-x-categoria";
import { transacciones } from "./transacciones";
import { estados } from "./estados";
import { imagenes } from "./imagenes";

export const productos = pgTable("productos", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  destacado: boolean("destacado").notNull().default(false),
  idTalleXCategoria: integer("id_talle_x_categoria")
    .notNull()
    .references(() => tallesXCategoria.id, { onDelete: "restrict" }),
  cantidad: integer("cantidad").notNull().default(1),
  idTransaccion: integer("id_transaccion").references(() => transacciones.id, {
    onDelete: "set null",
  }),
  idEstado: integer("id_estado")
    .notNull()
    .references(() => estados.id, { onDelete: "restrict" }),
  color: varchar("color", { length: 100 }).notNull(),
  descripcion: text("descripcion").notNull().default(""),
  medidasEspecificas: varchar("medidas_especificas", { length: 500 })
    .notNull()
    .default(""),
});

export const productosRelations = relations(productos, ({ one, many }) => ({
  talleXCategoria: one(tallesXCategoria, {
    fields: [productos.idTalleXCategoria],
    references: [tallesXCategoria.id],
  }),
  transaccion: one(transacciones, {
    fields: [productos.idTransaccion],
    references: [transacciones.id],
  }),
  estado: one(estados, {
    fields: [productos.idEstado],
    references: [estados.id],
  }),
  imagenes: many(imagenes),
}));

export type Producto = typeof productos.$inferSelect;
export type NewProducto = typeof productos.$inferInsert;
