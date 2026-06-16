"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ProductoConRelaciones } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ProductosCarrusel({
  products
}: {
  products: ProductoConRelaciones[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.85) * direction;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="relative h-full flex flex-col justify-center">
      <div
        ref={scrollerRef}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 scroll-smooth h-full",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
        aria-label="Carrusel de productos destacados"
      >
        {products.map((p) => {
          const photo = p.imagenes?.[0]?.url;
          const category = p.talleXCategoria?.categoria?.categoria ?? "";
          return (
            <Link
              key={`${p.id}`}
              href={`/producto/${p.id}`}
              className="snap-start h-full block"
              aria-label={`Ver ${p.nombre}`}
            >
              <Card className="relative h-full w-auto aspect-[5/7] overflow-hidden rounded-2xl sm:rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group">
                {/* 1. Full Background Image */}
                <div className="absolute inset-0 z-0 w-full h-full">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={p.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 260px, 300px"
                      priority={false}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground text-xs">
                        Sin imagen
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Gradient Overlay for Readability */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/10 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

                {/* 3. Overlay Content */}
                <CardContent className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 flex flex-col gap-1 text-white">
                  <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/70">
                    {category}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold leading-tight line-clamp-2 text-white">
                    {p.nombre}
                  </h3>
                  <span className="text-[11px] sm:text-xs font-medium text-white/85">
                    Consultar precio
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background hover:scale-105 h-10 w-10 transition-all items-center justify-center"
        onClick={() => scrollByCards(-1)}
        aria-label="Anterior"
      >
        <ChevronLeft className="size-5 text-foreground" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg hover:bg-background hover:scale-105 h-10 w-10 transition-all items-center justify-center"
        onClick={() => scrollByCards(1)}
        aria-label="Siguiente"
      >
        <ChevronRight className="size-5 text-foreground" />
      </Button>
    </div>
  );
}
