import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

import { ProductDetailClient } from "@/components/product-detail-client";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/db/queries";

type Props = {
  params: Promise<{ id: string }>;
};

// Generación de metadatos dinámicos SEO (Fase 3.4)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: `${product.name} — IMAYKANA`,
    description: product.descriptionSummary,
    openGraph: {
      images: product.photoUrls.length > 0 ? [product.photoUrls[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  if (!product || product.status !== "AVAILABLE") {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-16 pb-8 md:pt-32 md:pb-12">
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
