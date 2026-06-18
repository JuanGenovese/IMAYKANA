import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SiteHeader } from "@/components/store/site-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { obtenerUsuarioPorId } from "@/actions/usuarios";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Si no está autenticado en Supabase, va al login
    if (!user) {
        redirect("/login");
    }

    // Verificar si el usuario existe en la base de datos local
    const userProfile = await obtenerUsuarioPorId(user.id);
    if (!userProfile.success || !userProfile.usuario) {
        // Redirigir al endpoint de logout para limpiar la sesión y cookies
        redirect("/api/auth/logout");
    }

    const rol = userProfile.usuario.rol.toLowerCase();

    // Si el rol es cliente, redirigir a la tienda
    if (rol === "cliente") {
        redirect("/productos");
    }

    // Por seguridad, si no es administrador ni vendedor, denegar el acceso al dashboard
    if (rol !== "admin" && rol !== "vendedor") {
        redirect("/productos");
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Navbar superior fija */}
            <SiteHeader />

            {/* Contenedor principal desplazado hacia abajo para no ser solapado */}
            <div className="flex flex-1 pt-[60px] sm:pt-[64px]">
                <SidebarProvider defaultOpen={true}>
                    {/* El sidebar empieza debajo de la navbar en desktop y estira dinámicamente */}
                    <AppSidebar rol={rol} className="!top-[60px] sm:!top-[64px] !bottom-0 !h-auto" />

                    <main className="flex-1 p-6 sm:p-8 lg:p-10">
                        {children}
                    </main>
                </SidebarProvider>
            </div>
        </div>
    );
}