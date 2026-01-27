"use client";

import Link from "next/link";
import { Sparkles, ShoppingBag, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b bg-glass">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/15">
            <Sparkles className="size-5 text-primary" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">
              IMAYKANA
            </span>
            <span className="block text-xs text-muted-foreground">
              catálogo de moda
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/productos" className="hover:text-foreground">
            Productos
          </Link>
          <Link href="/#marca" className="hover:text-foreground">
            La marca
          </Link>
          <Link href="/#como-comprar" className="hover:text-foreground">
            Cómo comprar
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/productos" className="gap-2">
              <ShoppingBag className="size-4" />
              Ver catálogo
            </Link>
          </Button>

          <Button asChild variant="ghost" size="icon" aria-label="Carrito">
            <Link href="/carrito">
              <span className="relative">
                <ShoppingCart className="size-5" />
                {count > 0 ? (
                  <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {count > 99 ? "99+" : count}
                  </span>
                ) : null}
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

