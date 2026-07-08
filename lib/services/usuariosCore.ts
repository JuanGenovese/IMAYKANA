import { db } from "@/lib/db";
import { usuarios } from "@/lib/db/schema/usuarios";
import { eq } from "drizzle-orm";

export const getUsuarios = async () => {
    return (
        await db.query.usuarios.findMany({
            with: {
                rol: true,
            },
            orderBy: (usuarios, { desc }) => [desc(usuarios.id)]
        })
    )
}

export const updateUsuarioCore = async (
    id: string,
    data: {
        nombre: string;
        apellido: string;
        nDni: string;
        email: string;
        idRol: number;
        solicitudVendedor: boolean;
    }
) => {
    const [updated] = await db
        .update(usuarios)
        .set({
            nombre: data.nombre,
            apellido: data.apellido,
            nDni: data.nDni,
            email: data.email,
            idRol: data.idRol,
            solicitudVendedor: data.solicitudVendedor,
        })
        .where(eq(usuarios.id, id))
        .returning();
    return updated;
}

export const deleteUsuarioCore = async (id: string) => {
    const [deleted] = await db
        .delete(usuarios)
        .where(eq(usuarios.id, id))
        .returning();
    return deleted;
}