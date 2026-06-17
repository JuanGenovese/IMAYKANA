import { db } from "@/lib/db";
import {
  productos,
  imagenes,
  categorias,
  talles,
  tallesXCategoria,
  estados,
  type ProductoConRelaciones
} from "@/lib/db/schema";
import { eq, and, inArray, ilike, sql } from "drizzle-orm";

// Helper interno para obtener o crear la relación Talle x Categoría
async function getOrCreateTalleXCategoria(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  categoryName: string,
  sizeName: string,
): Promise<number> {
  const cleanedCategory = categoryName.trim();
  const cleanedSize = sizeName.trim();

  // 1. Obtener o crear la Categoría
  let cat = await tx.query.categorias.findFirst({
    where: eq(categorias.categoria, cleanedCategory),
  });
  if (!cat) {
    const [newCat] = await tx.insert(categorias).values({ categoria: cleanedCategory }).returning();
    cat = newCat;
  }

  // 2. Obtener o crear el Talle
  let sz = await tx.query.talles.findFirst({
    where: eq(talles.talle, cleanedSize),
  });
  if (!sz) {
    const [newSz] = await tx.insert(talles).values({ talle: cleanedSize }).returning();
    sz = newSz;
  }

  // 3. Obtener o crear la relación Talle x Categoría
  let relation = await tx.query.tallesXCategoria.findFirst({
    where: and(
      eq(tallesXCategoria.idTalle, sz.id),
      eq(tallesXCategoria.idCategoria, cat.id)
    ),
  });
  if (!relation) {
    const [newRelation] = await tx.insert(tallesXCategoria).values({
      idTalle: sz.id,
      idCategoria: cat.id,
    }).returning();
    relation = newRelation;
  }

  return relation.id;
}

