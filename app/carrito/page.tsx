"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatARS, getProductById } from "@/lib/products";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export default function CartPage() {
  const { items, setQuantity, removeItem, clear, count } = useCart();

  const resolved = items
    .map((it) => {
      const product = getProductById(it.productId);
      if (!product) return null;
      return { ...it, product };
    })
    .filter(Boolean);

  const total = resolved.reduce(
    (acc, it) => acc + it!.product.priceARS * it!.quantity,
    0,
  );

  const message =
    resolved.length === 0
      ? "Hola! Quiero hacer una consulta."
      : [
          "Hola! Quiero comprar estas prendas:",
          "",
          ...resolved.map((it) => {
            const lineTotal = it!.product.priceARS * it!.quantity;
            return `- ${it!.product.name} (${it!.product.id}) | Talle: ${it!.size} | Cantidad: ${it!.quantity} | Subtotal: ${formatARS(
              lineTotal,
            )}`;
          }),
          "",
          `Total aprox: ${formatARS(total)}`,
          "",
          "¿Me confirmás disponibilidad y opciones de envío/retiro?",
        ].join("\n");

  const buyUrl = buildWhatsAppUrl(WHATSAPP_PHONE, message);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10 md:py-14">
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
      </div>

      <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
        <div className="space-y-4">
          {resolved.length === 0 ? (
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
              <Card
                key={`${it!.productId}:${it!.size}`}
                className="rounded-3xl"
              >
                <CardContent className="grid gap-4 px-5 py-5 sm:grid-cols-[96px_1fr]">
                  <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-2xl border bg-card">
                    <Image
                      src={it!.product.images[0]}
                      alt={it!.product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {it!.product.category}
                        </div>
                        <div className="text-base font-semibold tracking-tight">
                          {it!.product.name}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Talle:{" "}
                          <span className="text-foreground">{it!.size}</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Quitar"
                        onClick={() => removeItem(it!.productId, it!.size)}
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
                            setQuantity(
                              it!.productId,
                              it!.size,
                              it!.quantity - 1,
                            )
                          }
                          aria-label="Restar"
                        >
                          -
                        </Button>
                        <div className="min-w-10 text-center text-sm font-semibold">
                          {it!.quantity}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            setQuantity(
                              it!.productId,
                              it!.size,
                              it!.quantity + 1,
                            )
                          }
                          aria-label="Sumar"
                        >
                          +
                        </Button>
                      </div>

                      <div className="text-sm font-semibold">
                        {formatARS(it!.product.priceARS * it!.quantity)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-4">
          <Card className="rounded-3xl">
            <CardContent className="space-y-4 px-6 py-6">
              <div className="text-sm font-semibold">Resumen</div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total aprox.</span>
                <span className="font-semibold">{formatARS(total)}</span>
              </div>

              <Button asChild className="w-full">
                <a href={buyUrl} target="_blank" rel="noreferrer">
                  Comprar por WhatsApp
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={clear}
                disabled={resolved.length === 0}
              >
                Vaciar carrito
              </Button>

              <p className="text-xs text-muted-foreground">
                El botón abre WhatsApp con un mensaje automático. Podés editarlo
                antes de enviar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
