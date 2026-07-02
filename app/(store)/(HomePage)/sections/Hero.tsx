import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full min-h-[calc(100svh-64px)] h-auto md:h-[calc(100svh-64px)] max-h-[900px] bg-[url('/design/landing-bg.jpg')] bg-cover bg-center bg-no-repeat mt-16 scroll-mt-16">
      <div
        className="pointer-events-none absolute inset-0 bg-background/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100svh-64px)] md:h-full w-full max-w-6xl items-center justify-center px-4 py-12 sm:py-16 md:py-0">
        <div className="grid w-full items-center gap-8 md:gap-10 md:grid-cols-3">
          <div className="mx-auto w-full max-w-xl space-y-5 sm:space-y-6 md:space-y-7 rounded-2xl sm:rounded-3xl border border-white/15 bg-black/25 p-6 sm:p-8 shadow-lg backdrop-blur-md md:col-span-2 md:mx-0 md:max-w-none md:p-10">
            <div className="flex flex-wrap items-center gap-2">
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
  );
}
