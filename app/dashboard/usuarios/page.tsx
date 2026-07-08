import { getUsuarios } from "@/lib/services/usuariosCore";
import { UsuariosABMClient, type UsuarioWithRol } from "@/components/admin/UsuariosABMClient";

export default async function UsuariosPage() {
  const users = await getUsuarios();

  return (
    <UsuariosABMClient initialUsers={users as UsuarioWithRol[]} />
  );
}
