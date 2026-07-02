import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { type ProductoConRelaciones } from "@/lib/db/schema";

interface ProductPaginationProps {
  products: ProductoConRelaciones[];
  total: number;
  currentPage: number;
  totalPages: number;
  activeCategory?: string;
}

export function ProductPagination({
  products,
  total,
  currentPage,
  totalPages,
  activeCategory,
}: ProductPaginationProps) {
  const createPageLink = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (activeCategory) params.set("categoria", activeCategory);
    params.set("page", pageNumber.toString());
    return `/productos?${params.toString()}`;
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">
          {activeCategory
            ? `Productos de ${activeCategory}`
            : "Todos los productos"}
        </h2>
        <span className="text-xs text-muted-foreground font-medium">
          {total} {total === 1 ? "prenda" : "prendas"} encontradas
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-3xl bg-card">
          <span className="text-sm text-muted-foreground">
            No encontramos prendas en esta categoría.
          </span>
        </div>
      ) : (
        <div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 border-t border-muted pt-6">
              <div className="text-xs text-muted-foreground">
                Página <span className="font-semibold text-foreground">{currentPage}</span> de{" "}
                <span className="font-semibold text-foreground">{totalPages}</span> ({total} prendas en total)
              </div>
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={createPageLink(currentPage - 1)}
                    className="text-xs font-medium border bg-card hover:bg-muted text-foreground px-4 py-2 rounded-xl transition-all"
                  >
                    Anterior
                  </Link>
                ) : (
                  <span className="text-xs font-medium border bg-muted/50 text-muted-foreground px-4 py-2 rounded-xl cursor-not-allowed">
                    Anterior
                  </span>
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={createPageLink(currentPage + 1)}
                    className="text-xs font-medium border bg-card hover:bg-muted text-foreground px-4 py-2 rounded-xl transition-all"
                  >
                    Siguiente
                  </Link>
                ) : (
                  <span className="text-xs font-medium border bg-muted/50 text-muted-foreground px-4 py-2 rounded-xl cursor-not-allowed">
                    Siguiente
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
