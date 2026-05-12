import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t bg-glass">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-10">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3">
          <div className="space-y-2 sm:space-y-3 sm:col-span-2 md:col-span-1">
            <div className="text-lg sm:text-xl font-serif font-bold tracking-normal">
              IMAYKANA
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-balance">
              Prendas seleccionadas, delicadas y modernas. Mirá el catálogo y
              coordiná tu compra por WhatsApp.
            </p>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="text-xs sm:text-sm font-semibold">Explorar</div>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link
                  href="/productos"
                  className="hover:text-foreground transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link
                  href="/#marca"
                  className="hover:text-foreground transition-colors"
                >
                  La marca
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-comprar"
                  className="hover:text-foreground transition-colors"
                >
                  Cómo comprar
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="hover:text-foreground transition-colors"
                >
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="text-xs sm:text-sm font-semibold">Contacto</div>
            <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="size-3 sm:size-4 shrink-0" />
                <span className="break-all">hola@imaykana.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3 sm:size-4 shrink-0" />
                <span>Jujuy, Argentina</span>
              </div>
              <Button
                asChild
                variant="outline"
                className="w-full sm:w-fit h-9 text-xs sm:text-sm mt-1"
              >
                <a
                  href="https://www.instagram.com/imay.kana/"
                  target="_blank"
                  rel="noreferrer"
                  className="gap-2"
                >
                  <Instagram className="size-3 sm:size-4" />
                  Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 flex flex-col gap-2 border-t pt-4 sm:pt-6 text-[10px] sm:text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} IMAYKANA. Todos los derechos
            reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
