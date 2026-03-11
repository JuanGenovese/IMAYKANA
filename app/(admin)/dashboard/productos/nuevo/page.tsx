import { ProductoForm } from "@/components/admin/ProductoForm";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Nuevo Producto</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-3xl">
        <ProductoForm />
      </div>
    </div>
  );
}
