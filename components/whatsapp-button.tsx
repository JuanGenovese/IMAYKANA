"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { WHATSAPP_PHONE } from "@/lib/site";

export function WhatsAppButton() {
  const message = "Hola, me gustaría charlar con Luciana. Vengo desde la página web";
  const whatsappUrl = buildWhatsAppUrl(WHATSAPP_PHONE, message);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
