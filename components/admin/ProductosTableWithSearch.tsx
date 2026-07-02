import { getAllProducts, getFormMetadata } from "@/lib/services/productosCore";
import { ProductosDataTable } from "@/components/admin/ProductosDataTable";

export async function ProductosTableWithSearch({
  search,
}: {
  search: string;
}) {
  const [data, metadata] = await Promise.all([
    getAllProducts(),
    getFormMetadata(),
  ]);

  return (
    <ProductosDataTable
      data={data}
      metadata={metadata}
      initialSearch={search}
    />
  );
}
