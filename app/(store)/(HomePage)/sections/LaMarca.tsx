import { Badge } from "@/components/ui/badge";

export function LaMarca() {
  return (
    <section
      id="marca"
      className="mt-[10vh] flex min-h-fit md:min-h-[calc(100svh-256px)] md:h-[calc(100svh-256px)] w-full items-center justify-center bg-transparent py-8 sm:py-12 md:py-0 scroll-mt-20 md:scroll-mt-40"
    >
      <div className="w-full max-w-6xl px-4">
        <div className="grid gap-6 md:gap-10 lg:grid-cols-2 lg:items-center">
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

          <div className="grid gap-3 sm:gap-4 grid-cols-2">
            <div className="group rounded-xl sm:rounded-3xl border bg-card p-3 sm:p-5 md:p-6 shadow-2xl transition-all hover:-translate-y-1">
              <div className="text-xs sm:text-base font-semibold">
                Curaduría
              </div>
              <p className="mt-1.5 text-[11px] sm:text-sm text-muted-foreground leading-normal">
                Prendas seleccionadas con enfoque en textura, caída y
                combinabilidad.
              </p>
            </div>
            <div className="group rounded-xl sm:rounded-3xl border bg-card p-3 sm:p-5 md:p-6 shadow-2xl transition-all hover:-translate-y-1">
              <div className="text-xs sm:text-base font-semibold">Estilo</div>
              <p className="mt-1.5 text-[11px] sm:text-sm text-muted-foreground leading-normal">
                Floral moderno, minimal romántico y energía editorial.
              </p>
            </div>
            <div className="group rounded-xl sm:rounded-3xl border bg-card p-3 sm:p-5 md:p-6 shadow-2xl transition-all hover:-translate-y-1">
              <div className="text-xs sm:text-base font-semibold">
                Atención
              </div>
              <p className="mt-1.5 text-[11px] sm:text-sm text-muted-foreground leading-normal">
                Coordinás por WhatsApp, con mensaje automático por prenda o
                por carrito.
              </p>
            </div>
            <div className="group rounded-xl sm:rounded-3xl border bg-card p-3 sm:p-5 md:p-6 shadow-2xl transition-all hover:-translate-y-1">
              <div className="text-xs sm:text-base font-semibold">
                Lanzamientos
              </div>
              <p className="mt-1.5 text-[11px] sm:text-sm text-muted-foreground leading-normal">
                Novedades y drops: destacamos lo mejor de cada temporada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
