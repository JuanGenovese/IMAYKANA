import { db } from "@/lib/db";
import { productos, estados } from "@/lib/db/schema";
import { sql, eq } from "drizzle-orm";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

async function getStats() {
  const result = await db
    .select({
      total: sql<number>`count(${productos.id})`,
      disponibles: sql<number>`count(${productos.id}) filter (where ${estados.estado} = 'AVAILABLE')`,
      vendidos: sql<number>`count(${productos.id}) filter (where ${estados.estado} = 'SOLD')`,
    })
    .from(productos)
    .leftJoin(estados, eq(productos.idEstado, estados.id));

  const stats = result[0] || { total: 0, disponibles: 0, vendidos: 0 };

  return {
    totalProductos: Number(stats.total),
    disponibles: Number(stats.disponibles),
    vendidos: Number(stats.vendidos),
  };
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white" />
      ))}
    </div>
  );
}

async function StatsCards() {
  const { totalProductos, disponibles, vendidos } = await getStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Total Productos</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{totalProductos}</p>
      </div>
      <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Disponibles</p>
        <p className="mt-2 text-3xl font-bold text-green-600">{disponibles}</p>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-gray-500">Vendidos</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{vendidos}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Inicio</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <StatsCards />
      </Suspense>
    </div>
  );
}
