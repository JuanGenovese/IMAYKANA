"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "¿Cerrar sesión?",
  description = "Vas a salir de tu cuenta.",
}: LogoutConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-[fade-in_0.2s_ease-out_forwards]"
        onClick={onClose}
      />
      <div className="relative z-10 w-[90%] max-w-[360px] bg-background border border-border p-6 rounded-2xl shadow-2xl flex flex-col gap-4 animate-[slide-up_0.3s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <LogOut className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-normal">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 text-sm font-medium rounded-xl"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-10 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/95"
            onClick={onConfirm}
          >
            Salir
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
