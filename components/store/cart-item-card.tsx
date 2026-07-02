"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type ResolvedCartItem } from "@/components/providers/cart-provider";

import { formatPrice } from "@/lib/utils";

interface CartItemCardProps {
  item: ResolvedCartItem;
  onEliminar: (productId: string, size: string) => void;
}

export function CartItemCard({ item, onEliminar }: CartItemCardProps) {
  const photo = item.product.imagenes?.[0]?.url;
  const category = item.product.talleXCategoria?.categoria?.categoria ?? "";
  const talle = item.product.talleXCategoria?.talle?.talle ?? item.size;

  return (
    <Card className="rounded-3xl">
      <CardContent className="grid gap-4 px-5 py-5 sm:grid-cols-[96px_1fr]">
        <div className="relative aspect-[4/5] w-24 overflow-hidden rounded-2xl border bg-card">
          {photo ? (
            <Image
              src={photo}
              alt={item.product.nombre}
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

        <div className="flex flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-muted-foreground">{category}</div>
              <div className="text-base font-semibold tracking-tight">
                {item.product.nombre}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Talle: <span className="text-foreground">{talle}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Quitar"
              onClick={() => onEliminar(item.productId, item.size)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <div className="text-sm font-semibold text-muted-foreground">
            {formatPrice(item.product.precio)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
