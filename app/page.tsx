import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { ProductCarousel } from "../components/product-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { featuredProducts } from "@/lib/products";

export default function Home() {
  return (
    <main>
      <section className="relative w-full bg-[url('/design/landing-bg.jpg')] bg-cover bg-center bg-no-repeat">
        <div
          className="pointer-events-none absolute inset-0 bg-background/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-6xl px-4 py-10 md:py-0">
          <div className="grid w-full items-center gap-10 md:grid-cols-3">
          <div className="mx-auto w-full max-w-xl space-y-7 rounded-3xl border border-white/15 bg-black/25 p-8 shadow-lg backdrop-blur-md md:col-span-2 md:mx-0 md:max-w-none md:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="gap-1 py-1 text-sm">
                <Sparkles className="size-3.5" />
                Nuevo drop
              </Badge>
            </div>

            <h1 className="text-balance text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Moda delicada, moderna y con identidad.
            </h1>
            <p className="text-balance text-lg leading-relaxed text-white/85 md:text-xl">
              Descubrí prendas seleccionadas para acompañarte con elegancia. Sin
              checkout: coordinás tu compra directo por WhatsApp.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/productos">
                  Ver catálogo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/#marca">Conocer la marca</Link>
              </Button>
            </div>
          </div>

          <div className="hidden md:col-span-1 md:block" aria-hidden="true" />
        </div>
        </div>
      </section>

      <Separator />

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:pb-14 py-12">
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-primary/5 blur-2xl" />
          <div className="rounded-[2.25rem] border bg-glass p-4 shadow-sm">
            <div className="rounded-[1.75rem] border bg-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold tracking-tight">
                  Selección destacada
                </div>
                <Button asChild variant="ghost" className="h-8 px-2 text-sm">
                  <Link href="/productos">Ver todo</Link>
                </Button>
              </div>
              <div className="mt-4">
                <ProductCarousel variant="compact" products={featuredProducts} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section
        id="marca"
        className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16"
      >
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              La marca
            </h2>
            <p className="text-balance text-muted-foreground">
              IMAYKANA nace del amor por los detalles: paletas suaves, estampas
              florales y cortes pensados para realzar. Cada prenda está elegida
              para contar una historia: la tuya.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border bg-card p-5">
              <div className="text-sm font-semibold">Curaduría</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Prendas seleccionadas con enfoque en textura, caída y
                combinabilidad.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <div className="text-sm font-semibold">Estilo</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Floral moderno, minimal romántico y energía editorial.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <div className="text-sm font-semibold">Atención</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Coordinás por WhatsApp, con mensaje automático por prenda o por
                carrito.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-5">
              <div className="text-sm font-semibold">Lanzamientos</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Novedades y drops: destacamos lo mejor de cada temporada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section
        id="como-comprar"
        className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16"
      >
        <div className="rounded-3xl border bg-card p-6 md:p-10">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Cómo comprar
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Rápido y simple. Elegís tus prendas y coordinamos por WhatsApp.
              </p>
            </div>
            <ol className="grid gap-4 md:col-span-2">
              <li className="rounded-2xl border bg-glass p-5">
                <div className="text-sm font-semibold">1) Mirá el catálogo</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Entrá a Productos y explorá: cada card te lleva al detalle.
                </p>
              </li>
              <li className="rounded-2xl border bg-glass p-5">
                <div className="text-sm font-semibold">
                  2) Elegí y guardá
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Podés comprar una prenda directa o sumar varias al carrito.
                </p>
              </li>
              <li className="rounded-2xl border bg-glass p-5">
                <div className="text-sm font-semibold">3) Comprá por WhatsApp</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  El botón “Comprar” abre WhatsApp con un mensaje automático con
                  los detalles.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
