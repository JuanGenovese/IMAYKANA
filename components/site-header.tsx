"use client";

import Link from "next/link";
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState } from "react";
import { type User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { createSupabaseClient } from "@/lib/supabase/client";

export function SiteHeader() {
  const { count } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseClient();
    
    // Obtener sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuchar cambios de estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3">
        <Link
          href="/"
          className="group flex items-center gap-2"
          onClick={() => {
            if (window.location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "instant" });
            }
          }}
        >
          <span className="leading-tight">
            <span className="block text-lg sm:text-xl font-serif font-bold tracking-normal">
              IMAYKANA
            </span>
            <span className="block text-[10px] sm:text-xs text-muted-foreground">
              moda circular
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground md:flex">
          <Link
            href="/productos"
            className="hover:text-foreground transition-colors"
          >
            Productos
          </Link>
          <Link
            href="/#marca"
            className="hover:text-foreground transition-colors"
          >
            La marca
          </Link>
          <Link
            href="/#como-comprar"
            className="hover:text-foreground transition-colors"
          >
            Cómo comprar
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:h-10 sm:w-10"
            aria-label="Carrito"
          >
            <Link href="/carrito">
              <span className="relative">
                <ShoppingCart className="size-4 sm:size-5" />
                {count > 0 ? (
                  <span className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 inline-flex min-w-4 sm:min-w-5 items-center justify-center rounded-full bg-primary px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-primary-foreground">
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </span>
            </Link>
          </Button>

          {!loading && user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 text-primary hover:text-primary/80 transition-colors"
                aria-label="Ir al Panel"
              >
                <Link href="/dashboard">
                  <LayoutDashboard className="size-4 sm:size-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-9 w-9 sm:h-10 sm:w-10 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                aria-label="Cerrar sesión"
              >
                <LogOut className="size-4 sm:size-5" />
              </Button>
            </>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:h-10 sm:w-10"
              aria-label="Iniciar sesión"
            >
              <Link href="/login">
                <UserIcon className="size-4 sm:size-5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
