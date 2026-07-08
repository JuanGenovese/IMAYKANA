"use server";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { updateUsuarioCore, deleteUsuarioCore } from "@/lib/services/usuariosCore";
import { revalidatePath } from "next/cache";

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

export async function crearUsuario(data: {
  id: string;
  nombre: string;
  apellido: string;
  nDni: string;
  email: string;
  idRol: number;
  solicitudVendedor: boolean;
}) {
  try {
    const [nuevoUsuario] = await db
      .insert(usuarios)
      .values({
        id: data.id,
        nombre: data.nombre,
        apellido: data.apellido,
        nDni: data.nDni,
        email: data.email,
        idRol: data.idRol,
        solicitudVendedor: data.solicitudVendedor,
      })
      .returning();

    return { success: true, usuario: nuevoUsuario };
  } catch (error) {
    console.error("Error al crear usuario en la base de datos local:", error);
    const err = error as { code?: string; detail?: string; message?: string };

    // Postgres error code 23505 is for unique_violation
    if (err.code === "23505") {
      if (err.detail?.includes("email")) {
        return { success: false, error: "El correo electrónico ya está registrado." };
      }
      if (err.detail?.includes("n_dni")) {
        return { success: false, error: "El DNI ya está registrado." };
      }
    }

    return {
      success: false,
      error: err.message || "Error al registrar el perfil en la base de datos local.",
    };
  }
}

export async function obtenerUsuarioPorId(id: string) {
  try {
    const user = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
      with: {
        rol: true,
      },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado en la base de datos local." };
    }

    return {
      success: true,
      usuario: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        rol: user.rol.rol,
      },
    };
  } catch (error) {
    console.error("Error al obtener usuario de la base de datos:", error);
    const err = error as { message?: string };
    return {
      success: false,
      error: err.message || "Error al obtener perfil desde la base de datos.",
    };
  }
}

export async function actualizarUsuario(
  id: string,
  data: {
    nombre: string;
    apellido: string;
    nDni: string;
    email: string;
    idRol: number;
    solicitudVendedor: boolean;
  }
) {
  await verifyAdmin();
  try {
    await updateUsuarioCore(id, data);
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    const err = error as { code?: string; detail?: string; message?: string };
    if (err.code === "23505") {
      if (err.detail?.includes("email")) {
        return { success: false, error: "El correo electrónico ya está registrado." };
      }
      if (err.detail?.includes("n_dni")) {
        return { success: false, error: "El DNI ya está registrado." };
      }
    }
    return { success: false, error: err.message || "Error al actualizar el usuario." };
  }
}

export async function eliminarUsuario(id: string) {
  await verifyAdmin();
  try {
    await deleteUsuarioCore(id);
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, error: "No se pudo eliminar el usuario." };
  }
}

export async function cambiarRolUsuario(id: string, idRol: number) {
  await verifyAdmin();
  try {
    const userResult = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    });
    if (!userResult) {
      return { success: false, error: "Usuario no encontrado." };
    }
    await updateUsuarioCore(id, {
      nombre: userResult.nombre,
      apellido: userResult.apellido,
      nDni: userResult.nDni,
      email: userResult.email,
      idRol,
      solicitudVendedor: userResult.solicitudVendedor,
    });
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error al cambiar rol:", error);
    return { success: false, error: "No se pudo cambiar el rol." };
  }
}

export async function procesarSolicitudVendedor(id: string, aprobar: boolean) {
  await verifyAdmin();
  try {
    const userResult = await db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    });
    if (!userResult) {
      return { success: false, error: "Usuario no encontrado." };
    }

    const nuevoRol = aprobar ? 2 : userResult.idRol; // 2 es Vendedor
    await updateUsuarioCore(id, {
      nombre: userResult.nombre,
      apellido: userResult.apellido,
      nDni: userResult.nDni,
      email: userResult.email,
      idRol: nuevoRol,
      solicitudVendedor: false,
    });
    revalidatePath("/dashboard/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error al procesar solicitud:", error);
    return { success: false, error: "No se pudo procesar la solicitud." };
  }
}

