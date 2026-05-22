import { db } from "@/lib/db";
import { type ProductoConRelaciones } from "@/lib/db/schema";
import { Suspense } from "react";
import { ProductosDataTable } from "@/components/admin/ProductosDataTable";

function ProductosSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-10 w-64 rounded-lg bg-gray-200" />
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="h-10 bg-gray-100 border-b border-gray-100" />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-12 border-b border-gray-100 px-4 flex items-center gap-4"
          >
            <div className="h-3.5 w-32 rounded bg-gray-200" />
            <div className="h-3.5 w-20 rounded bg-gray-200" />
            <div className="h-3.5 w-10 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}



export default function ProductosPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  // Next.js 15: searchParams is a Promise
  const search = searchParams?.then((sp) => sp?.q);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Productos</h1>
      <Suspense fallback={<ProductosSkeleton />}>
        <ProductosTableWithSearch searchPromise={search} />
      </Suspense>
    </div>
  );
}

async function ProductosTableWithSearch({
  searchPromise,
}: {
  searchPromise: Promise<string | undefined> | undefined;
}) {
  const search = (await searchPromise) ?? "";
  const data = (await db.query.productos.findMany({
    orderBy: (p, { desc }) => [desc(p.id)],
    with: {
      imagenes: true,
      talleXCategoria: {
        with: {
          talle: true,
          categoria: true,
        },
      },
      estado: true,
    },
  })) as ProductoConRelaciones[];
  return <ProductosDataTable data={data} initialSearch={search} />;
}
