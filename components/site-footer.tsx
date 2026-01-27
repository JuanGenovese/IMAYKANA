import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="text-base font-semibold tracking-tight">
              IMAYKANA
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              Prendas seleccionadas con estética floral, delicada y moderna.
              Mirá el catálogo y coordiná tu compra por WhatsApp.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Explorar</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/productos" className="hover:text-foreground">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/#marca" className="hover:text-foreground">
                  La marca
                </Link>
              </li>
              <li>
                <Link href="/#como-comprar" className="hover:text-foreground">
                  Cómo comprar
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="hover:text-foreground">
                  Carrito
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Contacto</div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                <span>hola@imaykana.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>Argentina</span>
              </div>
              <Button asChild variant="outline" className="w-fit">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="gap-2"
                >
                  <Instagram className="size-4" />
                  Instagram
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} IMAYKANA. Todos los derechos reservados.</span>
          <span>Hecho con Next.js + shadcn/ui</span>
        </div>
      </div>
    </footer>
  );
}

