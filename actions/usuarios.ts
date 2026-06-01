"use server";

import { db } from "@/lib/db";
import { usuarios } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
  } catch (error: any) {
    console.error("Error al crear usuario en la base de datos local:", error);

    // Postgres error code 23505 is for unique_violation
    if (error.code === "23505") {
      if (error.detail?.includes("email")) {
        return { success: false, error: "El correo electrónico ya está registrado." };
      }
      if (error.detail?.includes("n_dni")) {
        return { success: false, error: "El DNI ya está registrado." };
      }
    }

    return {
      success: false,
      error: error.message || "Error al registrar el perfil en la base de datos local.",
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
  } catch (error: any) {
    console.error("Error al obtener usuario de la base de datos:", error);
    return {
      success: false,
      error: error.message || "Error al obtener perfil desde la base de datos.",
    };
  }
}
