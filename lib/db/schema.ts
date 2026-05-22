import { pgTable, serial, varchar, integer, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Roles
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  rol: varchar("rol", { length: 50 }).notNull().unique(),
});

// 2. Usuarios (perfiles vinculados a Supabase Auth)
export const usuarios = pgTable("usuarios", {
  id: uuid("id").primaryKey(), // Vinculado a auth.users (Supabase Auth)
  nombre: varchar("nombre", { length: 100 }).notNull(),
  apellido: varchar("apellido", { length: 100 }).notNull(),
  nDni: varchar("n_dni", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  idRol: integer("id_rol").notNull().references(() => roles.id, { onDelete: "restrict" }),
});

// 3. Categorías
export const categorias = pgTable("categorias", {
  id: serial("id").primaryKey(),
  categoria: varchar("categoria", { length: 100 }).notNull().unique(),
});

// 4. Talles
export const talles = pgTable("talles", {
  id: serial("id").primaryKey(),
  talle: varchar("talle", { length: 10 }).notNull().unique(),
});

// 5. Talles por Categoría
export const tallesXCategoria = pgTable("talles_x_categoria", {
  id: serial("id").primaryKey(),
  idTalle: integer("id_talle").notNull().references(() => talles.id, { onDelete: "cascade" }),
  idCategoria: integer("id_categoria").notNull().references(() => categorias.id, { onDelete: "cascade" }),
});

// 6. Métodos de Pago
export const metodosPago = pgTable("metodos_pago", {
  id: serial("id").primaryKey(),
  metodo: varchar("metodo", { length: 100 }).notNull().unique(),
});

// 7. Estados de productos
export const estados = pgTable("estados", {
  id: serial("id").primaryKey(),
  estado: varchar("estado", { length: 50 }).notNull().unique(),
});

// 8. Transacciones
export const transacciones = pgTable("transacciones", {
  id: serial("id").primaryKey(),
  idMetodoPago: integer("id_metodo_pago").notNull().references(() => metodosPago.id, { onDelete: "restrict" }),
  idUsuario: uuid("id_usuario").notNull().references(() => usuarios.id, { onDelete: "restrict" }),
});

// 9. Productos
export const productos = pgTable("productos", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  idTalleXCategoria: integer("id_talle_x_categoria").notNull().references(() => tallesXCategoria.id, { onDelete: "restrict" }),
  cantidad: integer("cantidad").notNull().default(1),
  idTransaccion: integer("id_transaccion").references(() => transacciones.id, { onDelete: "set null" }),
  idEstado: integer("id_estado").notNull().references(() => estados.id, { onDelete: "restrict" }),
  color: varchar("color", { length: 100 }).notNull(),
  descripcion: text("descripcion").notNull().default(""),
  medidasEspecificas: varchar("medidas_especificas", { length: 500 }).notNull().default(""),
});

// 10. Imágenes
export const imagenes = pgTable("imagenes", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 500 }).notNull(),
  idProducto: integer("id_producto").notNull().references(() => productos.id, { onDelete: "cascade" }),
});

// ---- RELACIONES (Drizzle Relational Queries) ----

export const rolesRelations = relations(roles, ({ many }) => ({
  usuarios: many(usuarios),
}));

export const usuariosRelations = relations(usuarios, ({ one, many }) => ({
  rol: one(roles, {
    fields: [usuarios.idRol],
    references: [roles.id],
  }),
  transacciones: many(transacciones),
}));

export const categoriasRelations = relations(categorias, ({ many }) => ({
  tallesXCategoria: many(tallesXCategoria),
}));

export const tallesRelations = relations(talles, ({ many }) => ({
  tallesXCategoria: many(tallesXCategoria),
}));

export const tallesXCategoriaRelations = relations(tallesXCategoria, ({ one, many }) => ({
  talle: one(talles, {
    fields: [tallesXCategoria.idTalle],
    references: [talles.id],
  }),
  categoria: one(categorias, {
    fields: [tallesXCategoria.idCategoria],
    references: [categorias.id],
  }),
  productos: many(productos),
}));

export const metodosPagoRelations = relations(metodosPago, ({ many }) => ({
  transacciones: many(transacciones),
}));

export const estadosRelations = relations(estados, ({ many }) => ({
  productos: many(productos),
}));

export const transaccionesRelations = relations(transacciones, ({ one, many }) => ({
  metodoPago: one(metodosPago, {
    fields: [transacciones.idMetodoPago],
    references: [metodosPago.id],
  }),
  usuario: one(usuarios, {
    fields: [transacciones.idUsuario],
    references: [usuarios.id],
  }),
  productos: many(productos),
}));

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

export const imagenesRelations = relations(imagenes, ({ one }) => ({
  producto: one(productos, {
    fields: [imagenes.idProducto],
    references: [productos.id],
  }),
}));

// ---- TIPOS INFERIDOS ----
export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
export type Usuario = typeof usuarios.$inferSelect;
export type NewUsuario = typeof usuarios.$inferInsert;
export type Categoria = typeof categorias.$inferSelect;
export type NewCategoria = typeof categorias.$inferInsert;
export type Talle = typeof talles.$inferSelect;
export type NewTalle = typeof talles.$inferInsert;
export type TalleXCategoria = typeof tallesXCategoria.$inferSelect;
export type NewTalleXCategoria = typeof tallesXCategoria.$inferInsert;
export type Estado = typeof estados.$inferSelect;
export type NewEstado = typeof estados.$inferInsert;
export type MetodoPago = typeof metodosPago.$inferSelect;
export type NewMetodoPago = typeof metodosPago.$inferInsert;
export type Transaccion = typeof transacciones.$inferSelect;
export type NewTransaccion = typeof transacciones.$inferInsert;
export type Producto = typeof productos.$inferSelect;
export type NewProducto = typeof productos.$inferInsert;
export type Imagen = typeof imagenes.$inferSelect;
export type NewImagen = typeof imagenes.$inferInsert;

export type ProductoConRelaciones = Producto & {
  imagenes: Imagen[];
  talleXCategoria: typeof tallesXCategoria.$inferSelect & {
    talle: typeof talles.$inferSelect;
    categoria: typeof categorias.$inferSelect;
  };
  estado: typeof estados.$inferSelect;
};

