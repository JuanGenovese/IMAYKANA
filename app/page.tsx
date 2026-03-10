import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCarousel } from "../components/product-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFeaturedProducts } from "@/lib/db/queries";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(5);

  return (
    <main className="w-full">
      {/* 1. Hero Section - Full Screen */}
      <section className="snap-start relative w-full min-h-[calc(100vh-64px)] h-[100vh] max-h-[900px] bg-[url('/design/landing-bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div
          className="pointer-events-none absolute inset-0 bg-background/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center px-4 py-16 sm:py-20 md:py-0">
          <div className="grid w-full items-center gap-8 md:gap-10 md:grid-cols-3">
            <div className="mx-auto w-full max-w-xl space-y-5 sm:space-y-6 md:space-y-7 rounded-2xl sm:rounded-3xl border border-white/15 bg-black/25 p-6 sm:p-8 shadow-lg backdrop-blur-md md:col-span-2 md:mx-0 md:max-w-none md:p-10">
              <div className="flex flex-wrap items-center gap-2">
                {/*<Badge className="gap-1 py-1 text-sm">
                  <Sparkles className="size-3.5" />
                  Nuevo drop
                </Badge>*/}
              </div>

              <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-white">
                Moda delicada, moderna y con identidad.
              </h1>
              <p className="text-balance text-base sm:text-lg leading-relaxed text-white/85 md:text-xl">
                Descubrí prendas seleccionadas para acompañarte con elegancia.
                Sin checkout: coordinás tu compra directo por WhatsApp.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 h-11 sm:h-12 rounded-full px-6 sm:px-8 text-sm sm:text-base"
                >
                  <Link href="/productos">
                    Ver catálogo
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 sm:h-12 rounded-full px-6 sm:px-8 text-sm sm:text-base bg-white/10 text-white hover:bg-white/20 hover:text-white border-white/20"
                >
                  <Link href="/#marca">Conocer la marca</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:col-span-1 md:block" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section - Full Screen */}
      <section className="snap-start flex min-h-[80vh] sm:min-h-[90vh] h-svh w-full items-center justify-center bg-transparent relative py-12 sm:py-16 md:py-0">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
          <div className="h-[40vh] sm:h-[50vh] md:h-[60vh] w-[40vh] sm:w-[50vh] md:w-[60vh] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="w-full max-w-6xl px-4">
          <div className="rounded-2xl sm:rounded-[2.25rem] border bg-glass p-1">
            <div className="rounded-xl sm:rounded-[2rem] border bg-card/60 p-4 sm:p-6 md:p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="text-xl sm:text-2xl font-semibold tracking-tight">
                  Selección destacada
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm rounded-full"
                >
                  <Link href="/productos" className="gap-2">
                    Ver todo <ArrowRight className="size-3 sm:size-4" />
                  </Link>
                </Button>
              </div>
              <ProductCarousel variant="tall" products={featuredProducts} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Brand Section - Full Screen */}
      <section
        id="marca"
        className="snap-start flex min-h-[80vh] sm:min-h-[90vh] h-svh w-full items-center justify-center bg-transparent py-12 sm:py-16 md:py-0"
      >
        <div className="w-full max-w-6xl px-4">
          <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <Badge variant="outline" className="w-fit text-xs sm:text-sm">
                Nosotros
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance">
                La marca que te entiende
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground text-balance leading-relaxed">
                IMAYKANA nace del amor por los detalles: paletas suaves,
                estampas florales y cortes pensados para realzar. Cada prenda
                está elegida para contar una historia: la tuya.
              </p>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              <div className="group rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="text-sm sm:text-base font-semibold">
                  Curaduría
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Prendas seleccionadas con enfoque en textura, caída y
                  combinabilidad.
                </p>
              </div>
              <div className="group rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="text-sm sm:text-base font-semibold">Estilo</div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Floral moderno, minimal romántico y energía editorial.
                </p>
              </div>
              <div className="group rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="text-sm sm:text-base font-semibold">
                  Atención
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Coordinás por WhatsApp, con mensaje automático por prenda o
                  por carrito.
                </p>
              </div>
              <div className="group rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-5 md:p-6 transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="text-sm sm:text-base font-semibold">
                  Lanzamientos
                </div>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Novedades y drops: destacamos lo mejor de cada temporada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How to Buy Section - Full Screen */}
      <section
        id="como-comprar"
        className="snap-start flex min-h-[80vh] sm:min-h-[90vh] h-svh w-full items-center justify-center bg-transparent py-12 sm:py-16 md:py-0"
      >
        <div className="w-full max-w-6xl px-4">
          <div className="rounded-3xl border bg-card/80 p-8 md:p-16 backdrop-blur-md shadow-2xl">
            <div className="grid gap-16 md:grid-cols-3">
              <div className="md:col-span-1 space-y-6">
                <Badge variant="outline" className="w-fit">
                  Guía
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Cómo comprar
                </h2>
                <p className="text-base text-muted-foreground">
                  Rápido y simple. Elegís tus prendas y coordinamos por
                  WhatsApp.
                </p>
              </div>
              <ol className="grid gap-6 md:col-span-2">
                <li className="group rounded-2xl border bg-glass p-6 transition-colors hover:bg-glass/80">
                  <div className="flex items-center gap-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      1
                    </span>
                    <div className="text-lg font-semibold">
                      Mirá el catálogo
                    </div>
                  </div>
                  <p className="mt-3 pl-12 text-muted-foreground">
                    Entrá a Productos y explorá: cada card te lleva al detalle.
                  </p>
                </li>
                <li className="group rounded-2xl border bg-glass p-6 transition-colors hover:bg-glass/80">
                  <div className="flex items-center gap-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      2
                    </span>
                    <div className="text-lg font-semibold">Elegí y guardá</div>
                  </div>
                  <p className="mt-3 pl-12 text-muted-foreground">
                    Podés comprar una prenda directa o sumar varias al carrito.
                  </p>
                </li>
                <li className="group rounded-2xl border bg-glass p-6 transition-colors hover:bg-glass/80">
                  <div className="flex items-center gap-4">
                    <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      3
                    </span>
                    <div className="text-lg font-semibold">
                      Comprá por WhatsApp
                    </div>
                  </div>
                  <p className="mt-3 pl-12 text-muted-foreground">
                    El botón “Comprar” abre WhatsApp con un mensaje automático
                    con los detalles.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
