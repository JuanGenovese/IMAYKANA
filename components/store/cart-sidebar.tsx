"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { X, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { obtenerProductosPorIds } from "@/actions/productos";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CartItemCard } from "@/components/store/cart-item-card";
import { CartSkeleton } from "@/components/store/cart-skeleton";
import { cn } from "@/lib/utils";
import type { ResolvedCartItem, Indice } from "@/components/providers/cart-provider";

export function CartSidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const { items, eliminarItem, limpiar, count, isOpen, closeCart } = useCart();
  const [resolvedProducts, setResolvedProducts] = useState<Indice>({});

  const productIdsStr = JSON.stringify(
    Array.from(
      new Set(
        items.map((item) => Number(item.productId)).filter((id) => !isNaN(id)),
      ),
    ).sort(),
  );

  useEffect(() => {
    const fetchCartProducts = async () => {
      const ids: number[] = JSON.parse(productIdsStr);
      if (ids.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await obtenerProductosPorIds(ids);
        if (res.success && res.products) {
          const productMap: Indice = {};
          for (const p of res.products) {
            productMap[p.id.toString()] = p;
          }
          setResolvedProducts(productMap);
        }
      } catch (err) {
        console.error("Error al buscar productos del carrito:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartProducts();
  }, [productIdsStr]);

  const resolved = items
    .map((it) => {
      const product = resolvedProducts[it.productId];
      if (!product) return null;
      return { ...it, product };
    })
    .filter(Boolean) as ResolvedCartItem[];

  const message =
    resolved.length === 0
      ? "Hola! Quiero hacer una consulta."
      : [
          "Hola! Quiero consultar disponibilidad y precio por estas prendas:",
          "",
          ...resolved.map((it) => {
            const talle = it.product.talleXCategoria?.talle?.talle ?? it.size;
            return `- ${it.product.nombre} (Ref: ${it.product.id}) | Talle: ${talle} | Color: ${it.product.color}`;
          }),
          "",
          "¿Me confirmás disponibilidad y retiro?",
        ].join("\n");

  const buyUrl = buildWhatsAppUrl(WHATSAPP_PHONE, message);

  // Escuchar la tecla Escape para cerrar el carrito
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 pointer-events-none flex justify-end transition-[visibility] duration-300",
        isOpen ? "visible" : "invisible delay-300"
      )}
    >
      {/* Contenedor del panel lateral */}
      <div
        className={cn(
          "w-full max-w-md bg-white border-l border-neutral-200/50 shadow-2xl flex flex-col pointer-events-auto transition-transform duration-300 ease-in-out h-full",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Cabecera del Carrito */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-neutral-800" />
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
              Mi Carrito
            </h2>
            {count > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="h-8 w-8 text-neutral-500 hover:text-neutral-950"
            aria-label="Cerrar carrito"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Cuerpo del Carrito */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {isLoading && items.length > 0 ? (
            <CartSkeleton />
          ) : resolved.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <p className="text-sm text-neutral-500">
                Tu carrito está vacío.
              </p>
              <Button onClick={closeCart} className="gap-2 text-sm">
                Seguir mirando
                <ArrowRight className="size-4" />
              </Button>
            </div>
          ) : (
            resolved.map((it) => (
              <CartItemCard
                key={`${it.productId}:${it.size}`}
                item={it}
                onEliminar={eliminarItem}
              />
            ))
          )}
        </div>

        {/* Pie del Carrito */}
        {resolved.length > 0 && (
          <div className="border-t border-neutral-100 bg-neutral-50/50 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">Items seleccionados</span>
              <span className="font-semibold text-neutral-900">{count} prenda(s)</span>
            </div>
            
            <Separator className="bg-neutral-200/50" />

            <div className="space-y-2">
              <Button asChild className="w-full h-11 text-sm font-medium">
                <a href={buyUrl} target="_blank" rel="noreferrer" onClick={closeCart}>
                  Consultar disponibilidad por WhatsApp
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 text-sm border-neutral-200 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                onClick={limpiar}
              >
                <Trash2 className="size-4 mr-2" />
                Vaciar carrito
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
