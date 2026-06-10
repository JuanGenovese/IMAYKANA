import { eq } from "drizzle-orm";
import { db } from "../../index";
import { productos, estados } from "..";
import { type ProductoConRelaciones } from "./Interface";


export async function getAvailableProducts(): Promise<ProductoConRelaciones[]> {
  return (await db.query.productos.findMany({
    where: (productos, { eq }) => eq(
      productos.idEstado,
      db
        .select({ id: estados.id })
        .from(estados)
        .where(eq(estados.estado, "Disponible"))
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


export async function getFeaturedProducts(limit?: number): Promise<ProductoConRelaciones[]> {
  return (await db.query.productos.findMany({
    where: (productos, { eq }) => eq(productos.destacado, true),
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


export function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}
