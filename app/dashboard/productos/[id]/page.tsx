import { notFound } from "next/navigation";
import { ProductoForm } from "@/components/admin/ProductoForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductById, getFormMetadata } from "@/lib/services/productosCore";
import { type ProductoConRelaciones } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

interface EditarProductoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({
  params,
}: EditarProductoPageProps) {
  const { id } = await params;
  const parsedId = Number(id);

  if (isNaN(parsedId) || parsedId <= 0) {
    notFound();
  }

  const [producto, metadata] = await Promise.all([
    getProductById(parsedId),
    getFormMetadata(),
  ]);

  if (!producto) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          href="/dashboard/productos"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a productos
        </Link>
      </div>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-3xl">
          <ProductoForm producto={producto as ProductoConRelaciones} metadata={metadata} />
        </div>
      </div>
    </div>
  );
}
