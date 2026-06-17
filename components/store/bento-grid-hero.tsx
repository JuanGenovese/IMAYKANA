import Image from "next/image";
import Link from "next/link";
import QuickAddCart from "@/components/store/quick-add-cart";
import { cn } from "@/lib/utils";
import { type ProductoConRelaciones } from "@/lib/db/schema";

interface BentoGridHeroProps {
  featured: ProductoConRelaciones[];
}

export function BentoGridHero({ featured }: BentoGridHeroProps) {
  if (!featured || featured.length === 0) return null;

  return (
    <div className="mb-10">
      {featured.length >= 4 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href={`/producto/${featured[0].id}`}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block",
              "col-span-1 md:col-span-2 md:row-span-2 aspect-video md:aspect-[14/10]"
            )}
          >
            <div className="absolute inset-0 z-0">
              {featured[0].imagenes?.[0]?.url ? (
                <Image
                  src={featured[0].imagenes[0].url}
                  alt={featured[0].nombre}
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
                {featured[0].talleXCategoria?.categoria?.categoria || "Destacado"}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight max-w-md line-clamp-2">
                {featured[0].nombre}
              </h2>
              <span className="text-[11px] sm:text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit mt-2 hover:bg-white/30 transition-all">
                Ver producto
              </span>
            </div>
          </Link>

          <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
            {[featured[1], featured[2]].map((f) => f && (
              <Link
                key={f.id}
                href={`/producto/${f.id}`}
                className="group flex gap-3 bg-card border rounded-3xl p-3 items-center relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl overflow-hidden shrink-0 bg-muted">
                  {f.imagenes?.[0]?.url && (
                    <Image
                      src={f.imagenes[0].url}
                      alt={f.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex-1 flex flex-col min-w-0">
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {f.talleXCategoria?.categoria?.categoria || "Prenda"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground truncate mt-0.5">
                    {f.nombre}
                  </h3>
                  <span className="text-[10px] text-primary font-semibold mt-1">
                    Ver colección
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="col-span-1 md:col-span-1 md:row-span-2 flex flex-col border bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-4 relative group">
            <span className="absolute top-6 left-6 bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full z-20 shadow-sm animate-pulse">
              Recomendado
            </span>
            <Link href={`/producto/${featured[3].id}`} className="block flex-1">
              <div className="relative aspect-[4/5] w-full bg-neutral-50 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-3">
                {featured[3].imagenes?.[0]?.url ? (
                  <Image
                    src={featured[3].imagenes[0].url}
                    alt={featured[3].nombre}
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
                  {featured[3].talleXCategoria?.categoria?.categoria || "Destacado"}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {featured[3].nombre}
                </h3>
              </div>
            </Link>
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-muted">
              <span className="text-xs font-semibold text-foreground">
                Consultar precio
              </span>
              <QuickAddCart
                productId={featured[3].id.toString()}
                size={featured[3].talleXCategoria?.talle?.talle || "Único"}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          featured.length === 1 && "grid-cols-1",
          featured.length === 2 && "grid-cols-1 md:grid-cols-2",
          featured.length === 3 && "grid-cols-1 md:grid-cols-3"
        )}>
          {featured.map((f) => (
            <div
              key={f.id}
              className="flex flex-col border bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-4 relative group"
            >
              <span className="absolute top-6 left-6 bg-emerald-500 text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full z-20 shadow-sm">
                Destacado
              </span>
              <Link href={`/producto/${f.id}`} className="block flex-1">
                <div className="relative aspect-[16/10] w-full bg-neutral-50 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-3">
                  {f.imagenes?.[0]?.url ? (
                    <Image
                      src={f.imagenes[0].url}
                      alt={f.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                    {f.talleXCategoria?.categoria?.categoria || "Destacado"}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                    {f.nombre}
                  </h3>
                </div>
              </Link>
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-muted">
                <span className="text-xs font-semibold text-foreground">
                  Consultar precio
                </span>
                <QuickAddCart
                  productId={f.id.toString()}
                  size={f.talleXCategoria?.talle?.talle || "Único"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
