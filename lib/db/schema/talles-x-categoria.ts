import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { talles } from "./talles";
import { categorias } from "./categorias";
import { productos } from "./productos";

export const tallesXCategoria = pgTable("talles_x_categoria", {
  id: serial("id").primaryKey(),
  idTalle: integer("id_talle")
    .notNull()
    .references(() => talles.id, { onDelete: "cascade" }),
  idCategoria: integer("id_categoria")
    .notNull()
    .references(() => categorias.id, { onDelete: "cascade" }),
});

export const tallesXCategoriaRelations = relations(
  tallesXCategoria,
  ({ one, many }) => ({
    talle: one(talles, {
      fields: [tallesXCategoria.idTalle],
      references: [talles.id],
    }),
    categoria: one(categorias, {
      fields: [tallesXCategoria.idCategoria],
      references: [categorias.id],
    }),
    productos: many(productos),
  }),
);

export type TalleXCategoria = typeof tallesXCategoria.$inferSelect;
export type NewTalleXCategoria = typeof tallesXCategoria.$inferInsert;
