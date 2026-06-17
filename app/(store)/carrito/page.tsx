"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { obtenerProductosPorIds } from "@/actions/productos";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { CartItemCard } from "@/components/store/cart-item-card";
import { CartSummary } from "@/components/store/cart-summary";
import { CartSkeleton } from "@/components/store/cart-skeleton";
import type { ResolvedCartItem, Indice } from "./types";

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { items, eliminarItem, limpiar, count } = useCart();
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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-16 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-14">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Carrito
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {count > 0
              ? `Tenés ${count} prenda(s) seleccionada(s).`
              : "Aún no agregaste prendas."}
          </p>
        </div>

        {resolved.length === 0 ? null : (
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-fit h-10 sm:h-9 text-sm"
          >
            <Link href="/productos" className="gap-2">
              Seguir mirando
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
        <div className="space-y-4">
          {isLoading && items.length > 0 ? (
            <CartSkeleton />
          ) : resolved.length === 0 ? (
            <Card className="rounded-3xl">
              <CardContent className="px-6 py-10 text-center">
                <p className="text-sm text-muted-foreground">
                  Tu carrito está vacío. Elegí una prenda para empezar.
                </p>
                <div className="mt-4">
                  <Button asChild className="gap-2">
                    <Link href="/productos">
                      Ver catálogo
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
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

        {resolved.length === 0 ? null : (
          <CartSummary buyUrl={buyUrl} onLimpiar={limpiar} />
        )}
      </div>
    </main>
  );
}
