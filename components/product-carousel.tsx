"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProductCarousel({
  products,
  variant = "tall",
}: {
  products: Product[];
  variant?: "tall" | "compact";
}) {
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const isCompact = variant === "compact";

  const scrollByCards = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85) * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 scroll-smooth",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
        aria-label="Carrusel de productos destacados"
      >
        {products.map((p) => (
          <Link
            key={`${p.id}`}
            href={`/producto/${p.id}`}
            className="snap-start"
            aria-label={`Ver ${p.name}`}
          >
            <Card className="w-[240px] sm:w-[260px] md:w-[280px] overflow-hidden rounded-2xl sm:rounded-3xl border bg-card shadow-sm transition-transform hover:-translate-y-0.5">
              <div
                className={cn(
                  "relative w-full",
                  isCompact ? "h-28 sm:h-32 md:h-36" : "aspect-[6/5]",
                )}
              >
                {p.photoUrls && p.photoUrls.length > 0 ? (
                  <Image
                    src={p.photoUrls[0]}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 260px, 300px"
                    priority={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">Sin imagen</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>

              <CardContent
                className={cn("space-y-1 px-5 pt-4", isCompact && "pb-4")}
              >
                <div className="text-sm text-muted-foreground">
                  {p.category}
                </div>
                <div className="text-base font-semibold tracking-tight">
                  {p.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Consultar precio
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="pointer-events-none absolute -right-2 -top-2 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="pointer-events-auto rounded-full bg-glass"
          onClick={() => scrollByCards(-1)}
          aria-label="Anterior"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="pointer-events-auto rounded-full bg-glass"
          onClick={() => scrollByCards(1)}
          aria-label="Siguiente"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
