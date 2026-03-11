import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function getStats() {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(products);
  return { totalProductos: Number(result[0]?.count ?? 0) };
}

export default async function DashboardPage() {
  const { totalProductos } = await getStats();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Inicio</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Productos</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalProductos}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Disponibles</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Vendidos</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">—</p>
        </div>
      </div>
    </div>
  );
}
