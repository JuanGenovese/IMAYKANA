import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Navbar superior fija */}
            <SiteHeader />

            {/* Contenedor principal desplazado hacia abajo para no ser solapado */}
            <div className="flex flex-1 pt-[60px] sm:pt-[64px]">
                <SidebarProvider defaultOpen={true}>
                    {/* El sidebar empieza debajo de la navbar en desktop y estira dinámicamente */}
                    <AppSidebar className="!top-[60px] sm:!top-[64px] !bottom-0 !h-auto" />

                    <main className="flex-1 p-6 sm:p-8 lg:p-10">
                        {children}
                    </main>
                </SidebarProvider>
            </div>
        </div>
    );
}