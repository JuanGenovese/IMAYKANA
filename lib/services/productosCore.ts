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
import { eq, and, inArray } from "drizzle-orm";

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

export async function getAvailableProductsCore(): Promise<ProductoConRelaciones[]> {
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

export async function getFeaturedProductsCore(limit?: number): Promise<ProductoConRelaciones[]> {
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
}

export async function createProductCore(data: ProductPayload) {
  const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls, featured } = data;

  const result = await db.transaction(async (tx) => {
    // 1. Obtener ID de relación talle x categoría
    const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

    // 2. Obtener el ID del estado en español
    const est = await tx.query.estados.findFirst({
      where: eq(estados.estado, status),
    });
    const estadoId = est ? est.id : 1; // Fallback al id 1 si no se encuentra

    // 3. Insertar el Producto
    const [productoCreado] = await tx.insert(productos).values({
      nombre: name,
      destacado: featured,
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
  const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls, featured } = data;

  await db.transaction(async (tx) => {
    // 1. Obtener ID de relación talle x categoría
    const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

    // 2. Obtener el ID del estado en español
    const est = await tx.query.estados.findFirst({
      where: eq(estados.estado, status),
    });
    const estadoId = est ? est.id : 1;

    // 3. Actualizar el Producto
    await tx.update(productos).set({
      nombre: name,
      destacado: featured,
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

  return {
    categories: allCategories.map((c) => c.categoria),
    statuses: allStatuses.map((s) => s.estado),
    categorySizes: allTallesXCategoria.map((tc) => ({
      category: tc.categoria.categoria,
      size: tc.talle.talle,
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
  deleteProductCore as deleteProduct
};

