"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { getProductsByIdsCore as getProductsByIds } from "@/lib/services/productosCore";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { ResolvedCartItem, Indice } from "./Types";

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { items, setCantidad, eliminarItem, limpiar, count } = useCart();
  const [resolvedProducts, setResolvedProducts] = useState<Indice>({});

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (items.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const ids = Array.from(
        new Set(
          items.map((item) => Number(item.productId)).filter((id) => !isNaN(id)),
        ),
      );
      try {
        const fetched = await getProductsByIds(ids);
        const productMap: Indice = {};
        for (const p of fetched) {
          productMap[p.id.toString()] = p;
        }
        setResolvedProducts(productMap);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartProducts();
  }, [items]);

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
            <Card className="rounded-3xl">
              <CardContent className="px-6 py-10 text-center text-muted-foreground animate-pulse">
                Cargando carrito...
              </CardContent>
            </Card>
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
            resolved.map((it) => {
              const photo = it.product.imagenes?.[0]?.url;
              const category = it.product.talleXCategoria?.categoria?.categoria ?? "";
              const talle = it.product.talleXCategoria?.talle?.talle ?? it.size;
              return (
                <Card key={`${it.productId}:${it.size}`} className="rounded-3xl">
                  <CardContent className="grid gap-4 px-5 py-5 sm:grid-cols-[96px_1fr]">
                    <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-2xl border bg-card">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={it.product.nombre}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                          ---
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            {category}
                          </div>
                          <div className="text-base font-semibold tracking-tight">
                            {it.product.nombre}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            Talle:{" "}
                            <span className="text-foreground">{talle}</span>
                          </div>
                        </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Quitar"
                        onClick={() => eliminarItem(it.productId, it.size)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            setCantidad(it.productId, it.size, it.quantity - 1)
                          }
                          aria-label="Restar"
                        >
                          -
                        </Button>
                        <div className="min-w-10 text-center text-sm font-semibold">
                          {it.quantity}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            setCantidad(it.productId, it.size, it.quantity + 1)
                          }
                          aria-label="Sumar"
                        >
                          +
                        </Button>
                      </div>

                      <div className="text-sm font-semibold text-muted-foreground">
                        Consultar precio
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
          )}
        </div>

        {resolved.length === 0 ? null : (
          <div className="space-y-4">
            <Card className="rounded-3xl">
              <CardContent className="space-y-4 px-6 py-6">
                <div className="text-sm font-semibold">Resumen</div>
                <Separator />

                <Button asChild className="w-full">
                  <a href={buyUrl} target="_blank" rel="noreferrer">
                    Consultar por WhatsApp
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={limpiar}
                  disabled={resolved.length === 0}
                >
                  Vaciar carrito
                </Button>

                <p className="text-xs text-muted-foreground">
                  El botón abre WhatsApp con un mensaje automático detallando tu
                  selección.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
