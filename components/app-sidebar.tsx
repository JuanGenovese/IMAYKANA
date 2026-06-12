"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Users,
    GitFork,
    LogOut
} from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
    { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
    { href: "/dashboard/productos", label: "Productos", icon: Package },
    { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
    { href: "/dashboard/talles-categorias", label: "Talles", icon: GitFork },
];

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | undefined>();

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const supabase = createSupabaseClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <Sidebar side="left" variant="floating" collapsible="icon" className={className} {...props}>
            {/* Header con el branding de IMAYKANA */}
            <SidebarHeader className="border-b border-gray-100/50 p-4">
                <span className="font-serif text-lg font-bold tracking-wider text-gray-900 group-data-[collapsible=icon]:hidden">
                    Administracion
                </span>
            </SidebarHeader>

            {/* Contenido con navegación del Dashboard */}
            <SidebarContent className="p-2">
                <SidebarGroup>
                    <SidebarGroupContent className="mt-1">
                        <SidebarMenu className="gap-1">
                            {navItems.map(({ href, label, icon: Icon }) => {
                                const isActive =
                                    pathname === href ||
                                    (href !== "/dashboard" && pathname.startsWith(href));

                                return (
                                    <SidebarMenuItem key={href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={label}
                                            className={`w-full transition-all duration-200 rounded-lg ${isActive
                                                ? "bg-primary text-primary-foreground shadow-sm font-semibold hover:bg-primary/95"
                                                : "text-gray-600 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                                }`}
                                        >
                                            <Link href={href}>
                                                <Icon className="h-4 w-4 shrink-0" />
                                                <span>{label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer con información de sesión */}
            <SidebarFooter className="border-t border-gray-100/50 p-3 flex flex-col gap-2">
                {userEmail && (
                    <div className="px-3 py-1.5 rounded-lg bg-gray-50/50 border border-gray-100/40 max-w-full overflow-hidden group-data-[collapsible=icon]:hidden">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                            Sesión activa
                        </p>
                        <p className="text-xs font-semibold text-gray-700 truncate mt-0.5">
                            {userEmail}
                        </p>
                    </div>
                )}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleLogout}
                            tooltip="Cerrar sesión"
                            className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-lg"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}