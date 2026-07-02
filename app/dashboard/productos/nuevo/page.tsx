import { ProductoForm } from "@/components/admin/ProductoForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getFormMetadata } from "@/lib/services/productosCore";

export default async function NuevoProductoPage() {
  const metadata = await getFormMetadata();

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
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Nuevo Producto</h1>
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-3xl">
          <ProductoForm metadata={metadata} />
        </div>
      </div>
    </div>
  );
}
