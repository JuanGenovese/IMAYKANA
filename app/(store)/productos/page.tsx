import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { categorias } from "@/lib/db/schema";
import { getAvailableProducts, getFeaturedProducts } from "@/lib/db/queries";
import { CategoryIconRow } from "@/components/category-icon-row";
import QuickAddCart from "@/components/quick-add-cart";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Productos — IMAYKANA",
};

const colorMap: Record<string, string> = {
  negro: "bg-black",
  blanco: "bg-white",
  azul: "bg-blue-600",
  rojo: "bg-red-500",
  verde: "bg-emerald-600",
  gris: "bg-gray-400",
  amarillo: "bg-yellow-400",
  marron: "bg-amber-800",
  marrón: "bg-amber-800",
  rosa: "bg-pink-400",
  naranja: "bg-orange-500",
  celeste: "bg-sky-400",
  beige: "bg-[#f5f5dc]",
  crema: "bg-[#fffdd0]",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.categoria;

  // Consultas paralelas para optimizar la velocidad de carga
  const [allProducts, featured, allCategories] = await Promise.all([
    getAvailableProducts(),
    getFeaturedProducts(4),
    db.select().from(categorias),
  ]);

  // Filtrar productos por categoría elegida
  const products = activeCategory
    ? allProducts.filter(
        (p) =>
          p.talleXCategoria?.categoria?.categoria?.toLowerCase() ===
          activeCategory.toLowerCase(),
      )
    : allProducts;

  const hasFeatured = featured && featured.length > 0;
  const f1 = featured[0];
  const f2 = featured[1];
  const f3 = featured[2];
  const f4 = featured[3];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-16 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-14">
      {/* 2. Bento Grid Hero */}
      {hasFeatured && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {/* Card 1: Banner Grande (spans 2 cols, 2 rows en desktop) */}
          {f1 && (
            <Link
              href={`/producto/${f1.id}`}
              className={cn(
                "group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block",
                "col-span-1 md:col-span-2 md:row-span-2 aspect-video md:aspect-[14/10]",
              )}
            >
              <div className="absolute inset-0 z-0">
                {f1.imagenes?.[0]?.url ? (
                  <Image
                    src={f1.imagenes[0].url}
                    alt={f1.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground text-xs">
                      Sin imagen
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-1 text-white">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/70">
                  {f1.talleXCategoria?.categoria?.categoria || "Destacado"}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight max-w-md line-clamp-2">
                  {f1.nombre}
                </h2>
                <span className="text-[11px] sm:text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit mt-2 hover:bg-white/30 transition-all">
                  Ver producto
                </span>
              </div>
            </Link>
          )}

          {/* Columna central: Dos horizontales apiladas */}
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            {f2 && (
              <Link
                href={`/producto/${f2.id}`}
                className="group flex gap-3 bg-card border rounded-3xl p-3 items-center relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl overflow-hidden shrink-0 bg-muted">
                  {f2.imagenes?.[0]?.url && (
                    <Image
                      src={f2.imagenes[0].url}
                      alt={f2.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {f2.talleXCategoria?.categoria?.categoria || "Prenda"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
                    {f2.nombre}
                  </h3>
                  <span className="text-[10px] text-primary font-semibold mt-1">
                    Ver colección
                  </span>
                </div>
              </Link>
            )}

            {f3 && (
              <Link
                href={`/producto/${f3.id}`}
                className="group flex gap-3 bg-card border rounded-3xl p-3 items-center relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl overflow-hidden shrink-0 bg-muted">
                  {f3.imagenes?.[0]?.url && (
                    <Image
                      src={f3.imagenes[0].url}
                      alt={f3.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {f3.talleXCategoria?.categoria?.categoria || "Prenda"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
                    {f3.nombre}
                  </h3>
                  <span className="text-[10px] text-primary font-semibold mt-1">
                    Ver colección
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Card 4: Derecha Vertical Recomendado */}
          {f4 && (
            <div className="col-span-1 md:col-span-1 md:row-span-2 flex flex-col border bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-4 relative group">
              <span className="absolute top-6 left-6 bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full z-20 shadow-sm animate-pulse">
                Recomendado
              </span>
              <Link href={`/producto/${f4.id}`} className="block flex-1">
                <div className="relative aspect-[4/5] w-full bg-neutral-50 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-3">
                  {f4.imagenes?.[0]?.url ? (
                    <Image
                      src={f4.imagenes[0].url}
                      alt={f4.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <span className="text-muted-foreground text-xs">
                        Sin imagen
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {f4.talleXCategoria?.categoria?.categoria || "Destacado"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {f4.nombre}
                  </h3>
                </div>
              </Link>
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-muted">
                <span className="text-xs font-semibold text-foreground">
                  Consultar precio
                </span>
                <QuickAddCart
                  productId={f4.id.toString()}
                  size={f4.talleXCategoria?.talle?.talle || "Único"}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Barra de Categorías */}
      <CategoryIconRow
        categories={allCategories}
        activeCategory={activeCategory}
      />

      {/* 4. Grilla de Productos */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {activeCategory
              ? `Productos de ${activeCategory}`
              : "Todos los productos"}
          </h2>
          <span className="text-xs text-muted-foreground font-medium">
            {products.length} {products.length === 1 ? "prenda" : "prendas"}{" "}
            encontradas
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-3xl bg-card">
            <span className="text-sm text-muted-foreground">
              No encontramos prendas en esta categoría.
            </span>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const photo = p.imagenes?.[0]?.url;
              const category = p.talleXCategoria?.categoria?.categoria ?? "";
              return (
                <div
                  key={p.id}
                  className="group relative flex flex-col border bg-card rounded-2xl sm:rounded-3xl p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Status Badge */}
                  <span className="absolute top-5 left-5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full z-20 shadow-sm">
                    Disponible
                  </span>

                  <Link href={`/producto/${p.id}`} className="block flex-1">
                    {/* Image Contained */}
                    <div className="relative aspect-square w-full bg-neutral-50 dark:bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden mb-3">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={p.nombre}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <span className="text-muted-foreground text-xs">
                            Sin imagen
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight">
                        {p.nombre}
                      </h3>

                      {/* Color Selector Dot */}
                      <div className="flex items-center gap-1.5 py-1">
                        {colorMap[p.color.toLowerCase()] ? (
                          <span
                            className={cn(
                              "w-2.5 h-2.5 rounded-full border border-black/10 shadow-sm",
                              colorMap[p.color.toLowerCase()],
                            )}
                            title={p.color}
                          />
                        ) : (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-sm bg-neutral-300"
                            title={p.color}
                          />
                        )}
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground capitalize truncate">
                          {p.color}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-muted">
                    <span className="text-xs font-semibold text-foreground">
                      Consultar precio
                    </span>
                    <QuickAddCart
                      productId={p.id.toString()}
                      size={p.talleXCategoria?.talle?.talle || "Único"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
