"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Heart, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/lib/products";
import { formatARS } from "@/lib/products";
import { WHATSAPP_PHONE } from "@/lib/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();

  const [activeImage, setActiveImage] = React.useState(0);
  const [size, setSize] = React.useState<Product["availableSizes"][number]>(
    product.availableSizes[0]
  );
  const [justAdded, setJustAdded] = React.useState(false);

  const buyMessage = [
    "Hola! Quiero comprar esta prenda:",
    `- ${product.name} (${product.id})`,
    `- Talle: ${size}`,
    `- Precio: ${formatARS(product.priceARS)}`,
    "",
    "¿Me confirmás disponibilidad y opciones de envío/retiro?",
  ].join("\n");

  const buyUrl = buildWhatsAppUrl(WHATSAPP_PHONE, buyMessage);

  const onAddToCart = () => {
    addItem({ productId: product.id, size, quantity: 1 });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-3xl border bg-card">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={product.images[activeImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {product.images.map((src, idx) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveImage(idx)}
              className={cn(
                "relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border bg-card",
                idx === activeImage ? "ring-2 ring-primary" : "opacity-80"
              )}
              aria-label={`Ver foto ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`${product.name} foto ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.tags.slice(0, 2).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {product.name}
          </h1>
          <p className="text-muted-foreground">{product.shortDescription}</p>
          <div className="text-2xl font-semibold">{formatARS(product.priceARS)}</div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="text-sm font-semibold">Talle</div>
          <div className="flex flex-wrap gap-2">
            {product.availableSizes.map((s) => (
              <Button
                key={s}
                type="button"
                variant={s === size ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSize(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="gap-2">
            <a href={buyUrl} target="_blank" rel="noreferrer">
              Comprar por WhatsApp
              <Heart className="size-4" />
            </a>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={onAddToCart}
          >
            {justAdded ? (
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

          <Button asChild variant="ghost">
            <Link href="/carrito">Ver carrito</Link>
          </Button>
        </div>

        <div className="rounded-3xl border bg-card p-6">
          <div className="text-sm font-semibold">Detalle</div>
          <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>
    </div>
  );
}

