"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { obtenerUsuarioPorId } from "@/actions/usuarios";
import { productoSchema } from "./Schemas/productosSchemas";
import {
  createProductCore,
  updateProductCore,
  deleteProductCore
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
    const productoCreado = await createProductCore(parsed.data);

    revalidatePath("/dashboard/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true, id: productoCreado.id };
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

  try {
    await updateProductCore(id, parsed.data);

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
    await deleteProductCore(id);

    revalidatePath("/dashboard/productos");
    revalidatePath("/productos");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { error: "No se pudo eliminar el producto." };
  }
}
