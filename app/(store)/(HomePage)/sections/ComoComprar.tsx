import { Badge } from "@/components/ui/badge";

export function ComoComprar() {
  return (
    <section
      id="como-comprar"
      className="my-[5vh] flex min-h-fit md:min-h-[calc(100svh-192px)] md:h-[calc(100svh-192px)] w-full items-center justify-center bg-transparent py-8 sm:py-12 md:py-0 scroll-mt-20 md:scroll-mt-32"
    >
      <div className="w-full max-w-6xl px-4">
        <div className="rounded-2xl sm:rounded-3xl border bg-card/80 p-5 sm:p-8 md:p-16 backdrop-blur-md shadow-2xl">
          <div className="grid gap-6 md:gap-16 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4 md:space-y-6">
              <Badge variant="outline" className="w-fit text-xs sm:text-sm">
                Guía
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl">
                Cómo comprar
              </h2>
              <p className="text-xs sm:text-base text-muted-foreground leading-normal">
                Rápido y simple. Elegís tus prendas y coordinamos por
                WhatsApp.
              </p>
            </div>
            <ol className="grid gap-4 md:col-span-2">
              <li className="group rounded-xl sm:rounded-2xl border bg-glass p-4 sm:p-6 transition-colors hover:bg-glass/80">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex size-6 sm:size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-base font-bold">
                    1
                  </span>
                  <div className="text-sm sm:text-lg font-semibold">
                    Mirá el catálogo
                  </div>
                </div>
                <p className="mt-2 pl-9 sm:pl-12 text-xs sm:text-sm text-muted-foreground leading-normal">
                  Entrá a Productos y explorá: cada card te lleva al detalle.
                </p>
              </li>
              <li className="group rounded-xl sm:rounded-2xl border bg-glass p-4 sm:p-6 transition-colors hover:bg-glass/80">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex size-6 sm:size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-base font-bold">
                    2
                  </span>
                  <div className="text-sm sm:text-lg font-semibold">
                    Elegí y guardá
                  </div>
                </div>
                <p className="mt-2 pl-9 sm:pl-12 text-xs sm:text-sm text-muted-foreground leading-normal">
                  Podés comprar una prenda directa o sumar varias al carrito.
                </p>
              </li>
              <li className="group rounded-xl sm:rounded-2xl border bg-glass p-4 sm:p-6 transition-colors hover:bg-glass/80">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex size-6 sm:size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs sm:text-base font-bold">
                    3
                  </span>
                  <div className="text-sm sm:text-lg font-semibold">
                    Comprá por WhatsApp
                  </div>
                </div>
                <p className="mt-2 pl-9 sm:pl-12 text-xs sm:text-sm text-muted-foreground leading-normal">
                  El botón “Comprar” abre WhatsApp con un mensaje automático
                  con los detalles.
                </p>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
