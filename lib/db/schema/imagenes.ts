import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { productos } from "./productos";

export const imagenes = pgTable("imagenes", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  idProducto: integer("id_producto")
    .notNull()
    .references(() => productos.id, { onDelete: "cascade" }),
});

export const imagenesRelations = relations(imagenes, ({ one }) => ({
  producto: one(productos, {
    fields: [imagenes.idProducto],
    references: [productos.id],
  }),
}));

export type Imagen = typeof imagenes.$inferSelect;
export type NewImagen = typeof imagenes.$inferInsert;
