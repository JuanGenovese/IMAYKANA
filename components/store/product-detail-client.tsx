"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import type { ProductoConRelaciones } from "@/lib/db/schema";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn, formatPrice } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: ProductoConRelaciones }) {
  const { addItem, items, openCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const talle = product.talleXCategoria?.talle?.talle ?? "";
  const isAlreadyInCart = items.some(
    (i) => i.productId === product.id.toString() && i.size === talle
  );
  const categoria = product.talleXCategoria?.categoria?.categoria ?? "";
  const photoUrls = product.imagenes?.map((img) => img.url) ?? [];

  const buyMessage = [
    "Hola! Quiero consultar por esta prenda:",
    `- ${product.nombre} (Ref: ${product.id})`,
    `- Talle: ${talle}`,
    `- Color: ${product.color}`,
    "",
    "¿Me confirmás disponibilidad y precio?",
  ].join("\n");

  const buyUrl = buildWhatsAppUrl(WHATSAPP_PHONE, buyMessage);

  const onAddToCart = () => {
    // Al no haber múltiples talles, usamos directamente el de la prenda
    addItem({
      productId: product.id.toString(),
      size: talle,
      quantity: 1,
      price: product.precio ?? 0,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-2">
      <div className="space-y-3 sm:space-y-4">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border bg-card">
          <div className="relative aspect-[4/5] w-full">
            {photoUrls && photoUrls.length > 0 ? (
              <Image
                src={photoUrls[activeImage]}
                alt={product.nombre}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground">Sin imagen</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
        </div>

        {photoUrls && photoUrls.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {photoUrls.map((src, idx) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "relative h-20 sm:h-24 w-16 sm:w-20 shrink-0 overflow-hidden rounded-xl sm:rounded-2xl border bg-card",
                  idx === activeImage ? "ring-2 ring-primary" : "opacity-80",
                )}
                aria-label={`Ver foto ${idx + 1}`}
              >
                <Image
                  src={src}
                  alt={`${product.nombre} foto ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs sm:text-sm">
              {categoria}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            {product.nombre}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {product.descripcion}
          </p>
          <div className="text-xl sm:text-2xl font-semibold text-muted-foreground">
            {formatPrice(product.precio)}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Talle
            </div>
            <div className="text-base font-medium">{talle}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Color
            </div>
            <div className="text-base font-medium">{product.color}</div>
          </div>
        </div>

        {product.medidasEspecificas && (
          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
              Medidas específicas
            </div>
            <div className="text-sm">{product.medidasEspecificas}</div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:gap-3 pt-4">
          <Button asChild className="gap-2 h-11 sm:h-10 w-full sm:w-auto">
            <a href={buyUrl} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
              <Heart className="size-4" />
            </a>
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2 h-11 sm:h-10 flex-1 sm:flex-none"
              onClick={onAddToCart}
              disabled={justAdded || isAlreadyInCart}
            >
              {justAdded || isAlreadyInCart ? (
                <>
                  Agregado
                  <Check className="size-4" />
                </>
              ) : (
                <>
                  Agregar al carrito
                  <ShoppingCart className="size-4" />
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-11 sm:h-10"
              onClick={openCart}
            >
              Ver carrito
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
