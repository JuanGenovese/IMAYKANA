import { getAvailableProducts, getFeaturedProducts, getCategories } from "@/lib/services/productosCore";
import { BentoGridHero } from "@/components/store/bento-grid-hero";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductPagination } from "@/components/store/product-pagination";

export const metadata = {
  title: "Productos — IMAYKANA",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    categoria?: string;
    page?: string
  }>;
}) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams?.categoria;
  const currentPage = Number(resolvedParams?.page) || 1;
  const limit = 15;

  const [{ products, total }, featured, allCategories] = await Promise.all([
    getAvailableProducts({
      category: activeCategory,
      page: currentPage,
      limit,
    }),
    getFeaturedProducts(4),
    getCategories(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-16 pb-8 sm:pt-28 sm:pb-10 md:pt-32 md:pb-14">
      <BentoGridHero featured={featured} />

      <ProductFilters
        categories={allCategories}
        activeCategory={activeCategory}
      />

      <ProductPagination
        products={products}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        activeCategory={activeCategory}
      />
    </main>
  );
}
