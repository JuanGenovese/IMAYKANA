"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { categorias, talles, tallesXCategoria, productos, estados } from "@/lib/db/schema";
import { eq, and, inArray, notInArray } from "drizzle-orm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { obtenerUsuarioPorId } from "@/actions/usuarios";

async function verifyStrictAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sin autorización");

  const userProfile = await obtenerUsuarioPorId(user.id);
  if (
    !userProfile.success ||
    !userProfile.usuario ||
    userProfile.usuario.rol.toLowerCase() !== "admin"
  ) {
    throw new Error("Sin autorización");
  }
}

type TxOrDb = typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];

async function obtenerOCrearTalles(txOrDb: TxOrDb, tallesList: string[]): Promise<number[]> {
  const talleIds: number[] = [];
  for (const t of tallesList) {
    const cleanedT = t.trim();
    if (!cleanedT) continue;
    let sz = await txOrDb.query.talles.findFirst({
      where: eq(talles.talle, cleanedT),
    });
    if (!sz) {
      const [newSz] = await txOrDb.insert(talles).values({ talle: cleanedT }).returning();
      sz = newSz;
    }
    talleIds.push(sz.id);
  }
  return talleIds;
}

function manejarErrorCategorias(error: unknown, accion: string) {
  console.error(`Error al ${accion} categoría:`, error);
  const err = error as { code?: string; message?: string };
  if (err.code === "23505") {
    return { error: "La categoría ya existe." };
  }
  return { error: err.message || `Error al ${accion} la categoría.` };
}

import { compactFeaturedPositions } from "@/lib/services/productosCore";

async function desvincularProductosAfectados(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  affectedProducts: { id: number; nombre: string }[]
): Promise<void> {
  if (affectedProducts.length === 0) return;

  let noDisp = await tx.query.estados.findFirst({
    where: eq(estados.estado, "No disponible"),
  });
  if (!noDisp) {
    const [newEst] = await tx.insert(estados).values({ estado: "No disponible" }).returning();
    noDisp = newEst;
  }

  const affectedProductIds = affectedProducts.map((p) => p.id);
  await tx
    .update(productos)
    .set({ idTalleXCategoria: null, idEstado: noDisp.id, destacado: false, destacadoPos: null })
    .where(inArray(productos.id, affectedProductIds));

  await compactFeaturedPositions(tx);
}

export async function crearCategoria(nombre: string, tallesList: string[]) {
  try {
    await verifyStrictAdmin();
    const cleaned = nombre.trim();
    if (!cleaned) return { error: "El nombre no puede estar vacío" };
    if (!tallesList || tallesList.length === 0) {
      return { error: "Tenés que agregar al menos un talle para esta categoría." };
    }

    const populatedCat = await db.transaction(async (tx) => {
      // 1. Insertar la categoría
      const [nueva] = await tx
        .insert(categorias)
        .values({ categoria: cleaned })
        .returning();

      // 2. Para cada talle en tallesList, buscar o crear
      const talleIds = await obtenerOCrearTalles(tx, tallesList);

      if (talleIds.length === 0) {
        throw new Error("Tenés que agregar al menos un talle válido.");
      }

      // 3. Insertar relaciones tallesXCategoria
      await tx.insert(tallesXCategoria).values(
        talleIds.map((idTalle) => ({
          idCategoria: nueva.id,
          idTalle,
        }))
      );

      return {
        id: nueva.id,
        categoria: nueva.categoria,
        talles: tallesList.map((t, idx) => ({ id: talleIds[idx], talle: t })),
      };
    });

    revalidatePath("/dashboard/categorias");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, categoria: populatedCat };
  } catch (error) {
    return manejarErrorCategorias(error, "crear");
  }
}

export async function actualizarCategoria(
  id: number,
  nombre: string,
  tallesList: string[],
  confirmDesvincular?: boolean
) {
  try {
    await verifyStrictAdmin();
    const cleaned = nombre.trim();
    if (!cleaned) return { error: "El nombre no puede estar vacío" };
    if (!tallesList || tallesList.length === 0) {
      return { error: "Tenés que agregar al menos un talle para esta categoría." };
    }

    // 1. Obtener o crear talles de la nueva lista
    const talleIds = await obtenerOCrearTalles(db, tallesList);

    // 2. Verificar si hay productos que se verían afectados (talles removidos)
    const affectedProducts = await db
      .select({ id: productos.id, nombre: productos.nombre })
      .from(productos)
      .innerJoin(tallesXCategoria, eq(productos.idTalleXCategoria, tallesXCategoria.id))
      .where(
        and(
          eq(tallesXCategoria.idCategoria, id),
          notInArray(tallesXCategoria.idTalle, talleIds)
        )
      );

    if (affectedProducts.length > 0 && !confirmDesvincular) {
      return {
        success: false,
        requiresConfirmation: true,
        affectedCount: affectedProducts.length,
        productos: affectedProducts,
      };
    }

    // 3. Ejecutar actualización en transacción
    const populatedCat = await db.transaction(async (tx) => {
      // Actualizar nombre
      const [actualizada] = await tx
        .update(categorias)
        .set({ categoria: cleaned })
        .where(eq(categorias.id, id))
        .returning();

      // Si confirmDesvincular, desvincular productos afectados
      if (confirmDesvincular) {
        await desvincularProductosAfectados(tx, affectedProducts);
      }

      // Eliminar las asociaciones antiguas de talles_x_categoria de esta categoría
      await tx.delete(tallesXCategoria).where(eq(tallesXCategoria.idCategoria, id));

      // Insertar las nuevas relaciones
      await tx.insert(tallesXCategoria).values(
        talleIds.map((idTalle) => ({
          idCategoria: id,
          idTalle,
        }))
      );

      return {
        id: actualizada.id,
        categoria: actualizada.categoria,
        talles: tallesList.map((t, idx) => ({ id: talleIds[idx], talle: t })),
      };
    });

    revalidatePath("/dashboard/categorias");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, categoria: populatedCat };
  } catch (error) {
    return manejarErrorCategorias(error, "actualizar");
  }
}

export async function eliminarCategoria(id: number, confirmDesvincular?: boolean) {
  try {
    await verifyStrictAdmin();

    // 1. Buscar si hay prendas usando esta categoría
    const affectedProducts = await db
      .select({ id: productos.id, nombre: productos.nombre })
      .from(productos)
      .innerJoin(tallesXCategoria, eq(productos.idTalleXCategoria, tallesXCategoria.id))
      .where(eq(tallesXCategoria.idCategoria, id));

    if (affectedProducts.length > 0 && !confirmDesvincular) {
      return {
        success: false,
        requiresConfirmation: true,
        affectedCount: affectedProducts.length,
        productos: affectedProducts,
      };
    }

    await db.transaction(async (tx) => {
      if (confirmDesvincular) {
        await desvincularProductosAfectados(tx, affectedProducts);
      }

      await tx.delete(categorias).where(eq(categorias.id, id));
    });

    revalidatePath("/dashboard/categorias");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return manejarErrorCategorias(error, "eliminar");
  }
}