export async function getProductByIdCore(id: number): Promise<ProductoConRelaciones | null> {
  if (isNaN(id) || id <= 0) return null;
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

export async function getCategoriesCore() {
  return await db.select().from(categorias);
}

export async function getAvailableProductsCore(options?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: ProductoConRelaciones[]; total: number }> {
  const page = options?.page ?? 1;
  const limit = options?.limit ?? 12;
  const offset = (page - 1) * limit;
  const category = options?.category;

  const [productsResult, countResult] = await Promise.all([
    db.query.productos.findMany({
      where: (productosTable, { eq, and, inArray, ilike }) => {
        const available = eq(
          productosTable.idEstado,
          db
            .select({ id: estados.id })
            .from(estados)
            .where(eq(estados.estado, "Disponible"))
        );
        if (category) {
          return and(
            available,
            inArray(
              productosTable.idTalleXCategoria,
              db
                .select({ id: tallesXCategoria.id })
                .from(tallesXCategoria)
                .leftJoin(categorias, eq(tallesXCategoria.idCategoria, categorias.id))
                .where(ilike(categorias.categoria, category))
            )
          );
        }
        return available;
      },
      orderBy: (productosTable, { desc }) => [desc(productosTable.id)],
      limit: limit,
      offset: offset,
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
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(productos)
      .innerJoin(estados, eq(productos.idEstado, estados.id))
      .where(
        and(
          eq(estados.estado, "Disponible"),
          category
            ? inArray(
                productos.idTalleXCategoria,
                db
                  .select({ id: tallesXCategoria.id })
                  .from(tallesXCategoria)
                  .leftJoin(categorias, eq(tallesXCategoria.idCategoria, categorias.id))
                  .where(ilike(categorias.categoria, category))
              )
            : undefined
        )
      ),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  return {
    products: productsResult as ProductoConRelaciones[],
    total,
  };
}

export async function getFeaturedProductsCore(): Promise<(ProductoConRelaciones | null)[]> {
  const rawFeatured = (await db.query.productos.findMany({
    where: (productos, { eq }) => eq(productos.destacado, true),
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

  const featuredArray: (ProductoConRelaciones | null)[] = Array(5).fill(null);
  rawFeatured.forEach((prod) => {
    if (prod.destacadoPos !== null && prod.destacadoPos >= 1 && prod.destacadoPos <= 5) {
      featuredArray[prod.destacadoPos - 1] = prod;
    }
  });

  return featuredArray;
}

export async function getAllProductsCore(): Promise<ProductoConRelaciones[]> {
  return (await db.query.productos.findMany({
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

interface ProductPayload {
  name: string;
  category: string;
  size: string;
  color: string;
  descriptionSummary: string;
  specificMeasurements: string;
  status: string;
  photoUrls: string[];
  featured: boolean;
  featuredPos?: string | null;
}

export async function createProductCore(data: ProductPayload) {
  const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls, featured, featuredPos } = data;
  const parsedPos = featured && featuredPos ? parseInt(featuredPos, 10) : null;

  const result = await db.transaction(async (tx) => {
    // 1. Obtener ID de relación talle x categoría
    const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

    // 2. Obtener el ID del estado en español
    const est = await tx.query.estados.findFirst({
      where: eq(estados.estado, status),
    });
    const estadoId = est ? est.id : 1; // Fallback al id 1 si no se encuentra

    // Clear conflict on position (if set)
    if (parsedPos !== null) {
      await tx.update(productos)
        .set({ destacado: false, destacadoPos: null })
        .where(eq(productos.destacadoPos, parsedPos));
    }

    // 3. Insertar el Producto
    const [productoCreado] = await tx.insert(productos).values({
      nombre: name,
      destacado: featured,
      destacadoPos: parsedPos,
      idTalleXCategoria: talleXCategoriaId,
      cantidad: 1,
      idEstado: estadoId,
      color,
      descripcion: descriptionSummary,
      medidasEspecificas: specificMeasurements,
    }).returning();

    // 4. Insertar las imágenes
    if (photoUrls.length > 0) {
      await tx.insert(imagenes).values(
        photoUrls.map((url) => ({
          url,
          idProducto: productoCreado.id,
        }))
      );
    }

    return productoCreado;
  });

  return result;
}

export async function updateProductCore(id: number, data: ProductPayload) {
  const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls, featured, featuredPos } = data;
  const parsedPos = featured && featuredPos ? parseInt(featuredPos, 10) : null;

  await db.transaction(async (tx) => {
    // 1. Obtener ID de relación talle x categoría
    const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

    // 2. Obtener el ID del estado en español
    const est = await tx.query.estados.findFirst({
      where: eq(estados.estado, status),
    });
    const estadoId = est ? est.id : 1;

    // Clear conflict on position (if set)
    if (parsedPos !== null) {
      await tx.update(productos)
        .set({ destacado: false, destacadoPos: null })
        .where(and(
          eq(productos.destacadoPos, parsedPos),
          sql`${productos.id} != ${id}`
        ));
    }

    // 3. Actualizar el Producto
    await tx.update(productos).set({
      nombre: name,
      destacado: featured,
      destacadoPos: parsedPos,
      idTalleXCategoria: talleXCategoriaId,
      idEstado: estadoId,
      color,
      descripcion: descriptionSummary,
      medidasEspecificas: specificMeasurements,
    }).where(eq(productos.id, id));

    // 4. Actualizar imágenes (borrar existentes e insertar nuevas)
    await tx.delete(imagenes).where(eq(imagenes.idProducto, id));
    if (photoUrls.length > 0) {
      await tx.insert(imagenes).values(
        photoUrls.map((url) => ({
          url,
          idProducto: id,
        }))
      );
    }
  });
}

export async function deleteProductCore(id: number) {
  // La eliminación de imágenes se hace por cascada a nivel DB
  await db.delete(productos).where(eq(productos.id, id));
}

export async function getProductsByIdsCore(ids: number[]): Promise<ProductoConRelaciones[]> {
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

export async function getFormMetadata() {
  const allCategories = await db.select().from(categorias);
  const allStatuses = await db.select().from(estados);
  const allTallesXCategoria = await db.query.tallesXCategoria.findMany({
    with: {
      talle: true,
      categoria: true,
    },
  });
  const featuredProds = await db.query.productos.findMany({
    where: (productos, { eq }) => eq(productos.destacado, true),
  });

  return {
    categories: allCategories.map((c) => c.categoria),
    statuses: allStatuses.map((s) => s.estado),
    categorySizes: allTallesXCategoria.map((tc) => ({
      category: tc.categoria.categoria,
      size: tc.talle.talle,
    })),
    featuredProducts: featuredProds.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      destacadoPos: p.destacadoPos,
    })),
  };
}

export {
  getAvailableProductsCore as getAvailableProducts,
  getFeaturedProductsCore as getFeaturedProducts,
  getProductByIdCore as getProductById,
  getProductsByIdsCore as getProductsByIds,
  getAllProductsCore as getAllProducts,
  createProductCore as createProduct,
  updateProductCore as updateProduct,
  deleteProductCore as deleteProduct,
  getCategoriesCore as getCategories
};

