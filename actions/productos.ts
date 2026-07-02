"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { obtenerUsuarioPorId } from "@/actions/usuarios";
import { productoSchema } from "@/lib/schemas/productos";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByIds
} from "@/lib/services/productosCore";

async function verifyAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Sin autorización");

  const userProfile = await obtenerUsuarioPorId(user.id);
  if (
    !userProfile.success ||
    !userProfile.usuario ||
    (userProfile.usuario.rol !== "Admin" &&
      userProfile.usuario.rol !== "Vendedor")
  ) {
    throw new Error("Sin autorización");
  }
}

export async function crearProducto(data: unknown) {
  await verifyAdmin();
  const parsed = productoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    const productoCreado = await createProduct(parsed.data);

    revalidatePath("/dashboard/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, id: productoCreado.id };
  } catch (error) {
    console.error("Error al crear producto:", error);
    const msg = error instanceof Error ? error.message : "Error al guardar el producto en la base de datos.";
    return { error: { _form: [msg] } };
  }
}

export async function actualizarProducto(id: number, data: unknown) {
  await verifyAdmin();
  const parsed = productoSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateProduct(id, parsed.data);

    revalidatePath("/dashboard/productos");
    revalidatePath(`/productos/${id}`);
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    const msg = error instanceof Error ? error.message : "Error al actualizar el producto en la base de datos.";
    return { error: { _form: [msg] } };
  }
}

export async function eliminarProducto(id: number) {
  await verifyAdmin();
  try {
    await deleteProduct(id);

    revalidatePath("/dashboard/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { error: "No se pudo eliminar el producto." };
  }
}

export async function obtenerProductosPorIds(ids: number[]) {
  try {
    const products = await getProductsByIds(ids);
    return { success: true, products };
  } catch (error) {
    console.error("Error al obtener productos por ids:", error);
    return { success: false, error: "No se pudieron cargar los productos." };
  }
}
