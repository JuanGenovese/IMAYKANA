import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductoForm } from "@/components/admin/ProductoForm";
import { EliminarProductoButton } from "@/components/admin/EliminarProductoButton";

interface EditarProductoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({
  params,
}: EditarProductoPageProps) {
  const { id } = await params;
  const [producto] = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)))
    .limit(1);

  if (!producto) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
        <EliminarProductoButton id={producto.id} />
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm max-w-3xl">
        <ProductoForm producto={producto} />
      </div>
    </div>
  );
}
