import { Suspense } from "react";
import { ProductosTableWithSearch } from "@/components/admin/ProductosTableWithSearch";
import { ProductosSkeleton } from "@/components/admin/ProductosSkeleton";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams?.q ?? "";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Productos</h1>
      <Suspense fallback={<ProductosSkeleton />}>
        <ProductosTableWithSearch search={search} />
      </Suspense>
    </div>
  );
}
