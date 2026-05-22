import { eq } from "drizzle-orm";
import { db } from "./index";
import { productos, estados, type ProductoConRelaciones } from "./schema";

/**
 * Obtiene todos los productos disponibles (catálogo).
 */
export async function getAvailableProducts(): Promise<ProductoConRelaciones[]> {
  return (await db.query.productos.findMany({
    where: (productos, { eq }) => eq(
      productos.idEstado,
      db
        .select({ id: estados.id })
        .from(estados)
        .where(eq(estados.estado, "AVAILABLE"))
    ),
    orderBy: (productos, { desc }) => [desc(productos.id)],
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

/**
 * Obtiene los últimos productos disponibles para destacar (Hero/Carousel).
 */
export async function getFeaturedProducts(limit: number = 5): Promise<ProductoConRelaciones[]> {
  return (await db.query.productos.findMany({
    where: (productos, { eq }) => eq(
      productos.idEstado,
      db
        .select({ id: estados.id })
        .from(estados)
        .where(eq(estados.estado, "AVAILABLE"))
    ),
    orderBy: (productos, { desc }) => [desc(productos.id)],
    limit,
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

/**
 * Obtiene un producto por su ID.
 */
export async function getProductById(id: number): Promise<ProductoConRelaciones | null> {
  const result = await db.query.productos.findFirst({
    where: eq(productos.id, id),
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
  });
  return (result as ProductoConRelaciones) ?? null;
}

// Helper de formateo (mantenido del original)
export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
