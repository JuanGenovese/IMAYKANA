"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    Users,
    LogOut,
    FolderOpen
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
import { toast } from "sonner";
import { LogoutConfirmModal } from "@/components/LogoutConfirmModal";

const navItems = [
    { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
    { href: "/dashboard/productos", label: "Productos", icon: Package },
    { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
    { href: "/dashboard/categorias", label: "Categorías", icon: FolderOpen },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    rol?: string;
}

export function AppSidebar({ rol, className, ...props }: AppSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | undefined>();

    const filteredNavItems = navItems.filter((item) => {
        if (item.href === "/dashboard/categorias" && rol?.toLowerCase() !== "admin") {
            return false;
        }
        return true;
    });

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

    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    const handleConfirmLogout = async () => {
        setIsLogoutConfirmOpen(false);
        const supabase = createSupabaseClient();
        await supabase.auth.signOut();
        toast.success("Sesión cerrada correctamente.");
        router.push("/login");
        router.refresh();
    };

    return (
        <>
            <Sidebar side="left" variant="floating" collapsible="icon" className={className} {...props}>
                <SidebarHeader className="border-b border-sidebar-border/50 p-4">
                    <span className="font-serif text-lg font-bold tracking-wider text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        Administración
                    </span>
                </SidebarHeader>

            <SidebarContent className="p-2">
                <SidebarGroup>
                    <SidebarGroupContent className="mt-1">
                        <SidebarMenu className="gap-1">
                            {filteredNavItems.map(({ href, label, icon: Icon }) => {
                                const isActive =
                                    pathname === href ||
                                    (href !== "/dashboard" && pathname.startsWith(href));

                                return (
                                    <SidebarMenuItem key={href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={label}
                                            className={`w-full transition-all duration-200 ease-brand rounded-lg ${isActive
                                                ? "bg-primary text-primary-foreground shadow-sm font-semibold hover:bg-primary/95"
                                                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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

            <SidebarFooter className="border-t border-sidebar-border/50 p-3 flex flex-col gap-2">
                {userEmail && (
                    <div className="px-3 py-1.5 rounded-lg bg-sidebar-accent/50 border border-sidebar-border/40 max-w-full overflow-hidden group-data-[collapsible=icon]:hidden">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            Sesión activa
                        </p>
                        <p className="text-xs font-semibold text-sidebar-foreground truncate mt-0.5">
                            {userEmail}
                        </p>
                    </div>
                )}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => setIsLogoutConfirmOpen(true)}
                            tooltip="Cerrar sesión"
                            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 ease-brand rounded-lg"
                        >
                            <LogOut className="h-4 w-4 shrink-0" />
                            <span>Cerrar sesión</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>

        <LogoutConfirmModal
            isOpen={isLogoutConfirmOpen}
            onClose={() => setIsLogoutConfirmOpen(false)}
            onConfirm={handleConfirmLogout}
            description="Vas a salir del panel de administración y volver a la pantalla de inicio de sesión."
        />
    </>
    );
}
