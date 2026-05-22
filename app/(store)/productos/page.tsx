import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAvailableProducts } from "@/lib/db/queries";

export const metadata = {
  title: "Productos — IMAYKANA",
};

export default async function ProductsPage() {
  const products = await getAvailableProducts();
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-16 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-14">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs sm:text-sm">
            Catálogo
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Productos
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Elegí una prenda para ver detalles, fotos y comprar por WhatsApp.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full sm:w-fit h-10 sm:h-9 text-sm"
        >
          <Link href="/carrito" className="gap-2">
            Ir al carrito
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const photo = p.imagenes?.[0]?.url;
          const category = p.talleXCategoria?.categoria?.categoria ?? "";
          return (
            <Link key={p.id} href={`/producto/${p.id}`} className="group">
              <Card className="overflow-hidden rounded-3xl transition-transform group-hover:-translate-y-0.5">
                <div className="relative aspect-[4/5] w-full">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={p.nombre}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                </div>
                <CardContent className="space-y-2 px-5 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-muted-foreground">
                      {category}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Consultar precio
                    </span>
                  </div>
                  <div className="text-base font-semibold tracking-tight">
                    {p.nombre}
                  </div>
                  <div className="line-clamp-2 text-sm text-muted-foreground">
                    {p.descripcion}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
