"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Menu, 
  X, 
  LogOut,
  Users,
  Shield,
  CreditCard,
  Tag,
  Ruler,
  GitFork,
  Activity
} from "lucide-react";
import { createSupabaseClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/roles", label: "Roles", icon: Shield },
  { href: "/dashboard/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/metodos-pago", label: "Métodos de Pago", icon: CreditCard },
  { href: "/dashboard/categorias", label: "Categorías", icon: Tag },
  { href: "/dashboard/talles", label: "Talles", icon: Ruler },
  { href: "/dashboard/talles-categorias", label: "Talles x Categoría", icon: GitFork },
  { href: "/dashboard/estados", label: "Estados", icon: Activity },
];

interface AdminNavProps {
  userEmail?: string;
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Desktop Sidebar (visible on lg screens, hidden on mobile) */}
      <aside className="hidden w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-16 items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-lg font-bold tracking-tight text-gray-900">
              IMAYKANA
            </span>
            <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
              Admin
            </span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1.5 p-4 pt-5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <p className="truncate px-3 py-1 text-xs font-medium text-gray-400">
            {userEmail}
          </p>
        </div>
      </aside>

      {/* Mobile Top Header (visible on mobile, hidden on lg screens) */}
      <div className="lg:hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5">
          <button
            type="button"
            onClick={toggleMenu}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="text-sm font-bold text-gray-900 tracking-tight hover:opacity-80 transition-opacity">
            IMAYKANA Admin
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Navigation Drawer Overlay (Backdrop) */}
        <div
          onClick={toggleMenu}
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Mobile Navigation Drawer Panel */}
        <aside
          className={`fixed top-0 bottom-0 left-0 w-64 bg-white shadow-2xl z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex h-16 items-center justify-between px-5 border-b border-gray-100">
              <div className="flex items-center">
                <Link href="/" className="flex items-center hover:opacity-80 transition-opacity" onClick={toggleMenu}>
                  <span className="text-base font-bold tracking-tight text-gray-900">
                    IMAYKANA
                  </span>
                  <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
                    Admin
                  </span>
                </Link>
              </div>
              <button
                type="button"
                onClick={toggleMenu}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1.5 p-4 pt-5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={toggleMenu}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="border-t border-gray-100 p-4 flex flex-col gap-3">
            <p className="truncate px-3 text-xs font-medium text-gray-400">
              {userEmail}
            </p>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
