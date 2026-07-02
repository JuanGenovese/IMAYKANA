import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usuarios } from "./usuarios";

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  rol: varchar("rol", { length: 50 }).notNull().unique(),
});

export const rolesRelations = relations(roles, ({ many }) => ({
  usuarios: many(usuarios),
}));

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;
