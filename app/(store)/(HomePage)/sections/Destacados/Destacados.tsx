import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductosCarrusel } from "@/components/store/CarruselProductos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProducts } from "@/lib/db/schema/queries/queries";

export async function Destacados() {
  const products = await getFeaturedProducts();


  return (
    <section
      id="productos"
      className="mt-[25vh] mb-[25vh] flex min-h-fit md:min-h-[calc(100svh-160px)] md:h-[calc(100svh-160px)] w-full items-center justify-center bg-transparent relative py-8 sm:py-12 md:py-0 scroll-mt-20 md:scroll-mt-28"
    >
      <div className="w-full max-w-6xl px-4">
        <div className="h-[70vh] max-h-[70vh] min-h-[350px] flex flex-col rounded-xl sm:rounded-[2rem] border bg-card/60 p-5 sm:p-5 md:p-8 backdrop-blur-sm">
          <div className="flex-none space-y-2 mb-4">
            <Badge variant="outline" className="w-fit text-xs sm:text-sm">
              Destacados
            </Badge>
          </div>
          <div className="flex-1 min-h-0">
            <ProductosCarrusel products={products} />
          </div>
          <div className="flex-none flex justify-center">
            <Button
              asChild
              variant="ghost"
              className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm rounded-full"
            >
              <Link href="/productos" className="gap-1">
                Ver todo <ArrowRight className="size-3 sm:size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
