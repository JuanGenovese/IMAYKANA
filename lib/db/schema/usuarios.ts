import { pgTable, varchar, uuid, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { roles } from "./roles";
import { transacciones } from "./transacciones";

export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey(),
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  nDni: varchar("n_dni", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  idRol: integer("id_rol")
    .notNull()
    .references(() => roles.id, { onDelete: "restrict" }),
  solicitudVendedor: boolean("solicitud_vendedor").notNull().default(false),
});

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  rol: one(roles, {
    fields: [usuarios.idRol],
    references: [roles.id],
  }),
  transacciones: many(transacciones),
}));

export type Usuario = typeof usuarios.$inferSelect;
export type NewUsuario = typeof usuarios.$inferInsert;
