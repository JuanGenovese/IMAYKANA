import Link from "next/link";
import { 
  Shirt, 
  Pocket, 
  Wind, 
  Tag, 
  Sparkles,
  Layers,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mapeo de iconos para las categorías
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  campera: Wind,
  pantalon: Pocket,
  remera: Shirt,
  destacados: Sparkles,
  layout: Layers,
  default: Tag,
};

interface CategoryIconRowProps {
  categories: { id: number; categoria: string }[];
  activeCategory?: string;
}

export function CategoryIconRow({ categories, activeCategory }: CategoryIconRowProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Categorías</h2>
        <Link 
          href="/productos"
          className="text-xs font-medium text-primary hover:underline"
        >
          Limpiar filtros
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center">
        {/* Opción "Todos" */}
        <Link
          href="/productos"
          className="flex flex-col items-center gap-2 group shrink-0 snap-start"
        >
          <div
            className={cn(
              "w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center transition-all duration-300",
              !activeCategory
                ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                : "border-muted bg-card text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground group-hover:scale-105"
            )}
          >
            <LayoutGrid className="size-6 sm:size-7" />
          </div>
          <span
            className={cn(
              "text-[11px] sm:text-xs font-medium transition-colors",
              !activeCategory ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            Ver todo
          </span>
        </Link>

        {/* Categorías dinámicas */}
        {categories.map((cat) => {
          const isSelected = activeCategory?.toLowerCase() === cat.categoria.toLowerCase();
          const IconComponent = iconMap[cat.categoria.toLowerCase()] || iconMap.default;

          return (
            <Link
              key={cat.id}
              href={`/productos?categoria=${encodeURIComponent(cat.categoria)}`}
              className="flex flex-col items-center gap-2 group shrink-0 snap-start"
            >
              <div
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center transition-all duration-300",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                    : "border-muted bg-card text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground group-hover:scale-105"
                )}
              >
                <IconComponent className="size-6 sm:size-7" />
              </div>
              <span
                className={cn(
                  "text-[11px] sm:text-xs font-medium transition-colors capitalize",
                  isSelected ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {cat.categoria}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
