import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ProductoConRelaciones } from "@/lib/db/schema";

interface BentoGridHeroProps {
  featured: (ProductoConRelaciones | null)[];
}

export function BentoGridHero({ featured }: BentoGridHeroProps) {
  if (!featured) return null;
  const activeItems = featured.filter(Boolean);
  if (activeItems.length === 0) return null;

  const slot1 = featured[0];
  const slot2 = featured[1];
  const slot3 = featured[2];
  const slot4 = featured[3];
  const slot5 = featured[4];

  return (
    <div className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Columna 1: Principal grande (Slot 1) */}
        {slot1 && (
          <Link
            href={`/producto/${slot1.id}`}
            className={cn(
              "group relative overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block",
              "col-span-1 md:col-span-2 md:row-span-3 aspect-video md:aspect-[14/10]"
            )}
          >
            <span className="absolute top-6 left-6 bg-primary text-primary-foreground text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full z-20 shadow-sm animate-pulse">
              Recomendado
            </span>
            <div className="absolute inset-0 z-0">
              {slot1.imagenes?.[0]?.url ? (
                <Image
                  src={slot1.imagenes[0].url}
                  alt={slot1.nombre}
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
                {slot1.talleXCategoria?.categoria?.categoria || "Destacado"}
              </span>
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-tight max-w-md line-clamp-2">
                {slot1.nombre}
              </h2>
              <span className="text-[11px] sm:text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit mt-2 hover:bg-white/30 transition-all">
                Ver producto
              </span>
            </div>
          </Link>
        )}

        {/* Columna 2: 3 Apilados (Slots 2, 3, 4) */}
        { (slot2 || slot3 || slot4) && (
          <div className="col-span-1 md:col-span-1 flex flex-col gap-4 justify-between">
            {[slot2, slot3, slot4].map((f) => f && (
              <Link
                key={f.id}
                href={`/producto/${f.id}`}
                className="group flex gap-3 bg-card border rounded-3xl p-3 items-center relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex-1 min-h-[90px]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-2xl overflow-hidden shrink-0 bg-muted">
                  {f.imagenes?.[0]?.url && (
                    <Image
                      src={f.imagenes[0].url}
                      alt={f.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="80px"
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
        )}

        {/* Columna 3: Lateral destacado (Slot 5) */}
        {slot5 && (
          <div className="col-span-1 md:col-span-1 md:row-span-3 flex flex-col border bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-4 relative group min-h-[300px] md:min-h-0 justify-between">
            <Link href={`/producto/${slot5.id}`} className="block flex-1">
              <div className="relative aspect-[4/5] w-full bg-neutral-50 dark:bg-zinc-900 rounded-2xl overflow-hidden mb-3">
                {slot5.imagenes?.[0]?.url ? (
                  <Image
                    src={slot5.imagenes[0].url}
                    alt={slot5.nombre}
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
                  {slot5.talleXCategoria?.categoria?.categoria || "Destacado"}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {slot5.nombre}
                </h3>
              </div>
            </Link>
            <div className="flex items-center justify-between mt-4 pt-2 border-t border-muted">
              <span className="text-xs font-semibold text-foreground">
                Consultar precio
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
