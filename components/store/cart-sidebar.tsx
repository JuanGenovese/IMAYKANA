"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, ShoppingCart, Trash2, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { obtenerProductosPorIds } from "@/actions/productos";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CartItemCard } from "@/components/store/cart-item-card";
import { CartSkeleton } from "@/components/store/cart-skeleton";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import type { ResolvedCartItem, Indice } from "@/components/providers/cart-provider";

export function CartSidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const { items, eliminarItem, limpiar, count, isOpen, closeCart } = useCart();
  const [resolvedProducts, setResolvedProducts] = useState<Indice>({});
  const [showPreview, setShowPreview] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

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
        toast.error("No pudimos cargar los productos del carrito. Intentá de nuevo.");
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

  const totalPrice = resolved.reduce((acc, it) => {
    return acc + (it.product.precio ?? 0) * it.quantity;
  }, 0);

  const message =
    resolved.length === 0
      ? "Hola! Vengo desde la pagina web! Quiero hacer una consulta."
      : [
          "Hola! Vengo desde la pagina web!",
          "Quiero consultar disponibilidad y precio por estas prendas:",
          "",
          ...resolved.map((it) => {
            const talle = it.product.talleXCategoria?.talle?.talle ?? it.size;
            return `- ${it.product.nombre} | Talle: ${talle} | Color: ${it.product.color}`;
          }),
          "",
          "¿Me confirmás disponibilidad y retiro?",
        ].join("\n");

  const buyUrl = buildWhatsAppUrl(WHATSAPP_PHONE, message);

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

  const handleLimpiar = () => {
    setIsClearConfirmOpen(true);
  };

  const handleConfirmLimpiar = () => {
    setIsClearConfirmOpen(false);
    limpiar();
    toast.success("Carrito vaciado.");
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 flex justify-end transition-[visibility] duration-300 ease-brand",
          isOpen ? "visible" : "invisible delay-300"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-brand",
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onClick={closeCart}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
          className={cn(
            "w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col pointer-events-auto transition-transform duration-300 ease-brand h-full relative z-10",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-5 text-foreground" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
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
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Cerrar carrito"
            >
              <X className="size-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {isLoading && items.length > 0 ? (
              <CartSkeleton />
            ) : resolved.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
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

          {resolved.length > 0 && (
            <div className="border-t border-border bg-muted/50 p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Items seleccionados</span>
                <span className="font-semibold text-foreground">{count} prenda(s)</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold text-base text-foreground">
                  {totalPrice > 0 ? formatPrice(totalPrice) : "A consultar"}
                </span>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-2">
                <div className="space-y-2">
                  <Button asChild className="w-full h-11 text-sm font-medium">
                    <a href={buyUrl} target="_blank" rel="noreferrer" onClick={closeCart}>
                      Consultar disponibilidad por WhatsApp
                    </a>
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowPreview((p) => !p)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 ease-brand mx-auto"
                    aria-expanded={showPreview}
                  >
                    <ChevronDown className={cn("size-3 transition-transform duration-200 ease-brand", showPreview && "rotate-180")} />
                    {showPreview ? "Ocultar" : "Ver"} resumen del mensaje
                  </button>

                  {showPreview && (
                    <pre className="text-xs text-muted-foreground bg-background p-3 rounded-lg border border-border whitespace-pre-wrap max-h-32 overflow-y-auto animate-fade-in">
                      {message}
                    </pre>
                  )}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 text-sm"
                  onClick={handleLimpiar}
                >
                  <Trash2 className="size-4 mr-2" />
                  Vaciar carrito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isClearConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-[fade-in_0.2s_ease-out_forwards]"
            onClick={() => setIsClearConfirmOpen(false)}
          />
          <div className="relative z-10 w-[90%] max-w-[360px] bg-background border border-border p-6 rounded-2xl shadow-2xl flex flex-col gap-4 animate-[slide-up_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold tracking-tight text-foreground">
                ¿Vaciar carrito?
              </h3>
              <p className="text-sm text-muted-foreground leading-normal">
                Se van a eliminar todos los productos seleccionados de tu carrito. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 text-sm font-medium rounded-xl"
                onClick={() => setIsClearConfirmOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="h-10 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95"
                onClick={handleConfirmLimpiar}
              >
                Vaciar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
