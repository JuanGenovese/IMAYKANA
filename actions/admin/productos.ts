"use server";

import { db } from "@/lib/db";
import { productos, imagenes, categorias, talles, tallesXCategoria, estados } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const productoSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  category: z.string().min(1, "La categoría es obligatoria"),
  size: z.string().min(1, "El talle es obligatorio"),
  color: z.string().min(1, "El color es obligatorio"),
  descriptionSummary: z.string().default(""),
  specificMeasurements: z.string().default(""),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]).default("AVAILABLE"),
  photoUrls: z.array(z.string().url()).default([]),
});

async function verifyAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sin autorización");
}

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

export async function crearProducto(data: unknown) {
  await verifyAdmin();
  const parsed = productoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls } = parsed.data;

  try {
    const result = await db.transaction(async (tx) => {
      // 1. Obtener ID de relación talle x categoría
      const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

      // 2. Obtener el ID del estado
      const est = await tx.query.estados.findFirst({
        where: eq(estados.estado, status),
      });
      const estadoId = est ? est.id : 1; // Default a 1 (AVAILABLE) si por alguna razón no existe

      // 3. Insertar el Producto
      const [productoCreado] = await tx.insert(productos).values({
        nombre: name,
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

    revalidatePath("/dashboard/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error al crear producto:", error);
    return { error: { _form: ["Error al guardar el producto en la base de datos."] } };
  }
}

export async function actualizarProducto(id: number, data: unknown) {
  await verifyAdmin();
  const parsed = productoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { name, category, size, color, descriptionSummary, specificMeasurements, status, photoUrls } = parsed.data;

  try {
    await db.transaction(async (tx) => {
      // 1. Obtener ID de relación talle x categoría
      const talleXCategoriaId = await getOrCreateTalleXCategoria(tx, category, size);

      // 2. Obtener el ID del estado
      const est = await tx.query.estados.findFirst({
        where: eq(estados.estado, status),
      });
      const estadoId = est ? est.id : 1;

      // 3. Actualizar el Producto
      await tx.update(productos).set({
        nombre: name,
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

    revalidatePath("/dashboard/productos");
    revalidatePath(`/productos/${id}`);
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return { error: { _form: ["Error al actualizar el producto en la base de datos."] } };
  }
}

export async function eliminarProducto(id: number) {
  await verifyAdmin();
  try {
    // La eliminación de imágenes se hace por cascada a nivel DB
    await db.delete(productos).where(eq(productos.id, id));

    revalidatePath("/dashboard/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { error: "No se pudo eliminar el producto." };
  }
}
