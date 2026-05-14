"use client";

import { useTransition, useOptimistic } from "react";
import { eliminarProducto } from "@/actions/admin/productos";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface EliminarProductoButtonProps {
  id: number;
  variant?: "default" | "icon";
}

export function EliminarProductoButton({
  id,
  variant = "default",
}: EliminarProductoButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // useOptimistic: muestra "Eliminando..." de manera instantánea (Fase 5.4)
  const [optimisticLabel, setOptimisticLabel] = useOptimistic(
    "Eliminar",
    (_state: string, action: string) => action,
  );

  const handleDelete = () => {
    if (
      !confirm(
        "¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.",
      )
    )
      return;

    startTransition(async () => {
      setOptimisticLabel("Eliminando...");
      const result = await eliminarProducto(id);
      if (result?.success) {
        toast.success("Producto eliminado.");
        router.push("/dashboard/productos");
        router.refresh();
      } else {
        toast.error("Error al eliminar el producto.");
      }
    });
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleDelete}
        disabled={isPending}
        title="Eliminar"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60 transition"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60 transition"
    >
      <Trash2 className="h-4 w-4" />
      {optimisticLabel}
    </button>
  );
}
