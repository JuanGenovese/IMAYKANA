"use server";

import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { productos, type ProductoConRelaciones } from "@/lib/db/schema";

export async function getProductsByIds(ids: number[]): Promise<ProductoConRelaciones[]> {
  const validIds = ids.filter((id) => !isNaN(id));
  if (validIds.length === 0) return [];

  return (await db.query.productos.findMany({
    where: inArray(productos.id, validIds),
    with: {
      imagenes: true,
      talleXCategoria: {
        with: {
          talle: true,
          categoria: true,
        },
      },
      estado: true,
    },
  })) as ProductoConRelaciones[];
}
