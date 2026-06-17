import Image from "next/image";
import Link from "next/link";
import QuickAddCart from "@/components/store/quick-add-cart";
import { cn } from "@/lib/utils";
import { type ProductoConRelaciones } from "@/lib/db/schema";

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

interface ProductCardProps {
  product: ProductoConRelaciones;
}

export function ProductCard({ product }: ProductCardProps) {
  const photo = product.imagenes?.[0]?.url;
  const category = product.talleXCategoria?.categoria?.categoria ?? "";

  return (
    <div className="group relative flex flex-col border bg-card rounded-2xl sm:rounded-3xl p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Status Badge */}
      <span className="absolute top-5 left-5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[8px] sm:text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full z-20 shadow-sm">
        Disponible
      </span>

      <Link href={`/producto/${product.id}`} className="block flex-1">
        {/* Image Contained */}
        <div className="relative aspect-square w-full bg-neutral-50 dark:bg-zinc-900 rounded-xl sm:rounded-2xl overflow-hidden mb-3">
          {photo ? (
            <Image
              src={photo}
              alt={product.nombre}
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
            {product.nombre}
          </h3>

          {/* Color Selector Dot */}
          <div className="flex items-center gap-1.5 py-1">
            {colorMap[product.color.toLowerCase()] ? (
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full border border-black/10 shadow-sm",
                  colorMap[product.color.toLowerCase()],
                )}
                title={product.color}
              />
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shadow-sm bg-neutral-300"
                title={product.color}
              />
            )}
            <span className="text-[9px] sm:text-[10px] text-muted-foreground capitalize truncate">
              {product.color}
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
          productId={product.id.toString()}
          size={product.talleXCategoria?.talle?.talle || "Único"}
        />
      </div>
    </div>
  );
}
