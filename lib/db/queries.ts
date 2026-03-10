import { eq } from "drizzle-orm";
import { db } from "./index";
import { products } from "./schema";

/**
 * Obtiene todos los productos disponibles (catálogo).
 */
export async function getAvailableProducts() {
  return await db.query.products.findMany({
    where: eq(products.status, "AVAILABLE"),
    orderBy: (products, { desc }) => [desc(products.id)],
  });
}

/**
 * Obtiene los últimos productos disponibles para destacar (Hero/Carousel).
 */
export async function getFeaturedProducts(limit: number = 5) {
  return await db.query.products.findMany({
    where: eq(products.status, "AVAILABLE"),
    orderBy: (products, { desc }) => [desc(products.id)],
    limit,
  });
}

/**
 * Obtiene un producto por su ID (reemplazando al slug que no existe en el backend actual).
 */
export async function getProductById(id: number) {
  const result = await db.query.products.findFirst({
    where: eq(products.id, id),
  });
  return result ?? null;
}

// Helper de formateo (mantenido del original)
export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
