import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProductDetailClient } from "@/components/product-detail-client";
import { Button } from "@/components/ui/button";
import { getProductBySlug } from "@/lib/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
      <div className="mb-6">
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/productos">
            <ArrowLeft className="size-4" />
            Volver al catálogo
          </Link>
        </Button>
      </div>

      <ProductDetailClient product={product} />
    </main>
  );
}

