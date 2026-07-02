import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { obtenerUsuarioPorId } from "@/actions/usuarios";
import { db } from "@/lib/db";
import { CategoriasABMClient } from "@/components/admin/categorias-client";

export const metadata = {
  title: "Categorías — Panel de Administración",
};

export default async function CategoriasPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verificar el rol del usuario en la base de datos local
  const userProfile = await obtenerUsuarioPorId(user.id);
  if (!userProfile.success || !userProfile.usuario) {
    redirect("/api/auth/logout");
  }

  const rol = userProfile.usuario.rol.toLowerCase();

  // Solamente los administradores pueden gestionar categorías
  if (rol !== "admin") {
    redirect("/dashboard");
  }

  // Obtener categorías reales de la base de datos enriquecidas con sus talles
  const categoriesRaw = await db.query.categorias.findMany({
    with: {
      tallesXCategoria: {
        with: {
          talle: true,
        },
      },
    },
  });

  const categories = categoriesRaw.map((c) => ({
    id: c.id,
    categoria: c.categoria,
    talles: c.tallesXCategoria.map((tc) => tc.talle),
  }));

  return <CategoriasABMClient initialCategories={categories} />;
}
